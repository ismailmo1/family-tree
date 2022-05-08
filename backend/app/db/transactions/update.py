from app.db import family_graph
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
def add_parent(child_id: str, parent1_id: str, parent2_id: str):
    cypher_query = (
        "MATCH (child:Person { id: $child_id})"
        "MATCH (parent1:Person { id: $parent1_id})"
        "MATCH (parent2:Person { id: $parent2_id})"
        "CREATE (child)-[:CHILD_OF]->(parent1)"
        "CREATE (child)-[:CHILD_OF]->(parent2)"
        "RETURN child.name, child.id, parent1.name, parent1.id, parent2.name, parent2.id"
    )
    query = (
        cypher_query,
        {
            "child_id": child_id,
            "parent1_id": parent1_id,
            "parent2_id": parent2_id,
        },
    )
    return query
