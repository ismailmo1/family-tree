from app.db import family_graph


def delete_person(person_id: str):
    """remove person and all their relationships

    Args:
        person_id (str): person to delete
    """
    cypher_query = "MATCH (p:Person {id:$person_id}) DETACH DELETE p"

    family_graph.write_query(cypher_query, {"person_id": person_id})


def delete_relationships(person_id: str):
    """remove all relationships of a person

    Args:
        person_id (str): person whose relationships to delete
    """
    cypher_query = "MATCH (p:Person {id:$person_id})-[rel]-() DELETE rel"

    family_graph.write_query(cypher_query, {"person_id": person_id})
