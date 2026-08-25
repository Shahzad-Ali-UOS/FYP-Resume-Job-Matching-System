from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Custom permission to only allow 'admin' role users to access a view.
    """
    def has_permission(self, request, view):
        # 1. Check if user is logged in
        if not request.user or not request.user.is_authenticated:
            return False
        
        # 2. Check if their 'role' field is exactly 'admin'
        # This matches the role you are saving in localStorage
        return request.user.role == 'admin'