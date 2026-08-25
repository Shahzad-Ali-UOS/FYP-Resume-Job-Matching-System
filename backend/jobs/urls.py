from django.urls import path
from django.http import HttpResponse
from .views import (
    JobCreateView,
    MatchHistoryListView,
    AdminDashboardStatsView,
    JobDeleteView,
    sync_custom_scraped_jobs,
    generate_job_ai,
    get_job_list, 
    analyze_match
)

urlpatterns = [
    path('favicon.ico', lambda request: HttpResponse(status=204)),

    # --- NEW: Optimized Architecture ---
    path('list/', get_job_list, name='get-job-list'),      
    path('analyze/', analyze_match, name='analyze-match'), 

    # --- Job Management ---
    path('create/', JobCreateView.as_view(), name='jobs-list-create'),
    path('delete/<int:pk>/', JobDeleteView.as_view(), name='job-delete'),
    path('generate-ai/', generate_job_ai, name='generate-job-ai'),
    
    # --- Matching & Analytics ---
    path('history/', MatchHistoryListView.as_view(), name='match-history'),
    path('dashboard-stats/', AdminDashboardStatsView.as_view(), name='dashboard-stats'),

    # --- External Sync ---
    path('sync-jobs/', sync_custom_scraped_jobs, name='sync-scraped-jobs')
]