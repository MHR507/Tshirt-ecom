from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User

def role_required(*roles):
    """Decorator to require specific roles for an endpoint."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
            
            if user.role not in roles:
                return jsonify({'message': 'Access denied. Insufficient permissions.'}), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def admin_required(fn):
    """Decorator to require admin role."""
    return role_required('admin')(fn)

def designer_required(fn):
    """Decorator to require designer role."""
    return role_required('designer', 'admin')(fn)

def customer_required(fn):
    """Decorator to require customer role."""
    return role_required('customer', 'designer', 'admin')(fn)
