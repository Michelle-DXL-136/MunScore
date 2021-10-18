import sys
from functools import wraps

from flask import Blueprint, Response, request, send_from_directory, render_template, jsonify, redirect, url_for, make_response

from munscore import db
from munscore.models import Contest, Entity, Score, History
from munscore.utils import get_party
from munscore.site_config import CONTEST_ID, SCORE_NAME, DEFAULT_SCORE


api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/contestant/add', methods=['POST'])
def add_contestant():
    req_data = request.json or request.form
    name = req_data.get('name')
    party_name = req_data.get('party')
    party = get_party(party_name)

    # Insert contestant and score entry
    contestant = Entity(name=name, is_contestant=True, party=party, contest_id=CONTEST_ID)
    score = Score(name=SCORE_NAME['contestant'], val=DEFAULT_SCORE['contestant'], entity=contestant)
    db.session.add(contestant)
    db.session.add(score)
    History.record(score, is_automatic=True)
    db.session.commit()

    return jsonify({'code': 0, 'message': 'Success', 'data': contestant.serialize()})


@api.route('/contestant/remove', methods=['POST'])
def remove_contestant():
    req_data = request.json or request.form
    contestant_id = req_data.get('id')
    contestant = Entity.query.get(contestant_id)
    db.session.delete(contestant)
    db.session.commit()

    return jsonify({'code': 0, 'message': 'Success'})


@api.route('/scores', methods=['GET', 'POST'])
def get_all_scores():
    Score.query.all()
    response = {
        'congress': {'name': congress_score_name, 'val': congress_score},
        'party': {},
        'contestant': {}
    }
    return jsonify(response)


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
