from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Design, Transaction
from utils.decorators import designer_required

designer_bp = Blueprint('designer', __name__, url_prefix='/api/designer')

@designer_bp.route('/stats', methods=['GET'])
@jwt_required()
@designer_required
def get_designer_stats():
    """Get dashboard statistics for designer."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    designs = Design.query.filter_by(designer_id=user_id).all()
    approved_designs = [d for d in designs if d.status == 'approved']
    pending_designs = [d for d in designs if d.status == 'pending']
    
    total_sales = sum(d.sales for d in designs)
    total_revenue = sum(d.revenue for d in designs)
    total_earnings = total_revenue * 0.05  # 5% commission
    
    return jsonify({
        'stats': {
            'totalDesigns': len(designs),
            'approvedDesigns': len(approved_designs),
            'pendingDesigns': len(pending_designs),
            'totalSales': total_sales,
            'totalRevenue': round(total_revenue, 2),
            'totalEarnings': round(total_earnings, 2),
            'walletBalance': user.wallet_balance
        }
    })

@designer_bp.route('/transactions', methods=['GET'])
@jwt_required()
@designer_required
def get_transactions():
    """Get transaction history for designer."""
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.created_at.desc()).all()
    
    return jsonify({'transactions': [t.to_dict() for t in transactions]})

@designer_bp.route('/withdraw', methods=['POST'])
@jwt_required()
@designer_required
def request_withdrawal():
    """Request withdrawal from wallet."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    amount = data.get('amount', 0)
    
    if amount <= 0:
        return jsonify({'message': 'Invalid withdrawal amount'}), 400
    
    if amount > user.wallet_balance:
        return jsonify({'message': 'Insufficient wallet balance'}), 400
    
    # Create withdrawal transaction
    transaction = Transaction(
        user_id=user_id,
        type='withdrawal',
        amount=-amount,
        description='Withdrawal to bank account',
        status='pending'
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Withdrawal request submitted',
        'transaction': transaction.to_dict()
    })

@designer_bp.route('/designs', methods=['GET'])
@jwt_required()
@designer_required
def get_my_designs():
    """Get designs for current designer."""
    user_id = get_jwt_identity()
    designs = Design.query.filter_by(designer_id=user_id).order_by(Design.upload_date.desc()).all()
    
    return jsonify({'designs': [d.to_dict() for d in designs]})
