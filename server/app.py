import sqlite3
import os
import pandas as pd
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

def init_db():
    """
    Initialize all tables in database based on raw data
    """
    conn = get_db_connection()


    conn.execute("DROP TABLE IF EXISTS Author")
    conn.execute("DROP TABLE IF EXISTS Book")
    conn.execute("DROP TABLE IF EXISTS User")
    conn.execute("DROP TABLE IF EXISTS AuthorBooks")
    conn.execute("DROP TABLE IF EXISTS UserBooks")

    # Create Author table
    conn.execute(
        """CREATE TABLE "Author" (
	    "authorName"	TEXT NOT NULL UNIQUE,
	    "authorCountry"	TEXT,
	    PRIMARY KEY("authorName")
        )"""
    )

    # Create Book table
    conn.execute(
        """CREATE TABLE "Book" (
            "ISBN"	TEXT NOT NULL UNIQUE,
            "bookTitle"	TEXT NOT NULL,
            "authorName"	TEXT NOT NULL,
            "yearPublished"	INTEGER NOT NULL,
            "imageURL"	TEXT,
            "dateCheckedOut"	TEXT,
            PRIMARY KEY("ISBN")
        )"""
    )

    # Create User table
    conn.execute(
        """CREATE TABLE "User" (
            "userID"	INTEGER NOT NULL UNIQUE,
            "username"	TEXT NOT NULL UNIQUE,
            "password"	TEXT NOT NULL,
            "email"	TEXT NOT NULL,
            "phoneNum"	TEXT NOT NULL,
            "address"	TEXT NOT NULL,
            PRIMARY KEY("userID" AUTOINCREMENT)
        )"""
    )

    # Create AuthorBooks table
    conn.execute(
        """CREATE TABLE "AuthorBooks" (
            "authorName"	TEXT NOT NULL,
            "ISBN"	TEXT NOT NULL,
            PRIMARY KEY("authorName","ISBN"),
            FOREIGN KEY("ISBN") REFERENCES "Book"("ISBN"),
            FOREIGN KEY("authorName") REFERENCES "Author"("authorName")
        )"""
    )

    # Create UserBooks table
    conn.execute(
        """CREATE TABLE "UserBooks" (
            "userID"	INTEGER NOT NULL,
            "ISBN"	TEXT NOT NULL,
            PRIMARY KEY("userID","ISBN"),
            FOREIGN KEY("ISBN") REFERENCES "Book"("ISBN"),
            FOREIGN KEY("userID") REFERENCES "User"("userID")
        )"""
    )

    # Read CSVs into dataframes
    author_df = pd.read_csv("data/author.csv")
    book_df = pd.read_csv("data/book.csv")
    user_df = pd.read_csv("data/user.csv")
    author_books_df = pd.read_csv("data/authorBooks.csv")
    user_books_df = pd.read_csv("data/userBooks.csv")

    # Add to tables
    author_df.to_sql("Author", conn, if_exists="append", index=False)
    book_df.to_sql("Book", conn, if_exists="append", index=False)
    user_df.to_sql("User", conn, if_exists="append", index=False)
    author_books_df.to_sql("AuthorBooks", conn, if_exists="append", index=False)
    user_books_df.to_sql("UserBooks", conn, if_exists="append", index=False)

    conn.commit()
    conn.close()