import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache

from config import app_config


# Initialize outside to be importable
db = SQLAlchemy()

def create_app():
    # Initialize app and related instances
    app = Flask(__name__, instance_relative_config=True)
    # Configure app environment, defaults to development
    flask_env = os.getenv('FLASK_ENV')
    app.config.from_object(app_config.get(flask_env, app_config['development']))

    cache = Cache(config={'CACHE_TYPE': 'simple'})
    cache.init_app(app)

    # Import views and APIs
    with app.app_context():
        import munscore.views
        from munscore.apis import api
    app.register_blueprint(api)

    # Initialize database
    db.init_app(app)
    with app.app_context():
        db.create_all()

    @app.before_first_request
    def initialize_db_entries():
        '''Initialize database by creating default contest and party entries.'''
        from munscore.models import Contest, Entity, Score, History
        from munscore.site_config import CONTEST_ID, CONTEST_NAME, PARTIES, SCORE_NAME, DEFAULT_SCORE

        # Create default contest entry if it doesn't exist
        contest = Contest.query.get(CONTEST_ID)
        if contest is None:
            contest = Contest(id=CONTEST_ID, name=CONTEST_NAME)
            db.session.add(contest)

        # Create party entries and scores if they don't exist
        for party_name in PARTIES:
            party = Entity.query.filter_by(name=party_name, is_party=True).first()
            if party is None:
                party = Entity(name=party_name, is_party=True, contest_id=contest.id)
                db.session.add(party)
            # Note we assume here there is only one score associated to each party
            score = Score.query.filter_by(name=SCORE_NAME['party'], entity_id=party.id).first()
            if score is None:
                score = Score(name=SCORE_NAME['party'], val=DEFAULT_SCORE['party'], entity_id=party.id)
                db.session.add(score)
                History.record(score, is_automatic=True)

        db.session.commit()

    return app
