from app.db.transactions.create import (
    add_child,
    create_marriage,
    create_person,
)
from app.db.transactions.find import (
    find_children,
    find_cousins,
    find_parents,
    find_person_by_id,
    find_siblings,
    find_spouse,
)
from app.routers import auth
from fastapi import APIRouter, Depends

router = APIRouter(
    prefix="/family", dependencies=[Depends(auth.get_current_user)]
)


@router.post("/spouse")
def wed_couple(person1_id: str, person2_id: str):
    return create_marriage(person1_id, person2_id)[0]


@router.get("/spouse")
def get_spouse(id: str):
    return find_spouse(id)


@router.get("/siblings")
def get_siblings(id: str, full_only: bool = False):
    return find_siblings(id, full_only)


@router.post("/siblings")
def add_siblings(person_id: str, sibling_to_add_id: str):
    # use person_id's parents as first option
    person_parents_id = [p["id"] for p in find_parents(person_id)]

    if len(person_parents_id) == 0:
        # check if sibling_to_add has parents
        parents_id = [p["id"] for p in find_parents(sibling_to_add_id)]
        # person_id is now the child that needs to be added to parents
        child_id = person_id
    else:
        parents_id = person_parents_id
        child_id = sibling_to_add_id

    # if neither have parents create dummy/placeholder parents and add both as children
    if len(parents_id) == 0:
        dummy_parents = [
            create_person("dummy_parent")[0],
            create_person("dummy_parent")[0],
        ]
        parents_id = [p["id"] for p in dummy_parents]
        add_child(person_id, parents_id[0], parents_id[1])
        child = add_child(sibling_to_add_id, parents_id[0], parents_id[1])[0]

    child = add_child(child_id, parents_id[0], parents_id[1])[0]
    return {"person": child["child"]}


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


@router.get("/nuclear")
def get_nuclear_family(child_id: str = None, parent_id: str = None):
    if child_id:
        parents = find_parents(child_id)
        children = find_siblings(child_id)
        child_props = find_person_by_id(child_id)
        child = child_props[0]["props"]
        children.append(child)
    if parent_id:
        parent = find_person_by_id(parent_id)[0]["props"]
        spouse = find_spouse(parent_id)
        parents = [*spouse, parent]
        children = find_children(parent_id)

    return {"parents": parents, "children": children}
