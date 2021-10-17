import sys
from functools import wraps

from flask import Blueprint, Response, request, send_from_directory, render_template, jsonify, redirect, url_for, make_response

from munscore import db
from munscore.models import Contest, Entity, Score, History
from munscore.site_config import CONTEST_ID


api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/contestant/add', methods=['POST'])
def add_contestant():
    form_data = request.json
    name = form_data.get('name')
    party_name = form_data.get('party')
    party_id = Entity.get_party_id(party_name)
    contestant = Entity(name=name, is_contestant=True, party_id=party_id, contest_id=CONTEST_ID)
    db.session.add(contestant)
    db.session.commit()


@api.route('/contestant/remove', methods=['POST'])
def remove_contestant():
    contestant_id = request.json.get('contestant_id')
    contestant = Entity.query.get(contestant_id)
    db.session.delete(contestant)
    db.session.commit()


@api.route('/scores', methods=['GET', 'POST'])
def get_all_scores():
    pass


@api.route('/score/<score_id>', methods=['GET', 'POST'])
def get_score(score_id):
    pass


@api.route('/score/update', methods=['POST'])
def update_score():
    form_data = request.json
    score_id = form_data.get('score_id')
    change = form_data.get('change')


@api.route('/score/set', methods=['POST'])
def set_score():
    form_data = request.json
    score_id = form_data.get('score_id')
    change = form_data.get('change')
