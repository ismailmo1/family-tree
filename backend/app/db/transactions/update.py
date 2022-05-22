from app.db import family_graph
from app.db.transactions.find import find_person_properties
from app.db.transactions.types import TransactionType


@family_graph.transaction(TransactionType.WRITE)
def add_sibling(sibling_with_parent_id: str, new_sibling_id: str):
    cypher_query = (
        "MATCH (:Person {id:$sibling_with_parent_id} )-[:CHILD_OF]->(parents:Person)"
        "MATCH (orphan:Person {id: $new_sibling_id})"
        "CREATE (orphan)-[:CHILD_OF]->(parents)"
        "RETURN parents.name, parents.id, orphan.name, orphan.id"
    )

    query = (
        cypher_query,
        {
            "sibling_with_parent_id": sibling_with_parent_id,
            "new_sibling_id": new_sibling_id,
        },
    )

    return query


@family_graph.transaction(TransactionType.WRITE)
def add_parent(child_id: str, parent_id: str):
    cypher_query = (
        "MATCH (child:Person { id: $child_id})"
        "MATCH (parent:Person { id: $parent_id})"
        "CREATE (child)-[:CHILD_OF]->(parent)"
        "RETURN child, parent"
    )
    query = (
        cypher_query,
        {
            "child_id": child_id,
            "parent_id": parent_id,
        },
    )
    return query


def add_person_prop(person_id: str, property_map: dict):
    cypher_query = "MATCH (p:Person{ id:$person_id} ) SET p = $props RETURN p"
    current_props = find_person_properties(person_id)
    props = {**current_props, **property_map}
    query = (cypher_query, {"person_id": person_id, "props": props})
    return query
