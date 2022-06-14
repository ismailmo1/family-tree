from app.db.transactions.create import create_child
from app.db.transactions.find import find_children
from app.routers import auth
from fastapi import APIRouter, Depends

router = APIRouter(
    prefix="/children", dependencies=[Depends(auth.get_current_user)]
)


@router.get("/")
def get_children(id: str):
    return find_children(id)


@router.post("/")
def birth_child(child_name: str, parent1_id: str, parent2_id: str):
    return create_child(child_name, parent1_id, parent2_id)
