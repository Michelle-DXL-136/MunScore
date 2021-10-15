import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
# from flask_login import LoginManager

from config import app_config


# 初始化应用相关实例

app = Flask(__name__, instance_relative_config=True)
app.config.from_object(app_config['development'])
# app.config.from_pyfile('secrets.py')

db = SQLAlchemy()

# cache = Cache(config={'CACHE_TYPE': 'simple'})
# cache.init_app(app)

import munscore.views
from munscore.apis import api

app.register_blueprint(api)

# 创建数据库
db.init_app(app)
with app.app_context():
    db.create_all()
