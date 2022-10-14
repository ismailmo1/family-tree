"""DB delete transactions to remove people and relationships"""

from app.db import family_graph


def delete_person(person_id: str):
    """remove person and all their relationships

    Args:
        person_id (str): person to delete
    """
    cypher_query = "MATCH (p:Person {id:$person_id}) DETACH DELETE p"

    return family_graph.write_query(cypher_query, {"person_id": person_id})


def delete_all_relationships(person_id: str):
    """remove all relationships of a person

    Args:
        person_id (str): person whose relationships to delete
    """
    cypher_query = "MATCH (p:Person {id:$person_id})-[rel]-() DELETE rel"

    return family_graph.write_query(cypher_query, {"person_id": person_id})


def delete_relationship(person_id_1: str, person_id_2: str):
    """Delete relationship between two people. This will delete any and all
    direct relationships between `person_id_1` and `person_id_2`.

    Args:
        person_id_1 (str): id of person 1
        person_id_2 (str): id of person 1
    """
    cypher_query = """MATCH (p:Person {id:$person_id_1})-[rel]-p:Person {id:$person_id_2})
                        DELETE rel"""

    return family_graph.write_query(
        cypher_query, {"person_id_1": person_id_1, "person_id_2": person_id_2}
    )
