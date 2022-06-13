from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.routers import auth, children, family, parents, people

app = FastAPI()

app.include_router(parents.router)
app.include_router(family.router)
app.include_router(children.router)
app.include_router(people.router)
app.include_router(auth.router)


@app.get("/")
def index():
    return RedirectResponse("/docs")


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
