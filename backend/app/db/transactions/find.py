from app.db import family_graph


def find_person_by_username(username: str) -> dict[str, str]:
    """Find person node that matches username

    Args:
        username (str): username to search for

    Returns:
        dict[str, str]: list of people ids: [<ID1>, <ID2>...]
    """
    cypher_query = (
        "MATCH (p:Person { username:$username }) RETURN properties(p) as props"
    )
    try:
        first_match = family_graph.read_query(
            cypher_query, {"username": username}
        )[0]["props"]
    except IndexError:
        raise Exception("No person found!")

    return first_match


def find_person_by_name(person_name: str) -> list[str]:
    """Find person nodes that contain name

    Args:
        person_name (str): person name to search for
        person_name (str): the name to search for

    Returns:
        list[dict[str, str]]: list of people ids: [<ID1>, <ID2>...]
    """
    cypher_query = (
        "MATCH (p:Person) WHERE p.name CONTAINS $person_name "
        "RETURN p.id as id"
    )
    results = family_graph.read_query(
        cypher_query, {"person_name": person_name}
    )
    return results


def find_person_by_id(person_id: str) -> list[dict[str, dict[str, str]]]:
    """return list of properties in format: [{'props':{'prop1':val1...}]

    Usage: person_props = find_person_properties(person_id)[0]['props']

    Args:
        person_id (str): id of person

    Returns:
        list[dict[str, dict[str, str]]]: list of length one with format described above
    """
    cypher_query = (
        "MATCH (p:Person { id:$person_id }) RETURN properties(p) as props"
    )
    results = family_graph.read_query(cypher_query, {"person_id": person_id})

    return results


def find_spouse(id: str):

    cypher_query = (
        "MATCH (:Person{id:$id} )-[:SPOUSE_OF]-(spouse:Person)"
        "RETURN spouse.id as id, spouse.name as name"
    )
    results = family_graph.read_query(cypher_query, {"id": id})

    return results


def find_parents(child_id: str):

    cypher_query = (
        "MATCH (:Person{id:$child_id} )-[:CHILD_OF]->(parents:Person)"
        "RETURN parents.id as id, parents.name as name"
    )
    results = family_graph.read_query(cypher_query, {"child_id": child_id})

    return results


def find_children(parent_id: str):

    cypher_query = (
        "MATCH (:Person{id:$parent_id} )<-[:CHILD_OF]-(children:Person)"
        "RETURN children.id as id, children.name as name"
    )
    results = family_graph.read_query(cypher_query, {"parent_id": parent_id})

    return results


def find_full_siblings(person_id: str):

    cypher_query = (
        "MATCH (parent1:Person)<-[:CHILD_OF]-(:Person{id:$person_id} )"
        "-[:CHILD_OF]->(parent2:Person)<-[:CHILD_OF]-(siblings:Person)"
        "-[:CHILD_OF]->(parent1)"
        "RETURN DISTINCT siblings.id as id, siblings.name as name"
    )
    results = family_graph.read_query(cypher_query, {"person_id": person_id})

    return results


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
    results = family_graph.read_query(cypher_query, {"person_id": person_id})

    return results


def find_siblings(person_id: str, full_only=False):
    if full_only:
        return find_full_siblings(person_id)
    else:
        return find_all_siblings(person_id)


def find_cousins(person_id: str, degree: int = 1):
    """find people related to you via n_degrees of separation


    Args:
        person_id (str): id of person's whose cousins to find
        degree (int, optional): degree of separation,
        i.e. 1 = first cousin, 2 = second etc. Defaults to 1.
    """
    cypher_query = (
        "MATCH (me:Person {id:$person_id})-[:CHILD_OF]->(parent:Person)"
        "-[:CHILD_OF]->(grandparents:Person)<-[:CHILD_OF]-"
        "(unc_aunt:Person)<-[:CHILD_OF]-(cousins:Person) "
        "RETURN DISTINCT parent.id, parent.name,"
        "unc_aunt.name, unc_aunt.id,"
        "cousins.name, cousins.id"
    )
    results = family_graph.read_query(cypher_query, {"person_id": person_id})

    return results


def find_relationship_path(person1_id: str, person2_id: str) -> tuple:
    cypher_query = (
        "MATCH p =shortestPath((:Person {id:$person1_id})"
        "-[*1..100]-(:Person {id:$person2_id}))"
        "RETURN p"
    )

    results = family_graph.read_query(
        cypher_query, {"person1_id": person1_id, "person2_id": person2_id}
    )

    relationships = results[0]["p"].relationships

    return relationships
