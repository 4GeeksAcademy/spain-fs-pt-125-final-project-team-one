"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Portfolio, Operations
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import select
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)
bcrypt = Bcrypt()

# Allow CORS requests to this API
CORS(api)


@api.route("/register", methods=["POST"])
def handle_register():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"msg": "Cuerpo faltante o JSON inválido"}), 400

    email = body.get("email")
    password = body.get("password")
    name = body.get("name")
    last_name = body.get("last_name")

    if not email or not password:
        return jsonify({"msg": "Email y contraseña obligatorios"}), 400

    user_exists = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()
    if user_exists:
        return jsonify({"msg": "El email ya existe"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(email=email, password=hashed_password,
                    name=name, last_name=last_name, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado con éxito"}), 201


@api.route("/login", methods=["POST"])
def create_token():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"msg": "Cuerpo faltante"}), 400

    email = body.get("email")
    password = body.get("password")

    user = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()

    # check_password_hash compara el texto plano con el hash de la DB
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401
    if not user.is_active:
        return jsonify({"msg": "Usuario inactivo"}), 403

    access_token = create_access_token(identity=str(user.id))

    return jsonify({"token": access_token, "user_id": user.id, "msg": "Login exitoso"}), 200


@api.route("/user/favorites", methods=["POST"])
@jwt_required()
def toggle_favorite():
    user_id = get_jwt_identity()
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"msg": "Cuerpo faltante o JSON inválido"}), 400

    product_id = body.get("product_id")
    if product_id is None:
        return jsonify({"msg": "product_id es obligatorio"}), 400

    user = db.session.execute(select(User).where(
        User.id == user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Inicializar favorites_array si es None
    if user.favorites_array is None:
        user.favorites_array = []

    # Toggle: agregar o remover
    if product_id in user.favorites_array:
        user.favorites_array.remove(product_id)
        is_favorite = False
    else:
        user.favorites_array.append(product_id)
        is_favorite = True

    db.session.commit()

    return jsonify({
        "msg": "Favorito actualizado",
        "is_favorite": is_favorite,
        "favorites": user.favorites_array
    }), 200


@api.route("/user/portfolio", methods=["POST"])
@jwt_required()
def add_to_portfolio():
    user_id = get_jwt_identity()
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"msg": "Cuerpo faltante o JSON inválido"}), 400

    product_id = body.get("product_id")
    amount = body.get("amount", 0)  # Default a 0 si no se proporciona
    total_price_spent = body.get("total_price_spent")
    if product_id is None:
        return jsonify({"msg": "product_id es obligatorio"}), 400

    user = db.session.execute(select(User).where(
        User.id == user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Crear nuevo portfolio entry
    new_portfolio = Portfolio(user_id=user_id, product=product_id)
    db.session.add(new_portfolio)
    db.session.flush()  # Para obtener el ID del portfolio

    # Crear operación con la cantidad
    new_operation = Operations(
        portfolio_id=new_portfolio.id,
        product=product_id,
        amount=amount,
        total_price_spent= total_price_spent,
        bought=False
    )
    db.session.add(new_operation)
    db.session.commit()

    return jsonify({
        "msg": "Producto agregado al portfolio",
        "portfolio_id": new_portfolio.id,
        "product": new_portfolio.product,
        "operations": {
            "id": new_operation.id,
            "amount": new_operation.amount,
            "bought": new_operation.bought
        }
    }), 201
