from app.db.transactions.find import find_children, find_spouse
from app.db.transactions.create import add_child
from app.routers import auth
from fastapi import APIRouter, Depends

router = APIRouter(
    prefix="/children", dependencies=[Depends(auth.get_current_user)]
)


@router.get("/")
def get_children(parent_id: str):
    """Get list of children of `parent_id"""
    return find_children(parent_id)


@router.post("/")
def add_children(child_id: str, parent_id: str, add_to_spouse: bool = True):
    """add child relation to `parent_id` and also to `parent_id`'s spouse
    Set `add_to_spouse` to False to override this behaviour."""
    response = add_child(child_id, parent_id)
    if add_to_spouse:
        spouse = find_spouse(parent_id)[0]
        if spouse:
            add_child(child_id, spouse["id"])
    return response
