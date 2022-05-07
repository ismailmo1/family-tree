from db import family_graph
from db.transactions.types import TransactionType


@family_graph.transaction(TransactionType.READ)
def find_person_by_name(person_name: str) -> list[dict[str, str]]:
    """Find person nodes that match name

    Args:
        tx (neo4j.Transaction): OMIT this argument - it is automatically passed in by neo4j
        person_name (str): the name to search for

    Returns:
        list[dict[str, str]]: list of people dict: [{"name":<NAME>, "id":<ID>}]
    """
    cypher_query = "MATCH (p:Person { name:$person_name }) RETURN p.name as name, p.id as id"
    query = (cypher_query, {"person_name": person_name})

    return query


@family_graph.transaction(TransactionType.READ)
def find_parents(child_id: str):

    cypher_query = (
        "MATCH (:Person{name:$child_id} )-[:CHILD_OF]->(parents:Person)"
        "RETURN parents.id as id, parents.name as name"
    )
    query = (cypher_query, {"child_id": child_id})

    return query
