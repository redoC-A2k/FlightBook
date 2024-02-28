from app import app
from flask import request
from db import DB
import jwt
import os
import bcrypt
from .user import respond

connection, cursor = DB.getDB()

@app.route("/admin/signin", methods=["POST"])
def adminsignin():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    cursor.execute("SELECT * FROM admins WHERE username = %s", (username,))
    admin = cursor.fetchone()
    if admin is None:
        return respond("Invalid username or password", None, 404)
    print(password,admin)
    if bcrypt.checkpw(password.encode("utf-8"), admin["password"].encode("utf-8")):
        token = jwt.encode({"id": admin["id"]}, os.environ.get("JWT_SECRET"))
        return respond("admin signed in successfully", token, 200)
    else:
        return respond("Invalid username or password", None, 404)