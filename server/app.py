from flask import Flask
app = Flask(__name__)
import os

@app.route('/')
def root():
    return "Welcome to Flight Ticket Booking System!"

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = os.environ.get('REACT_APP_FRONTEND')
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response;

from controller import user, admin, flights
