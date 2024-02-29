from functools import wraps
from flask import request, make_response
import jwt
import os
from db import DB

connection, cursor = DB.getDB()

def respond(message, payload, status_code):
    if payload is None:
        return make_response({"message": message}, status_code)
    else:
        return make_response({"message": message, "payload": payload}, status_code)


def user_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return respond("Token is missing", None, 401)
        try:
            data = jwt.decode(token, os.environ.get("JWT_SECRET"), algorithms=["HS256"])
            id = data["id"]
            cursor.execute(f"SELECT * FROM users WHERE id = '{id}'")
            user = cursor.fetchone()
            if user is None:
                return respond("Malformed Token", None, 401)
        except Exception as e:
            print("Error while verifying token : ", e)
            return respond("Token is invalid", None, 403)

        return f(user, *args, **kwargs)

    return decorated


def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return respond("Token is missing", None, 401)
        try:
            data = jwt.decode(token, os.environ.get("JWT_SECRET"), algorithms=["HS256"])
            id = data["id"]
            cursor.execute(f"SELECT * FROM admins WHERE id = '{id}'")
            admin = cursor.fetchone()
            if admin is None:
                return respond("Malformed Token", None, 401)
        except Exception as e:
            print("Error while verifying token : ", e)
            return respond("Token is invalid", None, 403)

        return f(admin, *args, **kwargs)

    return decorated

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return respond("Token is missing", None, 401)
        try:
            data = jwt.decode(token, os.environ.get("JWT_SECRET"), algorithms=["HS256"])
            id = data["id"]
        except Exception as e:
            print("Error while verifying token : ", e)
            return respond("Token is invalid", None, 403)

        return f(id, *args, **kwargs)

    return decorated
