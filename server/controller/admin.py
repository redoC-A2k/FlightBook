from app import app
from flask import request
from db import DB
import jwt
import os
import bcrypt
from . import respond, admin_token_required


connection, cursor = DB.getDB()


@app.route("/admin/signin", methods=["POST"])
def adminSignin():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    cursor.execute("SELECT * FROM admins WHERE username = %s", (username,))
    admin = cursor.fetchone()
    if admin is None:
        return respond("Invalid username or password", None, 404)
    if bcrypt.checkpw(password.encode("utf-8"), admin["password"].encode("utf-8")):
        token = jwt.encode({"id": admin["id"]}, os.environ.get("JWT_SECRET"))
        return respond("admin signed in successfully", token, 200)
    else:
        return respond("Invalid username or password", None, 404)


@app.route("/admin/flight", methods=["POST"])
@admin_token_required
def addFlight(admin):
    try:
        data = request.get_json()
        date = data.get("date")
        time = data.get("time")
        cursor.execute(f"INSERT INTO flights (date, time) VALUES ('{date}', '{time}')")
        connection.commit()
        return respond("Flight added successfully", None, 200)
    except Exception as e:
        print("Error while adding flight", e)
        return respond("Error while adding flight", None, 500)


@app.route("/admin/flight/<flight_number>", methods=["DELETE"])
@admin_token_required
def deleteFlight(admin, flight_number):
    try:
        cursor.execute(f"DELETE FROM flights WHERE flight_number = {flight_number}")
        connection.commit()
        return respond("Flight deleted successfully", None, 200)
    except Exception as e:
        print("Error while deleting flight", e)
        return respond("Error while deleting flight", None, 500)


@app.route("/admin/flight/<flight_number>")
@admin_token_required
def getAFlight(admin, flight_number):
    try:
        print(f"SELECT * FROM flights WHERE flight_number = {flight_number}")
        cursor.execute(f"SELECT * FROM flights WHERE flight_number = {flight_number}")
        flight = cursor.fetchone()
        flight["date"] = str(flight["date"])
        flight['time'] = str(flight['time'])
        flightArr = [flight]
        return respond("Flight retrieved successfully", flightArr, 200)
    except Exception as e:
        print("Error while retrieving flight (flight number does not exist)", e)
        return respond("Flight number does not exist", [], 200)
