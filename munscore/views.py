import sys
from functools import wraps

from flask import current_app as app
from flask import Response, request, send_from_directory, render_template, jsonify, redirect, url_for, make_response

# from munscore import app#, db, login_manager


@app.route('/')
def index_page():
    return 'Hi!'
