from app.db import family_graph
from app.db.transactions.types import TransactionType


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
        "MATCH (:Person{id:$child_id} )-[:CHILD_OF]->(parents:Person)"
        "RETURN parents.id as id, parents.name as name"
    )
    query = (cypher_query, {"child_id": child_id})

    return query


@family_graph.transaction(TransactionType.READ)
def find_full_siblings(person_id: str):

    cypher_query = (
        "MATCH (parent1:Person)<-[:CHILD_OF]-(:Person{id:$person_id} )"
        "-[:CHILD_OF]->(parent2:Person)<-[:CHILD_OF]-(siblings:Person)"
        "-[:CHILD_OF]->(parent2:Person)"
        "RETURN DISTINCT siblings.id as id, siblings.name as name"
    )
    query = (cypher_query, {"child_id": person_id})

    return query


@family_graph.transaction(TransactionType.READ)
def find_all_siblings(person_id: str):
    """find all siblings that share atleast one parent

    Args:
        person_id (str): id of person whose siblings to find

    Returns:
        list[dict[str,str]]: list of match dictionaries with id and name
        i.e. [{'id':<ID>, 'name':<NAME>}]
    """
    cypher_query = (
        "MATCH (:Person{id:$person_id} )-[:CHILD_OF]->(parents:Person)"
        "<-[:CHILD_OF]-(siblings:Person)"
        "RETURN DISTINCT siblings.id as id, siblings.name as name"
    )
    query = (cypher_query, {"child_id": person_id})

    return query


def find_siblings(person_id: str, full_only=False):
    if full_only:
        return find_full_siblings(person_id)
    else:
        return find_all_siblings(person_id)


@family_graph.transaction(TransactionType.READ)
def find_cousins(person_id: str, degree: int = 1):
    """find people related to you via n_degrees of separation


    Args:
        person_id (str): id of person's whose cousins to find
        degree (int, optional): degree of separation,
        i.e. 1 = first cousin, 2 = second etc. Defaults to 1.
    """
    cypher_query = (
        "MATCH (me:Person { id:$person_id})-[:CHILD_OF]->(parent:Person)"
        "-[:CHILD_OF]->(grandparents:Person)<-[:CHILD_OF]-"
        "(unc_aunt:Person)-[:CHILD_OF]-(cousins:Person)"
        "RETURN cousins.name, cousins.id, unc_aunt.name, unc_aunt.id,"
        "parent.id,parent.name"
    )
    query = (cypher_query, {"person_id": person_id})

    return query
