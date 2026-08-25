from django.db import models
from django.conf import settings

# ==============================================================
# ✅ MASTER JOB MODEL
# ==============================================================
class Job(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="jobs",
        null=True,
        blank=True
    )
    
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255, default="Neural Corp")
    location = models.CharField(max_length=255, default="Pakistan")
    
    JOB_TYPE_CHOICES = [
        ('Full-time', 'Full-time'),
        ('Internship', 'Internship'),
        ('Contract', 'Contract'),
        ('Freelance', 'Freelance'),
    ]
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES, default='Full-time')
    
    description = models.TextField()
    requirements = models.TextField(blank=True, null=True) 
    skills_required = models.JSONField(default=list)
    salary_range = models.CharField(max_length=100, blank=True, null=True)
    
    experience_level = models.CharField(max_length=50, default="Junior")
    is_active = models.BooleanField(default=True)
    
    apply_link = models.URLField(max_length=500, blank=True, null=True) 
    source = models.CharField(max_length=50, default="Internal") 
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.company_name} ({self.source})"


# ==============================================================
# ✅ NEURAL MATCH HISTORY MODEL
# ==============================================================
class MatchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="match_history")
    resume = models.ForeignKey("users.Resume", on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    
    match_percentage = models.FloatField()
    matched_skills = models.JSONField(default=list) 
    missing_skills = models.JSONField(default=list) 
    
    ai_reason = models.TextField(blank=True, null=True) 
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} -> {self.job.title} ({self.match_percentage}%)"