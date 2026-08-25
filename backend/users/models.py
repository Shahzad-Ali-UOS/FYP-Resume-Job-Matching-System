from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
import os
from PIL import Image  # 🚀 Required for Image Compression

# ✅ Custom User Model
class User(AbstractUser):
    # 🔑 RBAC LOGIC: Define Role Choices
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
    )
    
    email = models.EmailField(unique=True)
    
    # 🚀 Role Field (Crucial for Dashboard/Sidebar logic)
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='student',
        help_text="Determines if the user sees Student or Admin dashboard features"
    )
    
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=15, blank=True)
    
    # 🚀 Profile Picture
    profile_image = models.ImageField(upload_to="profiles/", null=True, blank=True)

    # 🚀 SECURITY: Login Attempt Counter & Lockout Fields
    login_attempts = models.IntegerField(default=0)
    last_attempt_time = models.DateTimeField(null=True, blank=True)
    is_locked = models.BooleanField(default=False)

    # 🚀 CAREER MASTER DATA (Global Defaults)
    job_title = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True, default="Sargodha, Pakistan")
    skills = models.TextField(blank=True, help_text="Comma separated skills for AI processing")
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"

    # 🚀 IMAGE COMPRESSION LOGIC
    # Overriding the save method to ensure high-performance image processing
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.profile_image:
            try:
                img = Image.open(self.profile_image.path)

                # Resize logic: 400x400 max (Standard for web avatars)
                if img.height > 400 or img.width > 400:
                    output_size = (400, 400)
                    img.thumbnail(output_size)
                    # We save with optimize=True and quality=85 to balance clarity and speed
                    img.save(self.profile_image.path, optimize=True, quality=85)
            except Exception as e:
                print(f"Image optimization skipped: {e}")


# ✅ PDF Validation Helper
def validate_pdf(value):
    ext = os.path.splitext(value.name)[1]
    if ext.lower() != ".pdf":
        raise ValidationError("Only PDF files are allowed.")


# ✅ RESUME MODEL
class Resume(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="resumes"
    )
    
    # 📋 Meta Info
    title = models.CharField(max_length=255, default="Untitled Resume")
    theme_color = models.CharField(max_length=20, default="#4f46e5")
    template_id = models.CharField(max_length=50, default="modern")
    
    # 👤 Personal Details
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    
    # 🧠 Content Sections
    summary = models.TextField(blank=True)
    
    # 🚀 JSON Storage
    experience = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)

    # 📂 File Attachments
    file = models.FileField(
        upload_to="resumes/",
        validators=[validate_pdf],
        null=True, 
        blank=True
    )
    extracted_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.user.email})"


# ✅ Contact Message Model
class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


# ✅ SECURITY: Security Audit Log Model
class SecurityLog(models.Model):
    email = models.EmailField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="FAILED")

    def __str__(self):
        return f"{self.email} - {self.status} at {self.timestamp}"


# ✅ EXIT INTELLIGENCE: User Feedback Model
class UserFeedback(models.Model):
    user_name = models.CharField(max_length=255)
    email = models.EmailField()
    reason = models.CharField(max_length=100)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    best_feature = models.CharField(max_length=100)
    problems = models.TextField(blank=True)
    suggestions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.reason}"