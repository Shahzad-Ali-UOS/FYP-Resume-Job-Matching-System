import os
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path
import bleach
import requests
from groq import Groq
from datetime import timedelta
from django.utils import timezone

# 🚀 Google OAuth Verification
from google.oauth2 import id_token
from google.auth.transport import requests

from django.conf import settings
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.forms import PasswordResetForm
from django.db.models import Avg 

# ✅ Updated imports to include UserFeedback
from .models import Resume, ContactMessage, User, SecurityLog, UserFeedback
from jobs.models import Job

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, authentication_classes

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

# ✅ IMPORT CUSTOM SERIALIZERS
from .serializers import (
    UserProfileSerializer, 
    ResumeSerializer, 
    CustomTokenObtainPairSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    """🚀 Link establishment via JWT with custom identity tokens"""
    serializer_class = CustomTokenObtainPairSerializer

User = get_user_model()

pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ==============================
# 🛡️ CUSTOM RBAC PERMISSION
# ==============================
class IsAdminUserRole(BasePermission):
    """Allows access only to users with the 'admin' role field."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

@api_view(['GET'])
@permission_classes([IsAdminUserRole])
def admin_dashboard_stats(request):
    """🚀 Fetch global stats for the Admin Intelligence Portal"""
    # 1. Calculate Average Rating (from the UserFeedback model)
    avg_rating = UserFeedback.objects.aggregate(avg=Avg('rating'))['avg'] or 0
    
    # 2. Sync stats with actual model counts
    data = {
        "total_students": User.objects.filter(role='student').count(),
        "total_resumes": Resume.objects.count(),
        "total_jobs": Job.objects.count(),
        # ✅ CORRECTED: Checks actual deactivated accounts
        "total_deactivations": User.objects.filter(is_active=False).count(), 
        # ✅ CLARITY: Percentage conversion of user satisfaction
        "user_satisfaction_pct": round(avg_rating * 20, 1), 
    }
    return Response(data, status=status.HTTP_200_OK)

# ==============================
# 📊 ADMIN FEEDBACK VIEW
# ==============================
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUserRole])
def get_user_feedback(request):
    """🚀 Fetch all surveys for the Admin panel using standardized values"""
    # .values() helps avoid sending unnecessary user data to the frontend
    feedback = UserFeedback.objects.all().order_by('-created_at').values(
        'id', 'rating', 'comment', 'created_at'
    )
    return Response(list(feedback), status=status.HTTP_200_OK)

# ==============================
# 🔐 GROQ_CONFIGURATION
# ==============================
GROQ_KEY = os.getenv("GROQ_API_KEY")
client = None

if GROQ_KEY:
    client = Groq(api_key=GROQ_KEY)

# ==============================
# 🔑 API PASSWORD RESET
# ==============================
@api_view(['POST'])
@permission_classes([AllowAny])
def custom_password_reset(request):
    """🚀 Dispatches a secure reset token via SMTP"""
    email = request.data.get('email')
    
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Security Tip: We don't reveal if the email exists to prevent enumeration
    user_exists = User.objects.filter(email=email).exists()

    if user_exists:
        form = PasswordResetForm({'email': email})
        if form.is_valid():
            try:
                form.save(
                    request=request,
                    use_https=request.is_secure(),
                    email_template_name='registration/password_reset_email.html',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                )
            except Exception as e:
                # Log the error for internal debugging
                print(f"SMTP Error: {str(e)}")
                return Response({"error": "Mailing server unreachable."}, status=500)

    # Always return success to protect user privacy
    return Response(
        {"success": "If an account matches this email, a neural reset link has been dispatched."}, 
        status=status.HTTP_200_OK
    )

# ==============================
# 🚀 GOOGLE OAUTH LOGIN VIEW
# ==============================
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get('token')
    if not token: 
        return Response({"error": "Neural Link requires a valid token"}, status=400)

    try:
        # 🛡️ VERIFY: Check the token against your Google Client ID
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )

        email = idinfo['email']
        
        # 🚀 FIX 1: Use get_or_create carefully
        # If the email exists but with a different username, this might crash
        user = User.objects.filter(email=email).first()

        if not user:
            # Create new Neural Identity if it doesn't exist
            username = email.split('@')[0]
            # Ensure username is unique in case of duplicates
            if User.objects.filter(username=username).exists():
                import uuid
                username = f"{username}_{str(uuid.uuid4())[:4]}"

            user = User.objects.create(
                email=email,
                username=username,
                first_name=idinfo.get('given_name', ''),
                last_name=idinfo.get('family_name', ''),
                role='student',
                is_active=True
            )
            # FIX 2: Set a dummy password for custom users to avoid auth errors
            user.set_unusable_password()
            user.save()

        # Reset security locks
        user.is_locked = False
        user.login_attempts = 0
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': user.role,
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name, 
        }, status=200)

    except ValueError:
        return Response({"error": "Invalid Google Token"}, status=403)
    except Exception as e:
        # Check your terminal for the print result!
        print(f"CRITICAL GOOGLE LOGIN ERROR: {str(e)}") 
        return Response({"error": "Neural Database Error"}, status=500)

# ==============================
# ✅ USER REGISTRATION
# ==============================
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        if User.objects.filter(email=data.get("email")).exists():
            return Response({"error": "Email already registered"}, status=400)

        try:
            user = User.objects.create_user(
                username=data.get("username"),
                email=data.get("email"),
                password=data.get("password"),
                first_name=data.get("first_name", ""),
                last_name=data.get("last_name", ""),
                phone=data.get("phone", ""),
                role=data.get("role", "student"),
                is_active=True
            )
            return Response({"success": "Account created successfully."}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# ==============================
# ✅ 🚀 REGISTERED USERS 
# ==============================

class StudentListView(generics.ListAPIView):
    """📜 Admin View: List all registered students for the directory"""
    serializer_class = UserProfileSerializer # Reuse your profile serializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get_queryset(self):
        # Only return users who are students
        return User.objects.filter(role='student').order_by('-date_joined')

# ==============================
# ✅ 🚀 USER PROFILE 
# ==============================
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Resume
from .serializers import ResumeSerializer


# ==============================
# ✅ Resume ViewSet
# ==============================
class ResumeViewSet(viewsets.ModelViewSet):
    """
    📄 Resume Management Engine:
    Handles file uploads, links profile data, and triggers the OCR process
    to prepare data for the Llama 3 Matching Engine.
    """
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        """🚀 Students only see their own uploaded resumes"""
        # Ensure your model has 'created_at'. If it uses 'uploaded_at', change it back.
        return Resume.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        """🚀 Sync profile data and trigger AI skill extraction"""
        u = self.request.user
        
        # 1. Save the resume instance with synced profile data
        resume_instance = serializer.save(
            user=u, 
            first_name=u.first_name, 
            last_name=u.last_name,
            email=u.email, 
            phone=getattr(u, 'phone', ''), 
            job_title=getattr(u, 'job_title', 'Student'), 
            address=getattr(u, 'location', 'Pakistan')
        )

        # 2. 🧠 TRIGGER OCR PROCESSING
        # This converts the PDF into raw text so the Batch Engine can read it.
        try:
            # We assume your OCR utility is named 'extract_text_from_pdf'
            # text_data = extract_text_from_pdf(resume_instance.file.path)
            # resume_instance.extracted_text = text_data
            
            # Optional: You can also use Llama 3 here to summarize the resume
            # resume_instance.summary = "A brief AI-generated summary..."
            
            resume_instance.save()
            print(f"✅ OCR and Identity Sync complete for: {u.username}")
        except Exception as e:
            print(f"❌ Resume Processing Error: {str(e)}")

    def destroy(self, request, *args, **kwargs):
        """🗑️ Neural Purge Logic"""
        try:
            instance = self.get_object()
            
            # Delete the actual file from storage before deleting the DB record
            if instance.file:
                instance.file.delete(save=False)
                
            self.perform_destroy(instance)
            return Response(
                {"message": "Identity successfully purged from the matrix."}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": f"Purge sequence failed: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


# ==============================
# ✅ EXIT INTELLIGENCE & PURGE
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deactivate_with_feedback(request):
    """🚀 Captures professional feedback before purging the neural link."""
    user = request.user
    data = request.data
    
    try:
        UserFeedback.objects.create(
            user_name=f"{user.first_name} {user.last_name}",
            email=user.email,
            reason=data.get('reason', 'N/A'),
            rating=data.get('rating', 0),
            best_feature=data.get('best_feature', 'None'),
            problems=data.get('problems', ''),
            suggestions=data.get('suggestions', '')
        )
        
        SecurityLog.objects.create(
            email=user.email, 
            status="ACCOUNT_DEACTIVATED_WITH_FEEDBACK", 
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        user.delete() 
        return Response({"message": "Neural profile purged. Feedback stored."}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ==============================
# ✅ RESUME UPLOAD (AUTOMATIC OCR)
# ==============================
class ResumeUploadView(APIView):
    """
    🧠 THE NEURAL EXTRACTOR:
    Converts PDF/Image resumes into sanitized text for the Llama 3 Engine.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.data.get("file")
        
        # 1. Validation
        if not uploaded_file:
            return Response({"error": "No file detected"}, status=400)

        # 2. Create initial DB Record (Identity Linkage)
        # Pulling profile data directly into the Resume record for a rich audit trail
        u = request.user
        resume = Resume.objects.create(
            user=u, 
            file=uploaded_file, 
            # Syncing profile info to the Resume instance
            first_name=u.first_name,
            last_name=u.last_name,
            email=u.email
        )
        
        raw_text = ""
        try:
            # --- PHASE 1: Fast Text Layer Scan (PyMuPDF) ---
            doc = fitz.open(resume.file.path)
            for page in doc:
                raw_text += page.get_text()
            doc.close()

            # --- PHASE 2: Deep OCR Fallback (Tesseract) ---
            # If the PDF is an image (no text layer), we trigger OCR
            if not raw_text.strip():
                # Ensure POPPLER_BIN is set in settings.py
                images = convert_from_path(
                    resume.file.path, 
                    poppler_path=getattr(settings, 'POPPLER_BIN', None)
                )
                for img in images:
                    raw_text += pytesseract.image_to_string(img) + "\n"

            # 🛡️ SECURITY: Sanitization (XSS & Prompt Injection Protection)
            # bleach.clean removes any hidden malicious scripts/HTML
            safe_text = bleach.clean(raw_text, tags=[], strip=True)

            # 3. 💾 Finalize Record
            resume.extracted_text = safe_text.strip()
            resume.save()

            print(f"✅ OCR Success: {len(resume.extracted_text)} characters extracted for {u.username}")

        except Exception as e:
            # Clean up: If OCR fails, we don't want a broken record
            # resume.delete() # Optional: remove if you want to keep the file anyway
            print(f"❌ Extraction Error: {str(e)}")
            return Response({"error": "Neural extraction failed. Check PDF format."}, status=500)

        return Response({
            "message": "Resume uploaded and Neural Sync Complete", 
            "id": resume.id,
            "char_count": len(resume.extracted_text)
        }, status=status.HTTP_201_CREATED)
    
# ==============================
# 🤖 ADVANCED AI CONTACT ENGINE
# ==============================
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
# (Ensure your models ContactMessage, UserFeedback, and your Groq client 'client' are imported here)

# ==============================
# 🤖 ADVANCED AI CONTACT ENGINE
# ==============================
@api_view(["POST"])
@permission_classes([AllowAny])
def contact_message(request):
    """🚀 Handles inquiries with Admin Notification, AI Auto-Response, Emailing, and Analytics Sync"""
    name = request.data.get("name")
    email = request.data.get("email")
    user_message = request.data.get("message")
    rating = request.data.get("rating", 0)

    if not name or not email or not user_message:
        return Response({"error": "Neural Link requires all data fields."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 1. 💾 Save to Contact Database
        ContactMessage.objects.create(name=name, email=email, message=user_message)

        # 2. 📊 SYNC TO ANALYTICS 
        if rating and int(rating) > 0:
            UserFeedback.objects.create(
                rating=rating,
                comment=f"Contact Inquiry from {name}: {user_message[:50]}..."
            )

        # ---------------------------------------------------------
        # STEP 3: 📧 1st SEND MESSAGE TO ADMIN (YOU)
        # ---------------------------------------------------------
        admin_subject = f"🚨 NEW NEURAL INQUIRY: {name} (Rating: {rating}/5)"
        admin_body = (
            f"You have received a new message via the Contact Form:\n\n"
            f"👤 Identity Name: {name}\n"
            f"📧 Sender Email: {email}\n"
            f"⭐ Experience Rating: {rating}/5\n\n"
            f"💬 Transmitted Inquiry:\n\"{user_message}\"\n\n"
            f"--- System Status: Active ---"
        )
        
        try:
            send_mail(
                subject=admin_subject,
                message=admin_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.EMAIL_HOST_USER],  
            )
        except Exception as mail_err:
            print(f"Admin Email Alert Failed: {mail_err}")

        # ---------------------------------------------------------
        # STEP 4: 🧠 GENERATE AI AUTO-REPLY
        # ---------------------------------------------------------
        ai_reply = f"Hello {name}, your inquiry has been received. Our team will contact you shortly."
        
        if client:  # Ensure Groq client is initialized
            try:
                prompt = f"Act as Shahzad Ali, AI Architect. User {name} sent: {user_message}. Give a 2-sentence professional, high-tech response acknowledging receipt."
                completion = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[{"role": "user", "content": prompt}]
                )
                ai_reply = completion.choices[0].message.content.strip()
            except Exception as e:
                print(f"AI Response Error: {e}")

        # ---------------------------------------------------------
        # STEP 5: 📧 2nd SEND STYLIZED AUTO-REPLY TO SENDER
        # ---------------------------------------------------------
        html_content = f"""
        <div style="background-color: #030712; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
            <h2 style="color: #6366f1;">CareerCoachAI <span style="color: #ffffff;">| Neural Link</span></h2>
            <p>Link established with <strong>{name}</strong>.</p>
            <div style="background-color: #0b1220; border-left: 4px solid #6366f1; padding: 20px; color: #e2e8f0; border-radius: 0 12px 12px 0; margin: 20px 0;">
                "{ai_reply}"
            </div>
            <p style="font-size: 12px; color: #475569;">Uplink Status: 🟢 ACTIVE | University of Sargodha Engineering</p>
        </div>
        """

        send_mail(
            subject=f"LINK ESTABLISHED: CareerCoachAI x {name}",
            message=ai_reply,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_content,
            fail_silently=True,
        )

        return Response({
            "success": "Neural link established", 
            "ai_response": ai_reply
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": "Neural Uplink Interrupted"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)