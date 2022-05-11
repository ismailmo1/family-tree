from app.db.transactions.find import find_parents
from app.db.transactions.update import add_parent
from fastapi import APIRouter

router = APIRouter(prefix="/parents")


@router.get("/")
def get_parents(id: str):
    return find_parents(id)


@router.post("/")
def post_parents(child_id: str, parent1_id: str, parent2_id: str):
    return add_parent(child_id, parent1_id, parent2_id)
