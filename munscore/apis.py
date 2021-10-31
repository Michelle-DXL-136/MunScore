# from flask import current_app as app
from flask import Blueprint, request
from flask_socketio import emit

from munscore import db, socketio, scheduler, cache
from munscore.models import Entity, Score, History
from munscore.utils import get_venue, get_party, get_all_scores, api_response
from munscore.site_config import SCORE_NAME, DEFAULT_SCORE, SCORE_DILATION


api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/contestant/<contestant_id>', methods=['GET', 'POST'])
def get_contestant(contestant_id):
    contestant = Entity.query.get(contestant_id)
    if contestant is None:
        return api_response(code=404, message='Contestant not found')

    return api_response(contestant.serialize())


@api.route('/contestant/add', methods=['POST'])
def add_contestant():
    req_data = request.json or request.form
    name = req_data.get('name')
    venue_name = req_data.get('venue')
    party_name = req_data.get('party')
    venue = get_venue(venue_name) if venue_name is not None else None
    party = get_party(party_name) if party_name is not None else None

    if venue is None:
        return api_response(code=404, message='Venue not found')
    if party is None:
        return api_response(code=404, message='Party not found')
    if not name:
        return api_response(code=422, message='Name of contestant cannot be empty')

    # Insert contestant and score entry
    contestant = Entity(name=name, is_contestant=True, venue=venue, party=party)
    score = Score(name=SCORE_NAME['contestant'], value=DEFAULT_SCORE['contestant'], entity=contestant)
    db.session.add(contestant)
    db.session.add(score)
    History.record(score, is_automatic=True)
    db.session.commit()
    broadcast_all_data()

    return api_response(contestant.serialize())


@api.route('/contestant/remove', methods=['POST'])
def remove_contestant():
    req_data = request.json or request.form
    contestant_id = req_data.get('id')
    contestant = Entity.query.get(contestant_id)
    if contestant is None:
        return api_response(code=404, message='Contestant not found')

    db.session.delete(contestant)
    db.session.commit()
    broadcast_all_data()

    return api_response()


@api.route('/scores', methods=['GET', 'POST'])
def get_scores():
    return api_response(get_all_scores())


@api.route('/score/<int:score_id>', methods=['GET', 'POST'])
def get_score(score_id):
    score = Score.query.get(score_id)
    if score is None:
        return api_response(code=404, message='Score not found')

    return api_response(score.serialize())


@api.route('/score/update', methods=['POST'])
def update_score():
    req_data = request.json or request.form
    score_id = req_data.get('score_id')
    change = req_data.get('change')
    score = Score.query.get(score_id)
    if score is None:
        return api_response(code=404, message='Score not found')
    try:
        change = int(change)
    except ValueError:
        return api_response(code=422, message='Invalid value for score change')

    score.value += change
    History.record(score)
    broadcast_all_data()

    return api_response(score.serialize())


@api.route('/score/set', methods=['POST'])
def set_score():
    req_data = request.json or request.form
    score_id = req_data.get('score_id')
    value = req_data.get('value')
    score = Score.query.get(score_id)
    if score is None:
        return api_response(code=404, message='Score not found')
    try:
        value = int(value)
    except ValueError:
        return api_response(code=422, message='Invalid score value')

    score.value = value
    History.record(score)
    broadcast_all_data()

    return api_response(score.serialize())


@api.route('/scores/history', methods=['GET', 'POST'])
def get_histories():
    scores = Score.query.join(Score.entity, aliased=True).all()
    data = [score.serialize_history() for score in scores]

    return api_response(data)


@api.route('/score/<int:score_id>/history', methods=['GET', 'POST'])
def get_history(score_id):
    score = Score.query.get(score_id)
    if score is None:
        return api_response(code=404, message='Score not found')

    return api_response(score.serialize_history())


@api.route('/contest/start', methods=['POST'])
def start_contest():
    prev_state = scheduler.state
    scheduler.resume()
    broadcast_contest_state(prev_state)
    return api_response(scheduler.state)


@api.route('/contest/stop', methods=['POST'])
def stop_contest():
    prev_state = scheduler.state
    scheduler.pause()
    broadcast_contest_state(prev_state)
    return api_response(scheduler.state)


# SocketIO Functions

@socketio.on('connect')
def on_connect():
    scores = get_all_scores()
    emit('scores', scores, json=True)

    state = {0: 'Stopped', 1: 'Running', 2: 'Paused'}[scheduler.state]
    data = {'code': scheduler.state, 'state': state}
    emit('contest', data, json=True)


def broadcast_all_data():
    cache.delete('all_score')
    data = get_all_scores()
    socketio.emit('scores', data, json=True)


def broadcast_contest_state(prev_state=None):
    current_state = scheduler.state
    if prev_state == current_state:
        return
    else:
        state = {0: 'Stopped', 1: 'Running', 2: 'Paused'}[current_state]
        data = {'code': current_state, 'state': state}
        socketio.emit('contest', data, json=True)


# Scheduled tasks
@scheduler.task('interval', id='interval_update_score', minutes=60, misfire_grace_time=120)
def interval_update_score():
    print('Automatically updating score')
    with scheduler.app.app_context():
        scores = Score.query.join(Entity).all()
        for score in scores:
            if score.entity.is_venue:
                score.value += SCORE_DILATION
            else:
                score.value -= SCORE_DILATION
            History.record(score, commit=False)
        db.session.commit()
        broadcast_all_data()


scheduler.start(paused=True)
