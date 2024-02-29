from app import app
from flask import request
from db import DB
from . import respond, token_required

connection, cursor = DB.getDB()


@app.route("/flights")
@token_required
def getFlights(id):
    if request.args.get("page") is not None:
        page = int(request.args.get("page", 1))
        page = page - 1
        limit = 4
        cursor.execute(f"SELECT * FROM flights LIMIT {int(page)*limit},{limit}")
    else:
        cursor.execute("SELECT * FROM flights")
    flights = cursor.fetchall()
    for flight in flights:
        flight["time"] = str(flight["time"])
        flight["date"] = str(flight["date"])
    return respond("Flights fetched successfully", flights, 200)


@app.route("/flights/search/date/<date>/time/<time>")
@app.route("/flights/search/date/<date>")
@app.route("/flights/search/time/<date>")
@token_required
def searchFlights(id, date=None, time=None):
    print("date", date, "time", time)
    if date is not None and time is not None:
        cursor.execute(f"SELECT * FROM flights WHERE date = '{date}' AND time = '{time}'")
    elif date is not None:
        cursor.execute(f"SELECT * FROM flights WHERE date = '{date}'")
    elif time is not None:
        cursor.execute(f"SELECT * FROM flights WHERE time = '{time}'")
    flights = cursor.fetchall()
    for flight in flights:
        flight["time"] = str(flight["time"])
        flight["date"] = str(flight["date"])
    return respond("Flights fetched successfully", flights, 200)

