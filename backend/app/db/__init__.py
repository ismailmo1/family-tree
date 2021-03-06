import os

from app.db.family_db import FamilyGraph
from dotenv import load_dotenv

load_dotenv()
uri = os.environ["NEO4J_URI"]
user = os.environ.get("NEO4J_USERNAME", None)
password = os.environ.get("NEO4J_PASSWORD", None)

family_graph = FamilyGraph(uri, user, password)
