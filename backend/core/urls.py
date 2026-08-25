from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from users.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ USERS API
    path('api/users/', include('users.urls')),

    # ✅ JOBS API
    path('api/jobs/', include('jobs.urls')),

    # ✅ JWT Login
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # ✅ JWT Refresh
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)