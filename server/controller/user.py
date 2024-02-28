from app import app
from flask import make_response, request
from db import DB
import jwt
import os
from functools import wraps
import bcrypt

connection, cursor = DB.getDB()


def respond(message, payload, status_code):
    if payload is None:
        return make_response({"message": message}, status_code)
    else:
        return make_response({"message": message, "payload": payload}, status_code)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return respond("Token is missing", None, 401)
        try:
            data = jwt.decode(token, os.environ.get("JWT_SECRET"))
            userId = data["id"]

        except Exception as e:
            return respond("Token is invalid", None, 403)

        return f(userId, *args, **kwargs)

    return decorated


@app.route("/users/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if username is None or password is None:
        return respond("Username or password is missing", None, 400)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    if user is not None:
        return respond("User already exists", None, 400)
    hashPassword = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (%s, %s)",
        (username, hashPassword),
    )
    connection.commit()
    return respond("User signed up successfully", None, 200)


@app.route("/users/signin", methods=["POST"])
def signin():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    if user is None:
        return respond("Invalid username or password", None, 404)
    if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        token = jwt.encode({"id": user["id"]}, os.environ.get("JWT_SECRET"))
        return respond("User signed in successfully", token, 200)
    else:
        return respond("Invalid username or password", None, 404)