from app import app
from flask import request
from db import DB
import jwt
import os
import bcrypt
from . import respond, user_token_required

connection, cursor = DB.getDB()

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


@app.route("/users/flights/book", methods=["POST"])
@user_token_required
def bookFlight(user):
    try:
        data = request.get_json()
        flightNumber = data.get("flight_number")
        cursor.execute(f"SELECT * FROM flights WHERE flight_number = '{flightNumber}'")
        flight = cursor.fetchone()
        if flight is None:
            return respond("Invalid flight number", None, 404)
        if flight["seat_count"] == 0:
            return respond("No seats available", None, 400)
        cursor.execute(
            f"INSERT INTO bookings (user_id, flight_number) VALUES ('{user['id']}', '{flightNumber}')"
        )
        cursor.execute(
            f"UPDATE flights SET seat_count = seat_count - 1 WHERE flight_number = '{flightNumber}'",
        )
        connection.commit()
        return respond("Flight booked successfully", None, 200)
    except Exception as err:
        print("Error occured : Flight booking", err)
        return respond("Error occured : Flight booking", None, 500)


@app.route("/users/bookings")
@user_token_required
def getUserBookings(user):
    try:
        cursor.execute(f"SELECT * FROM bookings WHERE user_id = '{user['id']}'")
        bookings = cursor.fetchall()
        return respond("Bookings fetched successfully", bookings, 200)
    except Exception as err:
        print("Error occured : Fetching bookings", err)
        return respond("Error occured : Fetching bookings", None, 500)