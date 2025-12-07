import sqlite3
import os

# from flask import request, session, jsonify, send_from_directory, url_for
# from werkzeug.security import generate_password_hash, check_password_hash
# from werkzeug.utils import secure_filename
# from server.app import get_db_connection
from server.app import create_app

class Config:
    """
    Flask configuration
    """
    SECRET_KEY = "dev-secret-key"
    REMAKE_DB = False

app = create_app(Config)

### APP ROUTES ###

#user info

#book search

#checked out books



if __name__ == "__main__" and app is not None:
    app.run('0.0.0.0', port=5001, debug=True)