import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler
from flask_caching import Cache

from config import app_config


# Initialize outside to be importable
db = SQLAlchemy()
socketio = SocketIO()
cache = Cache(config={'CACHE_TYPE': 'simple'})
scheduler = APScheduler()

def create_app():
    # Initialize app and related instances
    app = Flask(__name__, instance_relative_config=True)

    # Configure app environment, defaults to development
    flask_env = os.getenv('FLASK_ENV')
    app.config.from_object(app_config.get(flask_env, app_config['development']))

    # Initialize plugin instances
    socketio.init_app(app)
    scheduler.init_app(app)
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
        '''
        Initialize database entries for default settings.
        Note we assume each entity only has one score.
        '''
        from munscore.models import Entity, Score, History
        from munscore.site_config import VENUES, PARTIES, SCORE_NAME, DEFAULT_SCORE

        # Initialize venue (and score) entries if they don't exist
        for venue_name in VENUES:
            venue = Entity.query.filter_by(name=venue_name, is_venue=True).first()
            if venue is None:
                venue = Entity(name=venue_name, is_venue=True)
                db.session.add(venue)
            score = Score.query.filter_by(name=SCORE_NAME['venue'], entity=venue).first()
            if score is None:
                score = Score(name=SCORE_NAME['venue'], value=DEFAULT_SCORE['venue'], entity=venue)
                db.session.add(score)
                History.record(score, is_automatic=True)

        # Initialize party (and score) entries if they don't exist
        for party_name in PARTIES:
            party = Entity.query.filter_by(name=party_name, is_party=True).first()
            if party is None:
                party = Entity(name=party_name, is_party=True)
                db.session.add(party)
            score = Score.query.filter_by(name=SCORE_NAME['party'], entity=party).first()
            if score is None:
                score = Score(name=SCORE_NAME['party'], value=DEFAULT_SCORE['party'], entity=party)
                db.session.add(score)
                History.record(score, is_automatic=True)

        db.session.commit()

    return app
