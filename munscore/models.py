from datetime import datetime

from munscore import db


class Contest(db.Model):

    __tablename__ = 'contests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f'<Contest {self.id}>'


class Entity(db.Model):

    __tablename__ = 'entities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    is_contestant = db.Column(db.Boolean, default=False, nullable=False)
    is_party = db.Column(db.Boolean, default=False, nullable=False)
    is_global = db.Column(db.Boolean, default=False, nullable=False)
    contest_id = db.Column(db.ForeignKey('contests.id'))
    contest = db.relationship('Contest', backref=db.backref('contest', uselist=False))
    party_id = db.Column(db.ForeignKey('entities.id'), nullable=True)
    party = db.relationship('Entity', backref=db.backref('party', uselist=False))

    def __repr__(self):
        type_name = 'Contestant' if self.is_contestant else ('Party' if self.is_party else 'Global')
        return f'<{type_name} Entity {self.id}: {self.name}>'
    
    @classmethod
    def get_party_id(cls, party_name):
        party = cls.query.filter_by(name=party_name, is_party=True).first()
        if party is None:
            return -1
        else:
            return party.id


class Score(db.Model):

    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    val = db.Column(db.Integer, default=0, nullable=False)
    entity_id = db.Column(db.ForeignKey('entities.id'))
    entity = db.relationship('Entity', backref=db.backref('scores'))

    def __repr__(self):
        return f'<Score {self.id}>'


class History(db.Model):

    __tablename__ = 'histories'

    id = db.Column(db.Integer, primary_key=True)
    score_id = db.Column(db.ForeignKey('scores.id'))
    score = db.relationship('Score', backref=db.backref('histories'))
    change = db.Column(db.Integer, default=0, nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    is_automatic = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return f'<History {self.id}>'
