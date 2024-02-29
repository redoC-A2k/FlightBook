from flask import Flask
app = Flask(__name__)

@app.route('/')
def root():
    return "Welcome to Flight Ticket Booking System!"

from controller import user, admin, flights
