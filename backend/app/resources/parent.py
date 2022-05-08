from gettext import find

from app.db.transactions.find import find_parents
from flask import request
from flask_restful import Resource


class Parent(Resource):
    def get(self):
        "get list of parents"
        child_id = request.args.get("id")
        parents = find_parents(child_id)
        return {"parents": parents}

    def post(self):
        "create parent-child relationship"
