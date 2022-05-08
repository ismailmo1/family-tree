from flask import Flask
from flask_restful import Api

from app.resources.parent import Parent


def create_app():
    app = Flask(__name__)
    api = Api()
    api.add_resource(Parent, "/parent")

    api.init_app(app)

    return app
