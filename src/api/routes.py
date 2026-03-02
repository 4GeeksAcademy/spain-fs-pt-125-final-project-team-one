"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
import requests
from api.models import db, User, Portfolio, Operations
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import select
import os
from flask_bcrypt import Bcrypt
from datetime import timedelta

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

    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(seconds=3600))

    return jsonify({"token": access_token, "user_id": user.id, "msg": "Login exitoso"}), 200


@api.route("/user/profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    try:
        current_user_id = get_jwt_identity()

        user = db.session.execute(
            select(User).where(User.id == int(current_user_id))
        ).scalar_one_or_none()

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        return jsonify(user.serialize()), 200

    except Exception as e:
        return jsonify({"msg": "Error al obtener perfil", "error": str(e)}), 500


@api.route("/user/profile", methods=["PUT"])
@jwt_required()
def update_user_profile():
    try:

        current_user_id = get_jwt_identity()

        body = request.get_json(silent=True)
        if not body:
            return jsonify({"msg": "Cuerpo faltante"}), 400

        name = body.get("name")
        last_name = body.get("last_name")
        email = body.get("email")
        image_url = body.get("image")

        if not name or not last_name or not email:
            return jsonify({"msg": "Todos los campos son obligatorios"}), 400

        user = db.session.execute(
            select(User).where(User.id == int(current_user_id))
        ).scalar_one_or_none()

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        if email != user.email:
            existing_user = db.session.execute(
                select(User).where(User.email == email)
            ).scalar_one_or_none()

            if existing_user:
                return jsonify({"msg": "El email ya está en uso"}), 409

        user.name = name
        user.last_name = last_name
        user.email = email
        user.image_url = image_url

        db.session.commit()

        return jsonify(user.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar perfil", "error": str(e)}), 500


@api.route("/user/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    try:
        current_user_id = get_jwt_identity()

        body = request.get_json(silent=True)
        if not body:
            return jsonify({"msg": "Cuerpo faltante"}), 400

        current_password = body.get("current_password")
        new_password = body.get("new_password")

        if not current_password or not new_password:
            return jsonify({"msg": "Contraseña actual y nueva son obligatorias"}), 400

        if len(new_password) < 8:
            return jsonify({"msg": "La nueva contraseña debe tener al menos 8 caracteres"}), 400

        user = db.session.execute(
            select(User).where(User.id == int(current_user_id))
        ).scalar_one_or_none()

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        if not bcrypt.check_password_hash(user.password, current_password):
            return jsonify({"msg": "Contraseña actual incorrecta"}), 401

        if bcrypt.check_password_hash(user.password, new_password):
            return jsonify({"msg": "La nueva contraseña debe ser diferente a la actual"}), 400

        hashed_password = bcrypt.generate_password_hash(
            new_password).decode('utf-8')

        user.password = hashed_password
        db.session.commit()

        return jsonify({"msg": "Contraseña cambiada con éxito"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al cambiar contraseña", "error": str(e)}), 500


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

    # Buscar si el usuario ya tiene este producto en su portfolio
    existing_portfolio = db.session.execute(
        select(Portfolio).where(
            (Portfolio.user_id == int(user_id)) & (
                Portfolio.product == product_id)
        )
    ).scalar_one_or_none()

    if existing_portfolio:
        # Si ya existe el portfolio, crear una nueva operación
        new_operation = Operations(
            portfolio_id=existing_portfolio.id,
            product=product_id,
            amount=amount,
            total_price_spent=total_price_spent,
            bought=False
        )
        existing_portfolio.amount = existing_portfolio.amount + \
            amount  # Actualizar cantidad total en el portfolio
        db.session.add(new_operation)
        db.session.commit()

        return jsonify({
            "msg": "Nueva operación creada para producto existente",
            "portfolio_id": existing_portfolio.id,
            "product": existing_portfolio.product,
            "amount": existing_portfolio.amount,
            "operations": {
                "id": new_operation.id,
                "amount": new_operation.amount,
                "bought": new_operation.bought,
                "total_price_spent": new_operation.total_price_spent
            }
        }), 201

    # Si no existe, crear nuevo portfolio y operación
    new_portfolio = Portfolio(
        user_id=user_id, product=product_id, amount=amount)
    db.session.add(new_portfolio)
    db.session.flush()  # Para obtener el ID del portfolio

    # Crear operación con la cantidad
    new_operation = Operations(
        portfolio_id=new_portfolio.id,
        product=product_id,
        amount=amount,
        total_price_spent=total_price_spent,
        bought=False
    )
    db.session.add(new_operation)
    db.session.commit()

    return jsonify({
        "msg": "Producto agregado al portfolio",
        "portfolio_id": new_portfolio.id,
        "amount": amount,
        "product": new_portfolio.product,
        "amount": new_portfolio.amount,
        "operations": {
            "id": new_operation.id,
            "amount": new_operation.amount,
            "bought": new_operation.bought,
            "total_price_spent": new_operation.total_price_spent
        }
    }), 201


@api.route("/user/portfolio-data", methods=["GET"])
@jwt_required()
def get_user_portfolio_data():
    try:
        current_user_id = get_jwt_identity()
        
        # Obtener todos los portfolios del usuario
        portfolios = db.session.execute(
            select(Portfolio).where(Portfolio.user_id == int(current_user_id))
        ).scalars().all()
        
        if not portfolios:
            return jsonify({
                "totalValue": 0,
                "totalInvested": 0,
                "profitLoss": 0,
                "profitLossPercentage": 0,
                "cryptos": []
            }), 200
        
        # Obtener IDs únicos de criptos del portfolio
        crypto_ids = list(set([p.product for p in portfolios]))
        
        # Llamar a CoinGecko para obtener precios actuales
        coingecko_url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={','.join(crypto_ids)}"
        headers = {'x-cg-demo-api-key': 'CG-zEzVoDknRQgmq3QKL5wFqXh3'}
        
        try:
            coingecko_response = requests.get(coingecko_url, headers=headers, timeout=10)
            coingecko_data = coingecko_response.json() if coingecko_response.ok else []
        except:
            coingecko_data = []
        
        # Crear diccionario de precios actuales
        current_prices = {}
        crypto_info = {}
        for coin in coingecko_data:
            current_prices[coin['id']] = coin['current_price']
            crypto_info[coin['id']] = {
                'name': coin['name'],
                'symbol': coin['symbol'].upper(),
                'image': coin['image']
            }
        
        # Construir respuesta con todas las criptos
        cryptos = []
        total_value = 0
        total_invested = 0
        
        for portfolio_item in portfolios:
            # Obtener todas las operaciones de este portfolio item
            operations = db.session.execute(
                select(Operations).where(Operations.portfolio_id == portfolio_item.id)
            ).scalars().all()
            
            if not operations:
                continue
            
            # Calcular cantidad total y gasto total
            total_amount = 0
            total_spent = 0
            
            for op in operations:
                if op.bought:  # Si es compra
                    total_amount += op.amount
                    total_spent += op.total_price_spent
                else:  # Si es venta
                    total_amount -= op.amount
            
            if total_amount <= 0:
                continue
            
            avg_buy_price = total_spent / total_amount if total_amount > 0 else 0
            
            # Obtener precio actual de CoinGecko
            current_price = current_prices.get(portfolio_item.product, avg_buy_price)
            
            crypto_value = total_amount * current_price
            profit_loss = crypto_value - total_spent
            profit_loss_percentage = (profit_loss / total_spent * 100) if total_spent > 0 else 0
            
            total_value += crypto_value
            total_invested += total_spent
            
            # Obtener info de la cripto
            info = crypto_info.get(portfolio_item.product, {
                'name': portfolio_item.product.capitalize(),
                'symbol': portfolio_item.product.upper(),
                'image': ''
            })
            
            cryptos.append({
                "id": portfolio_item.id,
                "product_id": portfolio_item.product,
                "symbol": info['symbol'],
                "name": info['name'],
                "image": info.get('image', ''),
                "amount": total_amount,
                "avgBuyPrice": round(avg_buy_price, 2),
                "currentPrice": round(current_price, 2),
                "totalValue": round(crypto_value, 2),
                "profitLoss": round(profit_loss, 2),
                "profitLossPercentage": round(profit_loss_percentage, 2)
            })
        
        overall_profit_loss = total_value - total_invested
        overall_profit_loss_percentage = (overall_profit_loss / total_invested * 100) if total_invested > 0 else 0
        
        return jsonify({
            "currentPrices": current_prices,
            "totalValue": round(total_value, 2),
            "totalInvested": round(total_invested, 2),
            "profitLoss": round(overall_profit_loss, 2),
            "profitLossPercentage": round(overall_profit_loss_percentage, 2),
            "cryptos": cryptos
        }), 200
        
    except Exception as e:
        return jsonify({"msg": "Error al obtener portfolio", "error": str(e)}), 500

@api.route("/operaciones", methods=["GET"])
@jwt_required()
def get_operations():
    try:
        current_user_id = get_jwt_identity()

        operations = db.session.execute(
            select(Operations).join(Portfolio).where(
                Portfolio.user_id == int(current_user_id))
        ).scalars().all()

        # Serializar las operaciones
        operations_data = [
            {
                "id": op.id,
                "producto": op.product,
                "cantidad": op.amount,
                "precio": op.total_price_spent / op.amount if op.amount > 0 else 0,
                "total": op.total_price_spent,
                "fecha": op.date.isoformat(),
                "tipo": "venta" if op.bought else "compra",
            }
            for op in operations
        ]

        return jsonify(operations_data), 200

    except Exception as e:
        return jsonify({"msg": "Error al obtener operaciones", "error": str(e)}), 500
