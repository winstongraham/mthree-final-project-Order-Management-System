from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from extensions import db
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simple SQLite DB setup (file named orders.db in project root)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///orders.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # initialize db with app

# Import models after initializing db
from models import Order

@app.route('/')
def home():
    return jsonify({"message": "Order Management API is running"})

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()

    required_fields = ["instrument", "quantity", "price", "side"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    order = Order(
        instrument=data['instrument'],
        quantity=int(data['quantity']),
        price=float(data['price']),
        side=data['side'],
        status='open'
    )

    db.session.add(order)
    db.session.commit()

    return jsonify(order.to_dict()), 201

@app.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])

@app.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order.to_dict())


@app.route('/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": f"Order {order_id} deleted"})

@app.route('/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.get_json()

    # Update fields if provided in the request JSON
    if 'instrument' in data:
        order.instrument = data['instrument']
    if 'quantity' in data:
        order.quantity = int(data['quantity'])
    if 'price' in data:
        order.price = float(data['price'])
    if 'side' in data:
        order.side = data['side']
    if 'status' in data:
        order.status = data['status']

    db.session.commit()

    return jsonify(order.to_dict())


if __name__ == '__main__':
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    app.run(debug=True)
