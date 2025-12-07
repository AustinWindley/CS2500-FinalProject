import sqlite3
import os
from flask import Flask, request, render_template
from flask_cors import CORS

def create_app(config):
    application = Flask(__name__, template_folder="../build", static_folder="../build/static")
    # Pass in Config eventually
    application.config.from_object(config)
    # looks for a real secret key in config, if it can't find one, it uses a simple backup one
    application.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")
    CORS(application)
    # pass 404's thrown from the client back to the client if the request was not for the api
    # this is because on refresh the client requests the server with a client side route
    @application.errorhandler(404)
    def not_found(e):
        # check if request is to the api or is client side url
        path_list = request.path.split("/")
        if request.method == "GET" and "api" not in path_list:
            return render_template("index.html")
        return e
    return application 

# def get_db_connection():
#     """
#         Gets connection to database
#         :return: connection
#         """
#     conn = sqlite3.connect("database.db")
#     conn.row_factory = sqlite3.Row
#     return conn

# def init_db():
#     """
#     Initialize a user table and a post table
#     """
#     conn = get_db_connection()

#     # Uncomment the line below and restart flask app to reset the users table
#     # do ONLY ONCE each time you need to modify the table structure
#     #conn.execute("DROP TABLE IF EXISTS users")
#     #conn.execute("DROP TABLE IF EXISTS posts")

#     # Create user table
#     conn.execute(
#         """CREATE TABLE IF NOT EXISTS users (
#                id INTEGER PRIMARY KEY AUTOINCREMENT,
#                username TEXT UNIQUE NOT NULL,
#                password_hash TEXT NOT NULL,
#                email TEXT,
#                phone TEXT,
#                address TEXT
#            )"""
#     )
#     # Create post table
#     conn.execute(
#         """CREATE TABLE IF NOT EXISTS posts (
#                id INTEGER PRIMARY KEY AUTOINCREMENT,
#                user_id INTEGER NOT NULL,
#                title TEXT NOT NULL,
#                content TEXT NOT NULL,
#                image_filename TEXT,
#                latitude DECIMAL(10, 7) NOT NULL,
#                longitude DECIMAL(10, 7) NOT NULL,
#                likes INTEGER DEFAULT 0,
#                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
#                FOREIGN KEY (user_id) REFERENCES users (id)
#            )"""
#     )
#     cursor = conn.cursor()
#     cursor.execute("PRAGMA table_info(posts)")
#     columns = [row["name"] for row in cursor.fetchall()]
#     if "image_filename" not in columns:
#         cursor.execute("ALTER TABLE posts ADD COLUMN image_filename TEXT")
#     conn.commit()
#     conn.close()

# init_db()