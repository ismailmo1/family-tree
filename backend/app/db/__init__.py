import os

from app.db.family_db import FamilyGraph
from dotenv import load_dotenv

load_dotenv()
uri = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
db_auth = os.environ.get("NEO4J_AUTH", None)

if db_auth: 
    user, password = db_auth.split("/")
else:
    user = None
    password=None


family_graph = FamilyGraph(uri, user, password)
