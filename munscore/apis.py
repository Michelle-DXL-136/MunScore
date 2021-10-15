import sys
from functools import wraps

from flask import Blueprint, Response, request, send_from_directory, render_template, jsonify, redirect, url_for, make_response

# from munscore import app, db
from munscore.models import Contest, Entity, Score, Update


api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/contestant/add', methods=['POST'])
def add_contestant():
    pass

@api.route('/contestant/remove', methods=['POST'])
def remove_contestant():
    pass

@api.route('/scores', methods=['GET', 'POST'])
def get_all_scores():
    pass

@api.route('/score/<score_id>', methods=['GET', 'POST'])
def get_score(score_id):
    pass

@api.route('/score/update', methods=['POST'])
def update_score():
    pass
