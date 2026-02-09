"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/login", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = db.session.execute(select(User).where(
        User.email == email, User.password == password)).scalar_one_or_none()
    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401
    if not user.is_active:
        return jsonify({"msg": "Usuario inactivo"}), 403
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id})
