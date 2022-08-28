import os

from pydantic import BaseModel

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("JWT_ALGORITHM")


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
