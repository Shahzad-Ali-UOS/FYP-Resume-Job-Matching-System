from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import timedelta

# Load environment variables from .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

TESSERACT_CMD = os.getenv('TESSERACT_CMD', r'C:\Program Files\Tesseract-OCR\tesseract.exe')

POPPLER_PATH = os.path.join(
    BASE_DIR, 
    'downloads', 
    'Release-25.12.0-0', 
    'poppler-25.12.0', 
    'Library', 
    'bin'
)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"] 

# ========================
# INSTALLED APPS
# ========================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',

    # Local apps
    'users',
    'jobs',

    #security app
    'axes',
]

# ========================
# MIDDLEWARE
# ========================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'axes.middleware.AxesMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

# ========================
# TEMPLATES
# ========================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'], 
        'APP_DIRS': True, 
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ========================
# DATABASE
# ========================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ========================
# INTERNATIONALIZATION
# ========================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Karachi' 
USE_I18N = True
USE_TZ = True

# ========================
# STATIC & MEDIA FILES
# ========================
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ========================
# CUSTOM USER MODEL
# ========================
AUTH_USER_MODEL = 'users.User'

# ========================
# ✅ DRF + JWT SETTINGS
# ========================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        #'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ========================
# 🔐 CORS & CSRF
# ========================
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = False 
SESSION_COOKIE_HTTPONLY = True

# ==============================
# 📧 EMAIL SMTP CONFIGURATION
# ==============================
# Ensure EMAIL_USER and EMAIL_PASS are in your .env
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_USER")  
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASS") 

# Fallback to console if credentials are missing
if not EMAIL_HOST_USER or not EMAIL_HOST_PASSWORD:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

DEFAULT_FROM_EMAIL = f'CareerCoach AI <{os.getenv("EMAIL_USER")}>'

# ==============================
# 🚀 AUTH & VERIFICATION SETTINGS
# ==============================
PASSWORD_RESET_TIMEOUT = 86400 

FRONTEND_URL = "http://localhost:5173" 
LOGIN_REDIRECT_URL = '/dashboard'
LOGOUT_REDIRECT_URL = '/'

# ==============================
# 🔐 GOOGLE OAUTH SETTINGS
# ==============================
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# ========================
# 🚀 AUTHENTICATION BACKENDS
# ========================
AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesStandaloneBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# ========================
# 🚀 ALLOW AUTH HEADERS
# ========================
CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",  
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# ========================
# 🛡️ AXES CONFIGURATION
# ========================
AXES_LOCK_OUT_BY_COMBINATION_USER_AND_IP_AND_USER_AGENT = True 

# Fixes (axes.W006): Ensure IP address is tracked
AXES_LOCKOUT_PARAMETERS = ["username", "ip_address"]

AXES_FAILURE_LIMIT = 5
AXES_COOLOFF_TIME = 1
AXES_RESET_ON_SUCCESS = True
AXES_LOCKOUT_TEMPLATE = 'lockout.html'