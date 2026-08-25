from django.urls import path, include
from django.contrib.auth import views as auth_views 
from rest_framework.routers import DefaultRouter
from . import views 
from .views import (
    UserProfileView,
    ResumeUploadView,
    ResumeViewSet, 
    contact_message,
    RegisterView,
    CustomTokenObtainPairView,
    google_login,
    custom_password_reset,
    admin_dashboard_stats,
    deactivate_with_feedback, 
    get_user_feedback,
    StudentListView,
)

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')

urlpatterns = [
    # ==============================
    # 🔐 AUTHENTICATION & VERIFICATION
    # ==============================
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('google-login/', google_login, name='google-login'),

    # ==============================
    # ✅ USER PROFILE & MASTER DATA
    # ==============================
    # Cleaned path: /api/users/profile/
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    # ==============================
    # 📊 EXIT INTELLIGENCE & PURGE
    # ==============================
    # Cleaned path: /api/users/deactivate-feedback/
    path('deactivate-feedback/', deactivate_with_feedback, name='deactivate-feedback'),
    
    # ==============================
    # 📊 ADMIN INTELLIGENCE PORTAL
    # ==============================
    path('dashboard-stats/', admin_dashboard_stats, name='admin-stats'),
    path('admin/feedback/', get_user_feedback, name='admin-feedback'),
    path('students/', StudentListView.as_view(), name='student-list'), 

    # ==============================
    # 🚀 MULTI-STEP RESUME BUILDER WORKSPACE
    # ==============================
    # This includes all router-generated paths at the root of /api/users/
    path('', include(router.urls)), 
    
    # Legacy upload endpoint for PDF OCR extraction
    # Cleaned path: /api/users/resume/
    path('resume-upload/', ResumeUploadView.as_view(), name='resume-ocr-upload'),
    
    # ==============================
    # 🤖 AI & TOOLS
    # ==============================
    path('contact/', contact_message, name='contact_message'),

    # ==============================
    # 🚀 FORGOT PASSWORD FLOW (API BASED)
    # ==============================
    path('password-reset/', custom_password_reset, name='password_reset'),
    
    path('password-reset/done/', 
         auth_views.PasswordResetDoneView.as_view(
             template_name='registration/password_reset_done.html'
         ), 
         name='password_reset_done'),
    
    path('password-reset-confirm/<uidb64>/<token>/', 
         auth_views.PasswordResetConfirmView.as_view(
             template_name='registration/password_reset_confirm.html'
         ), 
         name='password_reset_confirm'),
    
    path('password-reset-complete/', 
         auth_views.PasswordResetCompleteView.as_view( 
             template_name='registration/password_reset_complete.html'
         ), 
        name='password_reset_complete'),
]