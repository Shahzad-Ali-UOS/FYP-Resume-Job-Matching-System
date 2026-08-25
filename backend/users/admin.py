from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Resume, ContactMessage, SecurityLog, UserFeedback

# ==============================
# 🔐 SECURITY AUDIT LOGS
# ==============================
@admin.register(SecurityLog)
class SecurityLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'email', 'ip_address', 'status')
    list_filter = ('status', 'timestamp')
    search_fields = ('email', 'ip_address')
    readonly_fields = ('timestamp', 'email', 'ip_address', 'user_agent', 'status')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

# ==============================
# 👤 CUSTOM USER ADMIN
# ==============================
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'role', 'is_active', 'is_locked', 'is_staff')
    list_filter = ('role', 'is_active', 'is_locked', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Security & Lockout', {'fields': ('login_attempts', 'last_attempt_time', 'is_locked')}),
        ('Neural Profile', {'fields': ('role', 'bio', 'phone', 'profile_image', 'job_title', 'location', 'skills', 'linkedin_url', 'github_url')}),
    )

# ==============================
# 📄 RESUME & CONTACTS
# ==============================
@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'created_at', 'id')
    search_fields = ('user__email', 'title')
    readonly_fields = ('created_at',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'created_at')
    search_fields = ('email', 'name')
    readonly_fields = ('created_at',)

# ==============================
# 📊 EXIT INTELLIGENCE (NEW)
# ==============================
@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    # Displays the key intelligence data at a glance
    list_display = ('user_name', 'reason', 'rating', 'best_feature', 'created_at')
    
    # Allows admin to filter by rating or reason for leaving
    list_filter = ('rating', 'reason', 'best_feature', 'created_at')
    
    # Search functionality
    search_fields = ('user_name', 'email', 'problems', 'suggestions')
    
    # Keeping it as read-only to preserve original user feedback integrity
    readonly_fields = ('user_name', 'email', 'reason', 'rating', 'best_feature', 'problems', 'suggestions', 'created_at')

    def has_add_permission(self, request):
        return False