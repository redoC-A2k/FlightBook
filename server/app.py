# Github copilot help me with below assignment
# Problem Statement #1: Flight Ticket Booking
# Create a web application for flight ticket booking. A console based application would work.
# Submissions with a very basic UI will be given extra marks.
# Type of Users
# a. User
# b. Admin
# User Use Cases
# ● Login
# ● Sign up
# ● Searching for flights based on date and time
# ● Booking tickets on a flight based on availability (assuming the default seat count is 60)
# ● My Booking -> to list out all the bookings made by that user
# ● Logout
# Admin Use Cases
# ● Login (Seperate login for Admin)
# ● Add Flights
# ● Remove flights
# ● View all the booking based on flight number and time


from flask import Flask
app = Flask(__name__)

@app.route('/')
def root():
    return "Welcome to Flight Ticket Booking System!"

from controller import user, flight, admin
