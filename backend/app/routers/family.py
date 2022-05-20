from app.db.transactions.create import add_child, create_marriage
from app.db.transactions.find import (
    find_children,
    find_cousins,
    find_parents,
    find_person_properties,
    find_siblings,
    find_spouse,
)
from fastapi import APIRouter

router = APIRouter(prefix="/family")


@router.post("/wedding")
def wed_couple(person1_id: str, person2_id: str):
    return create_marriage(person1_id, person2_id)


@router.get("/siblings")
def get_siblings(id: str, full_only: bool = False):
    return find_siblings(id, full_only)


@router.post("/siblings")
def add_siblings(id: str, sibling_id: str):
    parents_id = [p["id"] for p in find_parents(id)]
    return add_child(sibling_id, parents_id[0], parents_id[1])


@router.get("/cousins")
def get_cousins(id: str, degree: int = 1):
    return find_cousins(id, degree)


@router.get("/piblings")
def get_piblings(id: str):
    parents = find_parents(id)

    parent1_siblings = find_siblings(parents[0]["id"])
    parent2_siblings = find_siblings(parents[1]["id"])

    return {
        parents[0]["name"]: parent1_siblings,
        parents[1]["name"]: parent2_siblings,
    }


@router.get("/spouse")
def get_spouse(id: str):
    return find_spouse(id)


@router.get("/nuclear")
def get_nuclear_family(child_id: str = None, parent_id: str = None):
    if child_id:
        parents = find_parents(child_id)
        children = find_siblings(child_id)
        child_props = find_person_properties(child_id)
        child = child_props[0]["props"]
        children.append(child)
    if parent_id:
        parent = find_person_properties(parent_id)[0]["props"]
        spouse = find_spouse(parent_id)
        parents = [*spouse, parent]
        children = find_children(parent_id)

    return {"parents": parents, "children": children}
