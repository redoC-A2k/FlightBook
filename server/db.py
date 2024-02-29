import mysql.connector
import os


class DB:
    connection = None
    cursor = None

    @staticmethod
    def getDB():
        try:
            if DB.connection is None or DB.cursor is None:
                print("Connecting to database")
                # Connect to MySQL database
                DB.connection = mysql.connector.connect(
                    host=os.environ.get("MYSQL_HOST"),
                    user=os.environ.get("MYSQL_USER"),
                    password=os.environ.get("MYSQL_PASSWORD"),
                    database=os.environ.get("MYSQL_DATABASE"),
                )
                DB.cursor = DB.connection.cursor(dictionary=True)
            return DB.connection, DB.cursor
        except mysql.connector.Error as err:
            print("Error connecting to DB: {}".format(err))
