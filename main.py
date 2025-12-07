import sqlite3
import os

from flask import request, session, jsonify, send_from_directory, url_for
from werkzeug.security import generate_password_hash, check_password_hash
# from werkzeug.utils import secure_filename
from server.app import get_db_connection
from server.app import create_app

class Config:
    """
    Flask configuration
    """
    SECRET_KEY = "dev-secret-key"
    REMAKE_DB = False

app = create_app(Config)

### APP ROUTES ###

#user account management
@app.route("/api/signup", methods=["POST"])
def create_user():
    """
    Create a new user
    :return: User(?)
    """
    data = request.form
    print("Form data received:", data)
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")

    password_hash = generate_password_hash(password)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO User (username, password, 
                               email, phoneNum, address) 
            VALUES (?, ?, ?, ?, ?)
            """,
            (username, password_hash, email, phone, address)
        )
        conn.commit()
        user_id = cursor.lastrowid
        session["username"] = username
        session["user_id"] = user_id
        return {"id": user_id, "username": username,
                "email": email, "phone": phone,
                "address": address}, 201
    except sqlite3.IntegrityError:
        return {"error": "Username already exists"}, 400
    finally:
        conn.close()

@app.route("/api/login", methods=["POST"])
def login_user():
    """
    login a user
    :return:
    """
    data = request.form
    username = data.get("username")
    password = data.get("password")
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM User WHERE username = ?",
        (username,)
    )
    user = cursor.fetchone()
    conn.close()
    print(user)
    if user and check_password_hash(user["password"], password):
        # Setting session variables, effectively logging in the user
        session["user_id"] = user["userID"]
        session["username"] = user["username"]
        return {"id": user["userID"], "username": user["username"]}, 200
    return {"error": "Invalid username or password"}, 401

@app.route("/api/logout", methods=["POST"])
def logout_user():
    """
    logout a user
    :return:
    """
    session.clear()
    return {"message": "Logged out"}

#user info
@app.route("/api/account", methods=["GET"])
def account():
    """
    api/account gets data from session, then database
    should be referenced for user info/login status on frontend
    """
    user_id = session.get("user_id")
    username = session.get("username")
    email = phone = address = None

    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
       "SELECT * FROM User WHERE username = ?",
        (username,)
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        user = dict(user)
        email = user["email"]
        phone = user["phoneNum"]
        address = user["address"]

    if user_id and username:
        return jsonify(id=user_id, username=username,
                       email=email, phone=phone,
                       address=address), 200
    return jsonify(error="Not logged in"), 401

#book search
@app.route("/api/books", methods=["GET"])
def books():
    """
    Get all books
    :return: List of books
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    book_list = cursor.execute("SELECT * FROM Book").fetchall()
    conn.close()
    all_books = []
    for book in book_list:
        book = dict(book)
        all_books.append(
            {
                "ISBN": book["ISBN"],
                "bookTitle": book["bookTitle"],
                "authorName": book["authorName"],
                "yearPublished": book["yearPublished"],
                "imageURL": book["imageURL"],
                "dateCheckedOut": book["dateCheckedOut"]
            }
        )
    return all_books

@app.route("/api/book_search", methods=["GET", "POST"])
def book_search():
    """
    Get a searched book
    :return: List of books with title or partial title
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    search_title = request.form.get("title")
    print(search_title)
    book_list = cursor.execute("""SELECT * FROM Book WHERE bookTitle LIKE ?""", ('%'+search_title+'%',)).fetchall()
    conn.close()
    all_books = []
    for book in book_list:
        book = dict(book)
        all_books.append(
            {
                "ISBN": book["ISBN"],
                "bookTitle": book["bookTitle"],
                "authorName": book["authorName"],
                "yearPublished": book["yearPublished"],
                "imageURL": book["imageURL"],
                "dateCheckedOut": book["dateCheckedOut"]
            }
        )
    return all_books

@app.route("/books/api/books/<string:ISBN>", methods=["GET"])
def book_info(ISBN):
    """
    Get all info about a specific book
    :return: Book info for one book via ISBN
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    #print(ISBN)
    book = cursor.execute("""SELECT * FROM Book WHERE ISBN = ?""", (ISBN,)).fetchone()
    conn.close()
    book_return = []
    book = dict(book)
    book_return.append(
        {
            "ISBN": book["ISBN"],
            "bookTitle": book["bookTitle"],
            "authorName": book["authorName"],
            "yearPublished": book["yearPublished"],
            "imageURL": book["imageURL"],
            "dateCheckedOut": book["dateCheckedOut"]
        }
    )
    return book_return

#checked out books


if __name__ == "__main__" and app is not None:
    app.run('0.0.0.0', port=5001, debug=True)