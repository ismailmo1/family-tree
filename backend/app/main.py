"""entrypoint for FastAPI app"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.db.transactions.create import create_user
from app.db.transactions.find import find_person_by_username
from app.db.transactions.update import add_person_prop
from app.dependencies.auth import hash_password
from app.routers import auth, children, family, parents, people
from app.db import family_graph
from neo4j.exceptions import ConstraintError, ClientError


app = FastAPI()

app.include_router(parents.router)
app.include_router(family.router)
app.include_router(children.router)
app.include_router(people.router)
app.include_router(auth.router)


@app.on_event("startup")
def add_admin():
    """create admin account and assign password from `ADMIN_PASSWORD` env var
    If admin already exists, will change the password of existing admin to
    `ADMIN_PASSWORD` without creating another admin user"""
    # check if we have admin
    admin_pwd = os.environ["ADMIN_PASSWORD"]
    hashed_pwd = hash_password(admin_pwd)
    try:
        create_user("admin", "admin", hashed_pwd)
    except ConstraintError:
        # we already have admin
        admin_id = find_person_by_username("admin")["id"]
        add_person_prop(admin_id, {"hashed_password": hashed_pwd})


@app.on_event("startup")
def add_db_constraints():
    """add all constraints to db:
    - unique usernames"""
    unique_user_constraint_qry = """CREATE CONSTRAINT uniqueUsername ON (n:Person)
    ASSERT n.username IS UNIQUE"""
    try:
        family_graph.write_query(unique_user_constraint_qry)
    except ClientError:
        # constraint already exists
        pass


@app.get("/")
def index():
    """redirect to openapi docs"""
    return RedirectResponse("/docs")


origins = [os.environ.get("FRONTEND_URL", "http://localhost:3000")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
