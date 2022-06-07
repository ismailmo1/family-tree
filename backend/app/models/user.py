from pydantic import BaseModel


class User(BaseModel):
    username: str
    hashed_password: str
    name: str
    id: str
