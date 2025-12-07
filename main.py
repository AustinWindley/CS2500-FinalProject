import sqlite3
import os

from flask import request, session, jsonify, send_from_directory, url_for
# from werkzeug.security import generate_password_hash, check_password_hash
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

#user info

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
#checked out books



if __name__ == "__main__" and app is not None:
    app.run('0.0.0.0', port=5001, debug=True)