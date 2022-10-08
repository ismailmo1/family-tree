from app.db.transactions.create import create_user
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import os
from app.dependencies.auth import hash_password
from app.routers import auth, children, family, parents, people

app = FastAPI()

app.include_router(parents.router)
app.include_router(family.router)
app.include_router(children.router)
app.include_router(people.router)
app.include_router(auth.router)

@app.on_event("startup")
def add_admin():
    admin_pwd = os.environ["ADMIN_PASSWORD"]
    hashed_pwd = hash_password(admin_pwd)
    create_user("admin", "admin", hashed_pwd)

@app.get("/")
def index():
    return RedirectResponse("/docs")


origins = [os.environ.get("FRONTEND_URL", "http://localhost:3000")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
