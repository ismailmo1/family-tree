import os

from pydantic import BaseModel

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("JWT_ALGORITHM")


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class InviteToken(BaseModel):
    token: str
    source_user_id: str
    target_user_id: str


class SignupForm(BaseModel):
    invite_token: str
    username: str
    password: str
