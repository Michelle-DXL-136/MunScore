import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache

from config import app_config


# Initialize outside to be importable
db = SQLAlchemy()
cache = Cache(config={'CACHE_TYPE': 'simple'})

def create_app():
    # Initialize app and related instances
    app = Flask(__name__, instance_relative_config=True)

    # Configure app environment, defaults to development
    flask_env = os.getenv('FLASK_ENV')
    app.config.from_object(app_config.get(flask_env, app_config['development']))

    # Initialize plugin instances
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
        '''Initialize database entries for default settings.'''
        from munscore.models import Contest, Entity, Score, History
        from munscore.site_config import CONTEST_ID, CONTEST_NAME, PARTIES, SCORE_NAME, DEFAULT_SCORE

        # Create default contest and score if it doesn't exist
        contest = Contest.query.get(CONTEST_ID)
        if contest is None:
            contest = Contest(id=CONTEST_ID, name=CONTEST_NAME)
            contest_entity = Entity(name='Global', is_global=True, contest=contest)
            db.session.add(contest)
            db.session.add(contest_entity)
        else:
            # We assume if contest exists, its corresponding entity also exists
            contest_entity = Entity.query.filter_by(is_global=True, contest=contest).first()
        score = Score.query.filter_by(name=SCORE_NAME['global'], entity=contest_entity).first()
        if score is None:
            score = Score(name=SCORE_NAME['global'], value=DEFAULT_SCORE['global'], entity=contest_entity)
            db.session.add(score)
            db.session.flush()
            History.record(score, is_automatic=True)

        # Create party entries and scores if they don't exist
        for party_name in PARTIES:
            party = Entity.query.filter_by(name=party_name, is_party=True).first()
            if party is None:
                party = Entity(name=party_name, is_party=True, contest=contest)
                db.session.add(party)
                db.session.flush()
            # We assume there is only one score associated to each party
            score = Score.query.filter_by(name=SCORE_NAME['party'], entity=party).first()
            if score is None:
                score = Score(name=SCORE_NAME['party'], value=DEFAULT_SCORE['party'], entity=party)
                db.session.add(score)
                db.session.flush()
                History.record(score, is_automatic=True)

        db.session.commit()

    return app
