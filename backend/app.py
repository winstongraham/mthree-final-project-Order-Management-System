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
from models import Order, User

@app.route('/')
def home():
    return jsonify({"message": "Order Management API is running"})

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()

    required_fields = ["instrument", "quantity", "price", "status", "side"]
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
    return jsonify([
        {
            'id': order.id,
            'instrument': order.instrument,
            'side': order.side,
            'quantity': order.quantity,
            'price': order.price,
            'status': order.status,
            'user': {
                'id': order.user.id,
                'username': order.user.username
            } if order.user else None
        } for order in orders
    ])


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

    # Update price and quantity

    if 'price' in data:
        order.price = float(data['price'])

    if 'quantity' in data:
        order.quantity = int(data['quantity'])

    if 'status' in data:
        order.status = data['status']

    # # Update fields if provided in the request JSON
    # if 'instrument' in data:
    #     order.instrument = data['instrument']
    # if 'side' in data:
    #     order.side = data['side']
    # if 'status' in data:
    #     order.status = data['status']

    db.session.commit()

    return jsonify({
        'id': order.id,
        'instrument': order.instrument,
        'quantity': order.quantity,
        "price": order.price,
        "side": order.side,
        "status": order.status,
        "timestamp": order.timestamp.isoformat()
    }), 200

## Users Routes start below ##

# Create a new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    new_user = User(
        username=data['username'],
        full_name=data['full_name'],
        email=data['email'],
        role=data['role']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            'id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'email': user.email,
            'role': user.role
        } for user in users
    ])

# Get one user by id
@app.route('/users/<int:users_id>', methods=['GET'])
def get_user(users_id):
    user = User.query.get(users_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())


@app.route('/users/<int:users_id>', methods=['DELETE'])
def delete_user(users_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user_id} deleted"})

@app.route('/user/<int:users_id>', methods=['PUT'])
def update_user(users_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    # Update email or quantity 

    if 'email' in data:
        user.email = str(data['email'])

    if 'role' in data:
       user.role = str(data['role'])

    db.session.commit()

    return jsonify({
        'id': user.id,
        'username': user.username,
        'full_name': user.full_name,
        'email': user.email,
        'role': user.role
    }), 200









if __name__ == '__main__':
    # Create tables if they don't exist
    with app.app_context():
        db.drop_all()
        db.create_all()

    app.run(debug=True)
