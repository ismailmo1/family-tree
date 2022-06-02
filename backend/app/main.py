from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import children, family, parents, people

app = FastAPI()

app.include_router(parents.router)
app.include_router(family.router)
app.include_router(children.router)
app.include_router(people.router)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
