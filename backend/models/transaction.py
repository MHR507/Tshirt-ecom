from datetime import datetime
from . import db

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # earning, withdrawal, pending
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='completed')  # completed, pending, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': f'TXN-{self.id:03d}',
            'type': self.type,
            'amount': self.amount,
            'description': self.description,
            'status': self.status,
            'date': self.created_at.strftime('%Y-%m-%d') if self.created_at else None
        }
