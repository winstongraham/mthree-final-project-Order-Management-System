from extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    instrument = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    side = db.Column(db.String, nullable=False)  # buy or sell
    status = db.Column(db.String, default='pending')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='orders')

    def to_dict(self):
        return {
            "id": self.id,
            "instrument": self.instrument,
            "quantity": self.quantity,
            "price": self.price,
            "side": self.side,
            "status": self.status,
            "timestamp": self.timestamp.isoformat()
        }

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False)

    orders = db.relationship('Order', back_populates='user', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role
        }