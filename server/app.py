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

def get_db_connection():
    """
        Gets connection to database
        :return: connection
        """
    conn = sqlite3.connect("library.db")
    conn.row_factory = sqlite3.Row
    return conn