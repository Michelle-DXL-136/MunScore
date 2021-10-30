from flask import current_app as app
from flask import send_from_directory, render_template, redirect, url_for


@app.route('/')
def index_page():
    return send_from_directory('static', 'index.html')


@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)


@app.route('/history')
@app.route('/history/')
def history_page():
    return send_from_directory('static', 'history.html')
