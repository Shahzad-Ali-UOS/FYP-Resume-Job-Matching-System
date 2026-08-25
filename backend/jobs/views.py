import os
import json
import requests
import time
import random 
from bs4 import BeautifulSoup
from groq import Groq

# Django Core
from django.db.models import Q
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Count, Avg
from django.db.models.functions import TruncDay

# REST Framework
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes

# Local App Imports
from users.models import Resume
from .models import Job, MatchHistory
from .serializers import JobSerializer, MatchHistorySerializer

# --- GLOBAL CONFIGURATION ---
User = get_user_model()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# 🌐 Initialize the session at the top level
session = requests.Session()

# 🕵️ Define headers globally so 'session.headers.update' always finds them
SCRAPER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/",
    "DNT": "1",
    "Connection": "keep-alive"
}
# ==============================================================
# 🧠 AI MATCH ENGINE
# ==============================================================
def calculate_neural_match(resume_text, job_title, job_description, resume_metadata=None):
    """
    Enhanced Match Engine: Guarantees matched/missing skill extraction.
    """
    GROQ_KEY = os.getenv("GROQ_API_KEY") 
    if not GROQ_KEY:
        return {"score": 0, "matched_skills": [], "missing_skills": [], "reason": "API Key Missing"}

    client = Groq(api_key=GROQ_KEY)
    meta = resume_metadata or {}
    
    # 📝 IMPROVED PROMPT: Forces structured skill extraction
    prompt = f"""
    Act as a senior HR Tech ATS. Perform a Deep Skill Gap Analysis.
    
    CANDIDATE PROFILE: {meta.get('skills', 'N/A')}
    RESUME SUMMARY: {resume_text[:2000]}
    
    JOB: {job_title}
    JOB REQUIREMENTS: {job_description[:1200]}
    
    Compare the resume skills against the job requirements.
    Return ONLY a JSON object with these exact keys:
    {{
        "score": (int 0-100),
        "matched_skills": ["List", "of", "skills", "found"],
        "missing_skills": ["List", "of", "required", "skills", "NOT", "found"],
        "reason": "Professional analysis summary"
    }}
    Ensure all lists are non-empty if skills exist.
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[
                {"role": "system", "content": "You are a professional ATS Match Engine. Output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )
        
        raw_content = response.choices[0].message.content.strip()
        # Clean JSON markdown
        clean_json = raw_content.replace('```json', '').replace('```', '').strip()
        start = clean_json.find('{')
        end = clean_json.rfind('}')
        if start != -1 and end != -1:
            clean_json = clean_json[start:end+1]
        
        data = json.loads(clean_json)
        
        # 🛡️ VALIDATION: Guarantee structure for the frontend
        return {
            "score": data.get("score", 0),
            "matched_skills": data.get("matched_skills", []),
            "missing_skills": data.get("missing_skills", []),
            "reason": data.get("reason", "Analysis complete.")
        }

    except Exception as e:
        print(f"Neural Match Engine Error: {str(e)}")
        return {
            "score": 0, 
            "matched_skills": [], 
            "missing_skills": [], 
            "reason": "Analysis failed to process. Ensure resume is valid."
        }
    
# ==============================================================
# 🧠 AI JOB ARCHITECT ( Groq/Llama 3)
# ==============================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser]) 
def generate_job_ai(request):
    """🚀 Automatically generate a full job posting based on a title/prompt"""
    job_prompt = request.data.get("prompt")
    
    if not job_prompt or len(job_prompt) < 3:
        return Response(
            {"error": "Provide a valid job title or prompt (min 3 chars)."}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    GROQ_KEY = os.getenv("GROQ_API_KEY")
    if not GROQ_KEY:
        return Response(
            {"error": "AI Engine Offline (Groq Key Missing)"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    client = Groq(api_key=GROQ_KEY)
    
    instruction = f"""
    Act as an Expert HR Tech. Generate a professional job posting for: {job_prompt}.
    Return ONLY a JSON object with exactly these keys: 
    "title", "company_name", "location", "job_type", "description", "skills_required", "salary_range", "experience_level".
    
    Rules:
    1. "skills_required" MUST be a LIST of strings.
    2. "job_type" MUST be one of: "Full-time", "Internship", "Contract", "Freelance".
    3. Return RAW JSON ONLY. No markdown, no conversational text.
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[
                {"role": "system", "content": "You are a professional HR data architect who outputs only valid JSON."},
                {"role": "user", "content": instruction}
            ],
            temperature=0.4,
        )
        
        clean_text = response.choices[0].message.content.strip()
        
        # 🧹 Robust cleaning for any accidental markdown
        if clean_text.startswith("```"):
            # Splits by ``` and takes the content in between, removing the 'json' tag if present
            clean_text = clean_text.split("```")[1].replace("json", "").strip()
            
        job_data = json.loads(clean_text)
        return Response(job_data, status=status.HTTP_200_OK)
        
    except json.JSONDecodeError:
        return Response(
            {"error": "AI returned invalid format. Try a more specific job title."}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {"error": f"AI Generation Failed: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
# ==============================
# LIST USER JOBS
# ==============================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_job_list(request):
    category = request.query_params.get('category')
    jobs = Job.objects.filter(is_active=True)
    
    if category:
        jobs = jobs.filter(category=category)
        
    data = jobs.values('id', 'title', 'company_name', 'location', 'apply_link', 'job_type')
    return Response(list(data), status=status.HTTP_200_OK)

# ==============================
# ✅ CREATE + LIST USER JOBS
# ==============================
class JobCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # Defensive check for user role
        user_role = getattr(self.request.user, 'role', 'student')

        if user_role == 'admin':
            return Job.objects.filter(user=self.request.user).order_by('-created_at')
        
        return Job.objects.filter(is_active=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ==============================
# 🗑️ DELETE JOB (Admin Only)
# ==============================
class JobDeleteView(generics.DestroyAPIView):
    """
    🛡️ SECURE DELETION: 
    - Only users with the 'Staff' status (IsAdminUser) can access this.
    - Admins can only delete jobs they personally added/scraped.
    """
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        """
        🎯 TARGETED QUERYSET:
        Filters the available jobs to only those owned by the current user.
        Superusers can see and delete everything.
        """
        user = self.request.user
        if user.is_superuser:
            return Job.objects.all()
        return Job.objects.filter(user=user)

    def perform_destroy(self, instance):
        """
        Executes the actual deletion. The get_queryset already ensures 
        ownership, so we just call delete here.
        """
        instance.delete()

# ==============================
# 📈 ADMIN ANALYTICS (Charts) - SECURE
# ==============================
class AdminDashboardStatsView(APIView):
    """
    📊 Admin Intelligence Portal:
    Provides high-level analytics for the UOS dashboard.
    Restricted to users with 'Staff' status.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        try:
            # 📉 Aggregate Match History by Day (for the line chart)
            match_data = (
                MatchHistory.objects.annotate(day=TruncDay('created_at'))
                .values('day')
                .annotate(count=Count('id'))
                .order_by('day')
            )
            
            # 👥 Aggregate User Registrations by Day
            user_data = (
                User.objects.annotate(day=TruncDay('date_joined'))
                .values('day')
                .annotate(count=Count('id'))
                .order_by('day')
            )

            # 🔄 Prepare data for Frontend Charts
            chart_data = []
            for entry in match_data:
                day_str = entry['day'].strftime('%a') # e.g., 'Mon', 'Tue'
                # Match registration data to the same day
                u_count = next((u['count'] for u in user_data if u['day'] == entry['day']), 0)
                chart_data.append({
                    "name": day_str,
                    "matches": entry['count'],
                    "users": u_count
                })

            # 🚀 Final Payload for the Admin Portal
            stats = {
                "total_students": User.objects.filter(role='student').count(),
                "total_resumes": Resume.objects.count(),
                "total_jobs": Job.objects.count(),
                "total_deactivations": User.objects.filter(is_active=False).count(),
                # Average score across all students
                "avg_score": round(MatchHistory.objects.aggregate(avg=Avg('match_percentage'))['avg'] or 0, 1),
                "chartData": chart_data
            }
            
            return Response(stats, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": f"Stats Error: {str(e)}"}, status=500)

# ==============================
# ✅ VIEW MATCH HISTORY
# ==============================
class MatchHistoryListView(generics.ListAPIView):
    """
    📜 Student History:
    Allows students to view their past match scores and AI insights.
    """
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        🛡️ Returns only the history for the logged-in user.
        🚀 Optimized with select_related for faster job/resume data loading.
        """
        return (
            MatchHistory.objects.filter(user=self.request.user)
            .select_related('job', 'resume') # Performance boost for the dashboard
            .order_by('-created_at')
        )

# ==============================
# ✅ SCRAPER VIEW
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_custom_scraped_jobs(request):
    search_query = request.data.get('search', 'Graphic Designer')
    
    if not GROQ_API_KEY:
        return Response({"error": "GROQ_API_KEY is missing from .env"}, status=500)
        
    client = Groq(api_key=GROQ_API_KEY) 
    new_jobs_count = 0
    
    clean_query = search_query.lower().replace(' ', '-')
    target_url = f"https://remoteok.com/remote-{clean_query}-jobs"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    }
    
    try:
        print(f"--- Starting Live Sync for: {search_query} ---")
        response = requests.get(target_url, headers=headers, timeout=15)
        
        if response.status_code != 200:
            return Response({"error": f"Site Error: {response.status_code}"}, status=502)

        soup = BeautifulSoup(response.text, 'html.parser')
        # Select all job rows
        raw_items = soup.select('tr.job')
        print(f"Found {len(raw_items)} total table rows. Filtering for data...")

        processed_count = 0
        for index, item in enumerate(raw_items):
            if processed_count >= 5: break 

            try:
                # 🛠️ NEW 2026 LOGIC: Find the FIRST link in the row and use its parent as the text source
                # This bypasses specific class names like 'company_and_position'
                link_tag = item.find('a', href=True)
                if not link_tag:
                    continue 

                # The parent cell usually contains the Title, Company, and Description
                data_cell = link_tag.parent
                raw_text = data_cell.get_text(separator=' ', strip=True)
                
                # If the immediate parent is too small, look at the whole row's text
                if len(raw_text) < 50:
                    raw_text = item.get_text(separator=' ', strip=True)

                # Skip if still empty
                if len(raw_text) < 30: continue

                # ✅ SUCCESS: We found text
                print(f"💎 Node {index} Data Found: {raw_text[:60]}...")
                
                # Construct the link
                href = link_tag['href']
                job_url = f"https://remoteok.com{href}" if href.startswith('/') else href

                print(f"🧠 Node {index}: Calling Llama 3...")

                structure_prompt = (
                    f"Extract job details. Return JSON ONLY.\n"
                    f"Keys: 'title', 'company', 'location', 'salary', 'type', 'skills', 'experience'.\n"
                    f"Text: {raw_text[:1200]}"
                )

                ai_sync = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[{"role": "user", "content": structure_prompt}],
                    response_format={"type": "json_object"} 
                )
                
                job_data = json.loads(ai_sync.choices[0].message.content)
                title = job_data.get('title')
                company = job_data.get('company', 'Remote Company')

                if title:
                    skills = job_data.get('skills', [])
                    if isinstance(skills, str):
                        skills = [s.strip() for s in skills.split(',')]
                
                    Job.objects.update_or_create(
                        title=title,
                        company_name=company,
                        defaults={
                            'user': request.user,
                            'location': job_data.get('location', 'Remote'),
                            'job_type': job_data.get('type', 'Full-time'),
                            'salary_range': job_data.get('salary', 'Competitive'), 
                            'skills_required': skills, 
                            'experience_level': job_data.get('experience', 'Junior'),
                            'description': raw_text[:1000],
                            'apply_link': job_url,
                            'source': 'RemoteOK Live Sync'
                        }
                    )
                    
                    processed_count += 1
                    print(f"✅ SAVED: {title}")

            except Exception as e:
                print(f"⚠️ Node {index} Skip: {str(e)}")
                continue

        return Response({"message": f"Sync Successful! {new_jobs_count} jobs added."})

    except Exception as e:
        print(f"🛑 Critical Sync Failure: {str(e)}")
        return Response({"error": str(e)}, status=500)
    
# ==============================================================
# 🛠️ LOCAL DETERMINISTIC MATCH ENGINE 
# ==============================================================
def calculate_local_match(resume_skills, job_skills):
    """
    Fast, local keyword intersection.
    resume_skills: expect a comma-separated string or list.
    job_skills: expect a list.
    """
    # 1. Normalize
    if isinstance(resume_skills, str):
        r_set = {s.strip().lower() for s in resume_skills.split(',') if s.strip()}
    else:
        r_set = {str(s).strip().lower() for s in resume_skills if str(s).strip()}
        
    j_set = {str(s).strip().lower() for s in job_skills if str(s).strip()}
    
    if not j_set: return 0, [], []
    
    # 2. Intersect
    matched = r_set.intersection(j_set)
    missing = j_set - r_set
    
    # 3. Calculate score
    score = int((len(matched) / len(j_set)) * 100)
    
    return score, list(matched), list(missing)
    
# ==============================================================
# ✅ ANALYZE MATCH  VIEW 
# ==============================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_match(request):
    resume_id = request.data.get('resume_id')
    job_id = request.data.get('job_id')

    if not resume_id or not job_id:
        return Response({"error": "Missing IDs"}, status=400)

    try:
        resume = Resume.objects.get(id=resume_id, user=request.user)
        job = Job.objects.get(id=job_id)

        # 1. Check existing match
        existing = MatchHistory.objects.filter(resume=resume, job=job).first()
        if existing:
            return Response({
                "score": existing.match_percentage,
                "matched_skills": existing.matched_skills,
                "missing_skills": existing.missing_skills,
                "reason": existing.ai_reason
            })

        # 2. RUN LOCAL MATCH (The "Fast" Check)
        score, matched, missing = calculate_local_match(resume.skills, job.skills_required)

        # 3. DECISION ENGINE
        # If score is > 60%, we trust it as a match, skip AI, return immediately.
        if score >= 60:
            result = {
                "score": score,
                "matched_skills": matched,
                "missing_skills": missing,
                "reason": "High confidence match based on core technical skill alignment."
            }
        else:
            # Only trigger AI if local match is low/inconclusive
            result = calculate_neural_match(
                resume_text=resume.extracted_text,
                job_title=job.title,
                job_description=job.description,
                resume_metadata={"summary": resume.summary, "skills": resume.skills}
            )

        # 4. Save result
        MatchHistory.objects.create(
            user=request.user, resume=resume, job=job,
            match_percentage=result.get('score', 0),
            matched_skills=result.get('matched_skills', []),
            missing_skills=result.get('missing_skills', []),
            ai_reason=result.get('reason')
        )

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Analysis failed: {str(e)}"}, status=500)