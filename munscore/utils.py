from munscore import cache
from munscore.models import Entity


@cache.memoize(300)
def get_party(party_name):
    party = Entity.query.filter_by(name=party_name, is_party=True).first()
    return party
