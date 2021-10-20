from flask import jsonify

from munscore import cache
from munscore.models import Entity


@cache.memoize(20)
def get_venue(venue_name):
    venue = Entity.query.filter_by(name=venue_name, is_venue=True).first()
    return venue


@cache.memoize(20)
def get_party(party_name):
    party = Entity.query.filter_by(name=party_name, is_party=True).first()
    return party


@cache.cached(20, 'all_score')
def get_all_scores():
    venues = Entity.query.filter_by(is_venue=True).order_by(Entity.id).all()
    parties = Entity.query.filter_by(is_party=True).order_by(Entity.id).all()
    data = {}

    data['venues'] = [venue.serialize() for venue in venues]
    data['parties'] = [party.serialize() for party in parties]
    data['contestants'] = []
    for venue in venues:
        contestants = Entity.query.filter_by(is_contestant=True, venue=venue)
        contestants = contestants.order_by(Entity.id).all()
        data['contestants'].append([contestant.serialize() for contestant in contestants])
    return data


def api_response(data=None, code=0, message='Success'):
    resp = {'code': code, 'message': message}
    if data is not None:
        resp['data'] = data
    return jsonify(resp)
