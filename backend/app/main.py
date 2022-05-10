from fastapi import FastAPI

from .routers import parents

app = FastAPI()

app.include_router(parents.router)
