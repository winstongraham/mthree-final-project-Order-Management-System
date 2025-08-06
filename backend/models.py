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
