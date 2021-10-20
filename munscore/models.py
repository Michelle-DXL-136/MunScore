from datetime import datetime

from munscore import db


class Entity(db.Model):

    __tablename__ = 'entities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    is_contestant = db.Column(db.Boolean, default=False, nullable=False)
    is_party = db.Column(db.Boolean, default=False, nullable=False)
    is_venue = db.Column(db.Boolean, default=False, nullable=False)

    venue_id = db.Column(db.ForeignKey('entities.id'), nullable=True)
    venue = db.relationship('Entity', uselist=False, foreign_keys=[venue_id], remote_side=[id])
    party_id = db.Column(db.ForeignKey('entities.id'), nullable=True)
    party = db.relationship('Entity', uselist=False, foreign_keys=[party_id], remote_side=[id])

    def __repr__(self):
        type_name = 'Contestant' if self.is_contestant else ('Party' if self.is_party else 'Venue')
        return f'<{type_name} Entity {self.id}: {self.name}>'
    
    def serialize(self):
        '''Serialize the entity into JSON-like structure.'''
        data = {'id': self.id, 'name': self.name, 'score': self.score.serialize()}
        if self.is_contestant:
            data.update({
                'type': 'Contestant',
                'venue': self.venue.name,
                'party': self.party.name,
            })
        elif self.is_party:
            data.update({'type': 'Party'})
        elif self.is_venue:
            data.update({'type': 'Venue'})
        return data


class Score(db.Model):

    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    value = db.Column(db.Integer, default=0, nullable=False)
    entity_id = db.Column(db.ForeignKey('entities.id'))
    entity = db.relationship('Entity', uselist=False, backref=db.backref('score', uselist=False, lazy='subquery'))

    def __repr__(self):
        return f'<Score {self.id}>'
    
    def serialize(self):
        '''Serialize the score into JSON-like format.'''
        return {'id': self.id, 'name': self.name, 'value': self.value}

    def serialize_history(self):
        '''Serialize the score's histories into JSON-like format.'''
        raw_histories = History.query.filter_by(score=self).all()
        data = {'id': self.id, 'name': self.name}
        data['values'] = [history.value for history in raw_histories]
        data['timestamps'] = [int(history.created.timestamp()) for history in raw_histories]
        data['are_automatic'] = [history.is_automatic for history in raw_histories]
        return data


class History(db.Model):

    __tablename__ = 'histories'

    id = db.Column(db.Integer, primary_key=True)
    score_id = db.Column(db.ForeignKey('scores.id'))
    score = db.relationship('Score', uselist=False, backref=db.backref('histories'))
    value = db.Column(db.Integer, default=0, nullable=False)
    is_automatic = db.Column(db.Boolean, default=False, nullable=False)
    created = db.Column(db.DateTime, default=datetime.now, nullable=False)

    def __repr__(self):
        return f'<History {self.id}>'

    @classmethod
    def record(cls, score, is_automatic=False, commit=True):
        '''Record a history entry for a given score.'''
        # if score.id is None:
        #     # Flush first to get object ID
        #     db.session.flush()
        history = cls(score=score, value=score.value, is_automatic=is_automatic)
        db.session.add(history)
        if commit:
            db.session.commit()
