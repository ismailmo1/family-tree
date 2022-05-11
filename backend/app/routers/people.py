from app.db.transactions.create import create_person
from app.db.transactions.find import (
    find_person_by_name,
    find_person_properties,
)
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/people")


@router.get("/")
def get_person(id: str | None = None, name: str | None = None):
    if id == None and name == None:
        raise HTTPException(400, "You must provide either an id or name!")
    elif name:
        id_list = find_person_by_name(name)
        for id in id_list:
            people_props = find_person_properties(id)
    else:
        people_props = find_person_properties(id)
    return people_props


@router.post("/")
def add_person(name: str):
    return create_person(name)
