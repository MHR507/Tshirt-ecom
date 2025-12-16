from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Design, User
from utils.decorators import admin_required, designer_required

designs_bp = Blueprint('designs', __name__, url_prefix='/api/designs')

@designs_bp.route('', methods=['GET'])
@jwt_required()
def get_designs():
    """Get designs - admin sees all, designer sees own."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    if user.role == 'admin':
        designs = Design.query.all()
    else:
        designs = Design.query.filter_by(designer_id=user_id).all()
    
    return jsonify({'designs': [d.to_dict() for d in designs]})

@designs_bp.route('', methods=['POST'])
@jwt_required()
@designer_required
def create_design():
    """Submit a new design for approval."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    design = Design(
        name=data.get('name'),
        designer_id=user_id,
        image=data.get('image'),
        category=data.get('category', 'designer'),
        status='pending'
    )
    
    db.session.add(design)
    db.session.commit()
    
    return jsonify({
        'message': 'Design submitted for approval',
        'design': design.to_dict()
    }), 201

@designs_bp.route('/<int:design_id>/approve', methods=['PUT'])
@jwt_required()
@admin_required
def approve_design(design_id):
    """Approve a design (admin only)."""
    design = Design.query.get(design_id)
    
    if not design:
        return jsonify({'message': 'Design not found'}), 404
    
    design.status = 'approved'
    db.session.commit()
    
    return jsonify({
        'message': 'Design approved successfully',
        'design': design.to_dict()
    })

@designs_bp.route('/<int:design_id>/reject', methods=['PUT'])
@jwt_required()
@admin_required
def reject_design(design_id):
    """Reject a design (admin only)."""
    design = Design.query.get(design_id)
    data = request.get_json()
    
    if not design:
        return jsonify({'message': 'Design not found'}), 404
    
    design.status = 'rejected'
    design.rejection_reason = data.get('reason', '')
    db.session.commit()
    
    return jsonify({
        'message': 'Design rejected',
        'design': design.to_dict()
    })

@designs_bp.route('/<int:design_id>', methods=['DELETE'])
@jwt_required()
def delete_design(design_id):
    """Delete a design (owner or admin only)."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    design = Design.query.get(design_id)
    
    if not design:
        return jsonify({'message': 'Design not found'}), 404
    
    if design.designer_id != user_id and user.role != 'admin':
        return jsonify({'message': 'Access denied'}), 403
    
    db.session.delete(design)
    db.session.commit()
    
    return jsonify({'message': 'Design deleted successfully'})
