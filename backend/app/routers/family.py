from app.db.transactions.create import create_marriage
from app.db.transactions.find import (
    find_cousins,
    find_parents,
    find_person_properties,
    find_siblings,
)
from fastapi import APIRouter

router = APIRouter(prefix="/family")


@router.post("/wedding")
def wed_couple(person1_id: str, person2_id: str):
    return create_marriage(person1_id, person2_id)


@router.get("/siblings")
def get_siblings(person_id: str, full_only: bool = False):
    return find_siblings(person_id, full_only)


@router.get("/cousins")
def get_cousins(person_id: str, degree: int = 1):
    return find_cousins(person_id, degree)


@router.get("/piblings")
def get_piblings(person_id: str):
    parents = find_parents(person_id)

    parent1_siblings = find_siblings(parents[0]["id"])
    parent2_siblings = find_siblings(parents[1]["id"])

    return {
        parents[0]["name"]: parent1_siblings,
        parents[1]["name"]: parent2_siblings,
    }


@router.get("/nuclear")
def get_nuclear_family(child_id: str):
    parents = find_parents(child_id)
    children = find_siblings(child_id)
    child_props = find_person_properties(child_id)
    child = {"id": child_props[id], "name": child_props["name"]}
    children.append(*child)
    return {"parents": parents, "children": children}
