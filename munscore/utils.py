from flask import jsonify

from munscore import cache
from munscore.models import Entity
from munscore.site_config import CONTEST_ID


@cache.memoize(300)
def get_party(party_name):
    party = Entity.query.filter_by(name=party_name, is_party=True, contest_id=CONTEST_ID).first()
    return party


@cache.cached(10)
def get_all_scores():
    contestants = Entity.query.filter_by(is_contestant=True, contest_id=CONTEST_ID)
    contestants = contestants.order_by(Entity.id).all()
    global_ = Entity.query.filter_by(is_global=True, contest_id=CONTEST_ID).first()
    data = {
        'contestants': [contestant.serialize() for contestant in contestants],
        'global': global_.serialize()
    }
    return data


def api_response(data=None, code=0, message='Success'):
    resp = {'code': code, 'message': message}
    if data is not None:
        resp['data'] = data
    return jsonify(resp)
