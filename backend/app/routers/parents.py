from app.db.transactions.find import find_parents
from app.db.transactions.update import add_parent
from app.routers import auth
from fastapi import APIRouter, Depends

router = APIRouter(
    prefix="/parents", dependencies=[Depends(auth.get_current_user)]
)


@router.get("/")
def get_parents(id: str):
    return find_parents(id)


@router.post("/")
def post_parents(child_id: str, parent_id):
    return add_parent(child_id, parent_id)[0]
