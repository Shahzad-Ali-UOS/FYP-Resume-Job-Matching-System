from django.contrib import admin
from django.utils.html import format_html
from .models import Job, MatchHistory

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "title", 
        "company_name", 
        "job_type", 
        "salary_range", 
        "display_skills", 
        "view_apply_link", 
        "source", 
        "is_active"
    )
    
    search_fields = ("title", "company_name", "description", "salary_range", "source", "apply_link")
    
    list_filter = ("job_type", "is_active", "created_at", "source", "experience_level") 

    def display_skills(self, obj):
        """Formats the JSON list into a readable string for the admin table"""
        if isinstance(obj.skills_required, list):
            return ", ".join(obj.skills_required) if obj.skills_required else "No skills listed"
        return str(obj.skills_required)
    
    display_skills.short_description = "Required Skills"

    def view_apply_link(self, obj):
        """Returns a clickable link in the admin table"""
        if obj.apply_link:
            return format_html(
                '<a href="{}" target="_blank" style="color: #447e9b; font-weight: bold;">🔗 View Link</a>', 
                obj.apply_link
            )
        return "No Link"
    
    view_apply_link.short_description = "Apply Link" 


@admin.register(MatchHistory)
class MatchHistoryAdmin(admin.ModelAdmin):
    """
    📊 Audit Log for AI Matches:
    This section allows you to prove to the examiners that the 
    Llama 3 engine is actually running and storing data.
    """
    list_display = ("user", "job", "match_percentage", "created_at")
    
    # Robust search using double underscores to reach into the User and Job models
    search_fields = ("user__username", "user__email", "job__title", "job__company_name") 
    
    list_filter = ("created_at", "match_percentage")
    
    # 🔒 Match history is an 'Audit Trail' - it should be read-only
    readonly_fields = (
        "user", "resume", "job", "matched_skills", 
        "missing_skills", "match_percentage", "ai_reason", "created_at"
    )

    def has_add_permission(self, request):
        """Prevents manual creation: data must come from the AI Engine."""
        return False 

    def has_change_permission(self, request, obj=None):
        """Maintains data integrity: results cannot be modified."""
        return False