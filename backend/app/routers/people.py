from app.db.transactions.create import create_person
from app.db.transactions.find import find_person_by_id, find_person_by_name
from app.routers import auth
from fastapi import APIRouter, Depends, HTTPException

from app.db.transactions.delete import delete_person

router = APIRouter(
    prefix="/people", dependencies=[Depends(auth.get_current_user)]
)


@router.get("/")
def get_person(id: str | None = None, name: str | None = None):
    people_props = []
    if id is None and name is None:
        raise HTTPException(400, "You must provide either an id or name!")
    elif name:
        id_list = find_person_by_name(name)
        if len(id_list) == 1:
            id_from_name = id_list[0]["id"]
            return [find_person_by_id(id_from_name)[0]["props"]]

        for person in id_list:
            people_props.append(find_person_by_id(person["id"])[0]["props"])
    elif id is not None:
        people_props = [find_person_by_id(id)[0]["props"]]
    return people_props


@router.post("/")
def add_person(name: str):
    return create_person(name)[0]


@router.delete("/")
def remove_person(id: str):
    return delete_person(id)
