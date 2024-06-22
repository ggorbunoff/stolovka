from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:123@localhost/stolovka'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app) 

# База данных
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    points = db.Column(db.Integer, default=100)
    role_  = db.Column(db.String(50), default='user', name='role_')

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, default=0)
    img = db.Column(db.String(255))

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    items = db.Column(db.JSON, nullable=False)
    total_price = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='received')


# Роутинг
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token, 'role': user.role_})
    return jsonify({'message': 'Invalid credentials!'}), 401


@app.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    output = [{'id': item.id, 'name': item.name, 'description': item.description, 'price': item.price, 'quantity': item.quantity, 'img': item.img} for item in items]
    return jsonify(output)



@app.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    total_price = data['total_price']
    items_ordered = data['items']

    if user.points >= total_price:
        for item_order in items_ordered:
            item = Item.query.get(item_order['id'])
            if item.quantity < item_order['quantity']:
                return jsonify({'message': f'Not enough stock for item {item.name}!'}), 400
            item.quantity -= item_order['quantity']
        
        new_order = Order(user_id=user_id, items=items_ordered, total_price=total_price)
        user.points -= total_price
        db.session.add(new_order)
        db.session.commit()
        return jsonify({'message': 'Order placed successfully!'})
    return jsonify({'message': 'Not enough points!'}), 400

# def place_order():
#     data = request.get_json()
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)
#     total_price = data['total_price']
#     if user.points >= total_price:
#         new_order = Order(user_id=user_id, items=data['items'], total_price=total_price)
#         user.points -= total_price
#         db.session.add(new_order)
#         db.session.commit()
#         return jsonify({'message': 'Order placed successfully!'})
#     return jsonify({'message': 'Not enough points!'}), 400




@app.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).all()
    output = [{'id': order.id, 'items': order.items, 'total_price': order.total_price, 'status': order.status} for order in orders]
    return jsonify(output)

@app.route('/admin/orders', methods=['GET'])
@jwt_required()
def get_all_orders():
    orders = Order.query.all()
    output = [{'id': order.id, 'user_id': order.user_id, 'items': order.items, 'total_price': order.total_price, 'status': order.status} for order in orders]
    return jsonify(output)

@app.route('/admin/order/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    data = request.get_json()
    order = Order.query.get(order_id)
    if order:
        order.status = data['status']
        db.session.commit()
        return jsonify({'message': 'Order status updated!'})
    return jsonify({'message': 'Order not found!'}), 404

@app.route('/user/points', methods=['GET'])
@jwt_required()
def get_user_points():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({'points': user.points})
    return jsonify({'message': 'User not found'}), 404

# Получаем товар
@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = Item.query.get_or_404(item_id)
    return jsonify({'id': item.id, 'name': item.name, 'description': item.description, 'price': item.price, 'quantity': item.quantity, 'img': item.img})

# Добавить новый товар
@app.route('/items', methods=['POST'])
@jwt_required()
def create_item():
    data = request.get_json()
    new_item = Item(name=data['name'], description=data['description'], price=data['price'], quantity=data['quantity'], img=data['img'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item created successfully!', 'id': new_item.id}), 201

# Обновить товар
@app.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    item = Item.query.get_or_404(item_id)
    data = request.get_json()
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.price = data.get('price', item.price)
    item.quantity = data.get('quantity', item.quantity)
    item.img = data.get('img', item.img)
    db.session.commit()
    return jsonify({'message': 'Item updated successfully!'})

# Удалить товар
@app.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted successfully!'})

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)


