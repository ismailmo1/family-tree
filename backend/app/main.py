from fastapi import FastAPI

from .routers import children, family, parents, people

app = FastAPI()

app.include_router(parents.router)
app.include_router(family.router)
app.include_router(children.router)
app.include_router(people.router)
