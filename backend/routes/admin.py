from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Order, Design, User, Product
from utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_stats():
    """Get dashboard statistics for admin."""
    total_orders = Order.query.count()
    pending_orders = Order.query.filter_by(status='pending').count()
    total_revenue = sum(o.total for o in Order.query.all())
    
    total_designs = Design.query.count()
    pending_designs = Design.query.filter_by(status='pending').count()
    approved_designs = Design.query.filter_by(status='approved').count()
    
    total_designers = User.query.filter_by(role='designer').count()
    total_customers = User.query.filter_by(role='customer').count()
    
    total_products = Product.query.filter_by(is_active=True).count()
    
    return jsonify({
        'stats': {
            'totalOrders': total_orders,
            'pendingOrders': pending_orders,
            'totalRevenue': round(total_revenue, 2),
            'totalDesigns': total_designs,
            'pendingDesigns': pending_designs,
            'approvedDesigns': approved_designs,
            'totalDesigners': total_designers,
            'totalCustomers': total_customers,
            'totalProducts': total_products
        }
    })

@admin_bp.route('/designers', methods=['GET'])
@jwt_required()
@admin_required
def get_designers():
    """Get all designers."""
    designers = User.query.filter_by(role='designer').all()
    
    result = []
    for designer in designers:
        designs = Design.query.filter_by(designer_id=designer.id).all()
        total_sales = sum(d.sales for d in designs)
        total_earnings = sum(d.revenue for d in designs) * 0.05  # 5% commission
        
        result.append({
            'id': str(designer.id),
            'name': designer.name,
            'email': designer.email,
            'avatar': designer.avatar,
            'totalDesigns': len(designs),
            'totalSales': total_sales,
            'totalEarnings': round(total_earnings, 2),
            'walletBalance': designer.wallet_balance,
            'joinDate': designer.created_at.strftime('%Y-%m-%d') if designer.created_at else None
        })
    
    return jsonify({'designers': result})

@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
@admin_required
def get_all_orders():
    """Get all orders for admin."""
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [o.to_dict() for o in orders]})
