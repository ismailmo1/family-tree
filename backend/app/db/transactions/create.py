from typing import Dict, List
from uuid import uuid4

from app.db import family_graph


def create_child(
    child_name: str,
    parent1_id: str,
    parent2_id: str,
) -> list[dict[str, str]]:
    cypher_query = (
        "MATCH (parent1:Person { id: $parent1_id})"
        "MATCH (parent2:Person { id: $parent2_id})"
        "CREATE (child:Person { name: $child_name, id: $child_id}) "
        "CREATE (child)-[:CHILD_OF]-> (parent1)"
        "CREATE (child)-[:CHILD_OF]->(parent2)"
        "RETURN child, parent1, parent2"
    )
    result = family_graph.write_query(
        cypher_query,
        {
            "child_name": child_name,
            "child_id": str(uuid4()),
            "parent1_id": parent1_id,
            "parent2_id": parent2_id,
        },
    )
    return result


def add_child(
    child_id: str,
    parent1_id: str,
    parent2_id: str,
) -> list[dict[str, str]]:
    """create child of relationship between child and parent 1 and 2 if they don't exist already"""
    cypher_query = (
        "MATCH (parent1:Person { id: $parent1_id})"
        "MATCH (parent2:Person { id: $parent2_id})"
        "MATCH (child:Person { id: $child_id}) "
        "MERGE (child)-[:CHILD_OF]-> (parent1)"
        "MERGE (child)-[:CHILD_OF]->(parent2)"
        "RETURN child"
    )
    result = family_graph.write_query(
        cypher_query,
        {
            "child_id": child_id,
            "parent1_id": parent1_id,
            "parent2_id": parent2_id,
        },
    )
    return result


def create_user(
    person_name: str, username: str, hashed_password: str
) -> dict[str, str]:
    cypher_query = (
        "CREATE (person:Person { name: $person_name, id: $id, username:$username, hashed_password:$hashed_password }) "
        "RETURN person.name as name, person.id as id"
    )
    result = family_graph.write_query(
        cypher_query,
        {
            "person_name": person_name,
            "id": str(uuid4()),
            "username": username,
            "hashed_password": hashed_password,
        },
    )

    return result


def create_person(person_name: str) -> List[Dict[str, str]]:
    cypher_query = (
        "CREATE (person:Person { name: $person_name, id: $id }) "
        "RETURN person.name as name, person.id as id"
    )
    result = family_graph.write_query(
        cypher_query, {"person_name": person_name, "id": str(uuid4())}
    )

    return result


def create_marriage(person1_id: str, person2_id: str) -> list[dict[str, str]]:
    cypher_query = (
        "MATCH (person1:Person { id: $person1_id }) "
        "MATCH (person2:Person { id: $person2_id }) "
        "CREATE (person1)-[:SPOUSE_OF]->(person2) "
        "RETURN person1, person2"
    )

    result = family_graph.write_query(
        cypher_query,
        {"person1_id": person1_id, "person2_id": person2_id},
    )

    return result
