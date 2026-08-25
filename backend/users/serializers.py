from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from .models import User, Resume, SecurityLog, UserFeedback 
from jobs.models import Job

# ==============================
# ✅TOKEN SERIALIZER FOR LOGIN
# ==============================
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        
        # 🛡️ FIX: Pull the request object from the serializer context
        # This is REQUIRED by Django Axes to track the attacker's IP
        request = self.context.get('request')

        # 🚀 Let Django Axes handle the lockout logic automatically
        user_auth = authenticate(
            request=request, 
            username=email, 
            password=password
        )

        if not user_auth:
            # Note: Axes will catch this failure and increment the count in the DB
            raise serializers.ValidationError({"detail": "Invalid email or password."})

        if not user_auth.is_active:
            raise serializers.ValidationError({"detail": "Account is inactive."})

        # Standard JWT validation
        data = super().validate(attrs)
        
        # Identity tokens for Frontend Role-Based Access Control (RBAC)
        data['role'] = user_auth.role
        data['username'] = user_auth.username
        data['email'] = user_auth.email
        data['first_name'] = user_auth.first_name
        
        return data

# ==============================
# ✅ USER PROFILE SERIALIZER (Neural Hub)
# ==============================
class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'bio', 'phone', 'password', 'job_title', 'location', 
            'skills', 'linkedin_url', 'github_url', 'website_url',
            'profile_image', 'role'
        ]
        # 🔑 NEURAL EXIT PROTECTION: Prevent 400 errors by making system fields read-only
        read_only_fields = ['id', 'email', 'username', 'role']

        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'bio': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True},
            'job_title': {'required': False, 'allow_blank': True},
            'location': {'required': False, 'allow_blank': True},
            'skills': {'required': False, 'allow_blank': True},
            'linkedin_url': {'required': False, 'allow_blank': True},
            'github_url': {'required': False, 'allow_blank': True},
            'website_url': {'required': False, 'allow_blank': True},
        }

    def update(self, instance, validated_data):
        # 🚀 NEURAL IMAGE GUARD: 
        # If React sends a string URL instead of a new File, pop it to avoid 400 Bad Request
        image_data = validated_data.get('profile_image')
        if image_data and not hasattr(image_data, 'file'):
            validated_data.pop('profile_image')

        # Handle Password hashing if updated
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
            
        return super().update(instance, validated_data)

# ==============================
# ✅ RESUME SERIALIZER 
# ==============================
class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id', 'title', 'theme_color', 'template_id',
            'first_name', 'last_name', 'address',
            'email', 'phone', 'summary', 'experience', 
            'education', 'skills', 'file', 
            'created_at', 'extracted_text'
        ]
        read_only_fields = ['created_at', 'extracted_text', 'id']

    # JSON Field Validation (Ensure they stay as lists)
    def validate_experience(self, value):
        return value if isinstance(value, list) else []

    def validate_education(self, value): 
        return value if isinstance(value, list) else []

    def validate_resume_skills(self, value):
        return value if isinstance(value, list) else []

# ==============================
# ✅ JOB SERIALIZER
# ==============================
class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'