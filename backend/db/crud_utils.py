import os

from dotenv import load_dotenv

from family_db import FamilyGraph


def create_generic_family(family_name: str, num_children: int) -> None:
    load_dotenv()
    uri = os.environ["NEO4J_URI"]
    user = os.environ["NEO4J_USERNAME"]
    password = os.environ["NEO4J_PASSWORD"]

    with FamilyGraph(uri, user, password) as app:
        app.create_single(f"father_{family_name}")
        app.create_single(f"mother_{family_name}")
        app.create_marriage(f"father_{family_name}", f"mother_{family_name}")

        for idx in range(0, num_children):
            app.create_child(
                f"son{idx+1}_{family_name}",
                f"father_{family_name}",
                f"mother_{family_name}",
            )
