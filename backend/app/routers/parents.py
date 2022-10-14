""""Routes to add and get parent data"""

from app.db.transactions.find import find_parents, find_siblings
from app.routers import auth
from app.db.transactions.update import add_parent
from app.db.transactions.delete import delete_relationship
from fastapi import APIRouter, Depends


router = APIRouter(
    prefix="/parents", dependencies=[Depends(auth.get_current_user)]
)


@router.get("/")
def get_parents(id: str):
    """return all parents of person"""
    return find_parents(id)


@router.post("/")
def post_parents(child_id: str, parent_id):
    """create parent-child relationship between `parent_id` and `child_id`.

    Also adds parent to all of `child_id`'s siblings and parent_id will replace a
    dummy parent if they exist on `child_id`"""
    # HACK when we add step parent functionality - this will need some more thought
    # maybe just an extra argument for map of siblings to parent name
    # so we can see which parents are shared between which siblings

    # replace dummy parents if they exist
    current_parents = find_parents(child_id)
    if current_parents:
        for parent in current_parents:
            if parent["name"] == "dummy_parent":
                delete_relationship(parent["id"], child_id)
                # only remove one dummy parent (since we're only adding one real parent)
                break
    # add parents for all siblings of this child if they exist
    siblings = find_siblings(child_id)
    if siblings:
        for sibling in siblings:
            add_parent(sibling["id"], parent_id)
    return add_parent(child_id, parent_id)[0]
