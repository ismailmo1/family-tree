import os

from dotenv import load_dotenv

from db.family_db import FamilyGraph

load_dotenv()
uri = os.environ["NEO4J_URI"]
user = os.environ["NEO4J_USERNAME"]
password = os.environ["NEO4J_PASSWORD"]

family_graph = FamilyGraph(uri, user, password)
