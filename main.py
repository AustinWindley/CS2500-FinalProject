import sqlite3
import os

from flask import request, session, jsonify, send_from_directory, url_for
from werkzeug.security import generate_password_hash, check_password_hash
# from werkzeug.utils import secure_filename
from server.app import get_db_connection
from server.app import create_app
from server.app import init_db

class Config:
    """
    Flask configuration
    """
    SECRET_KEY = "dev-secret-key"
    REMAKE_DB = False

app = create_app(Config)

### APP ROUTES ###

#create database
@app.route("/Library/api/create_database", methods=["POST"])
def create_database():
    init_db()
    return jsonify(), 200

#user account management
@app.route("/Library/api/signup", methods=["POST"])
def create_user():
    """
    Create a new user
    :return: User(?)
    """
    data = request.form
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

@app.route("/Library/api/login", methods=["POST"])
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

@app.route("/Library/api/logout", methods=["POST"])
def logout_user():
    """
    logout a user
    :return:
    """
    session.clear()
    return {"message": "Logged out"}

#user info
@app.route("/Library/api/account", methods=["GET"])
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
@app.route("/Library/api/books", methods=["GET"])
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

@app.route("/Library/api/authors", methods=["GET"])
def authors():
    """
    Get all authors
    :return: List of authors
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    author_list = cursor.execute("SELECT * FROM Author").fetchall()
    conn.close()
    all_authors = []
    for author in author_list:
        author = dict(author)
        all_authors.append(
            {
                "authorName": author["authorName"]
            }
        )
    return all_authors

@app.route("/Library/api/book_search", methods=["GET", "POST"])
def book_search():
    """
    Get a searched book
    :return: List of books with title or partial title
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    search_title = request.form.get("title")

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

@app.route("/Library/api/author_search", methods=["GET", "POST"])
def author_search():
    """
    Get a list of books by author
    
    :return: a list of books
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    search_author = request.form.get("authorName")

    books_list = cursor.execute("""
        SELECT * FROM AuthorBooks NATURAL JOIN Book 
        WHERE authorName LIKE ?""", ('%'+search_author+'%',)).fetchall()
    conn.close()
    all_books = []
    for book in books_list:
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

@app.route("/Library/books/api/books/<string:ISBN>", methods=["GET"])
def book_info(ISBN):
    """
    Get all info about a specific book
    :return: Book info for one book via ISBN
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

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

@app.route("/Library/books/api/author/<string:ISBN>", methods=["GET"])
def author_name(ISBN):
    """
    Get name of book author
    :return: Author info for one author via authorName
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    author = cursor.execute("""SELECT authorName FROM Book WHERE ISBN = ?""", (ISBN,)).fetchone()
    conn.close()
    author_return = []
    author = dict(author)
    author_return.append(
        {
            "authorName": author["authorName"],
        }
    )
    return jsonify(author_return), 200

@app.route("/Library/api/author/<string:authorName>", methods=["GET"])
def author_info(authorName):
    """
    Get all info about a specific author
    :return: Author info for one author via authorName
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    authorName = authorName.replace("_", " ")
    
    author = cursor.execute("""SELECT * FROM Author WHERE authorName = ?""", (authorName,)).fetchone()
    conn.close()
    author_return = []
    author = dict(author)
    author_return.append(
        {
            "authorName": author["authorName"],
            "authorCountry": author["authorCountry"]
        }
    )
    return author_return

#check out a book
@app.route("/Library/api/checkout/<string:ISBN>", methods=["POST"])
def checkout(ISBN):
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    user_id = session.get("user_id")
    cursor.execute("""INSERT INTO UserBooks VALUES(?,?)""", (user_id, ISBN,))
    cursor.execute("""UPDATE Book SET dateCheckedOut = CURRENT_TIMESTAMP WHERE ISBN = ?""", (ISBN,))
    conn.commit()
    conn.close()
    return jsonify(), 200

#return a book
@app.route("/Library/api/return/<string:ISBN>", methods=["POST"])
def return_book(ISBN):
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    user_id = session.get("user_id")
    cursor.execute("""DELETE FROM UserBooks WHERE userID = ? AND ISBN = ?""", (user_id, ISBN,))
    cursor.execute("""UPDATE Book SET dateCheckedOut = NULL WHERE ISBN = ?""", (ISBN,))
    conn.commit()
    conn.close()
    return jsonify(), 200

@app.route("/Library/api/user_books", methods=["GET"])
def user_books():
    """
    Get all books checked out by user
    :return: List of books
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    user_id = session.get("user_id")
    book_list = cursor.execute("""
        SELECT ISBN, bookTitle, authorName, yearPublished, imageURL, dateCheckedOut
        FROM UserBooks NATURAL JOIN Book
        WHERE userID = ?""", (user_id,)).fetchall()
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

@app.route("/Library/books/api/ownership_check/<string:ISBN>", methods=["GET"])
def ownership_check(ISBN):
    """
    Check if book is currently checked out by user
    :return: True if book is users
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    user_id = session.get("user_id")
    book_check = cursor.execute("""SELECT * FROM UserBooks WHERE userID = ? AND ISBN = ?""", (user_id, ISBN)).fetchone()
    if book_check:
        return jsonify("true")
    else:
        return jsonify("false")

if __name__ == "__main__" and app is not None:
    app.run('0.0.0.0', port=5002)