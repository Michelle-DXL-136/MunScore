import os


class Config:
    '''Common configurations.'''

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    LOG_DIR = os.path.join(BASE_DIR, 'log')
    THREADS_PER_PAGE = 2
    CSRF_ENABLED = True
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///munscore.db'
    SECRET_KEY = 'not_really_a_secret'


class DevelopmentConfig(Config):
    '''Development configurations.'''

    ENV = 'development'
    TESTING = True
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SCHEDULER_API_ENABLED = True


class ProductionConfig(Config):
    '''Production configurations.'''

    ENV = 'production'
    TESTING = False
    DEBUG = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SCHEDULER_API_ENABLED = False


app_config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
