"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
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
    
    if not email or not password:
        return jsonify({"msg": "Email y contraseña obligatorios"}), 400

    user_exists = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if user_exists:
        return jsonify({"msg": "El email ya existe"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(email=email, password=hashed_password, is_active=True)
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

    user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
    
    # check_password_hash compara el texto plano con el hash de la DB
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401
    if not user.is_active:
        return jsonify({"msg": "Usuario inactivo"}), 403
    
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({"token": access_token, "user_id": user.id, "msg": "Login exitoso"}), 200