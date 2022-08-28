import os
from datetime import timedelta, datetime

from app.db.transactions.find import find_person_by_username
from app.models.user import User
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from jose.exceptions import JWTClaimsError
from passlib.context import CryptContext

from app.dependencies.exceptions import (
    InvalidCredentialsError,
    UserNotFoundError,
)

# register env variables
try:
    ALGORITHM = os.environ["JWT_ALGORITHM"]
    ACCESS_TOKEN_EXPIRE_MINUTES = 0  # int(
    #     os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"]
    # )
    SECRET_KEY = os.environ["SECRET_KEY"]
    REFRESH_SECRET_KEY = "test22"  # os.environ["REFRESH_SECRET_KEY"]
    REFRESH_TOKEN_EXPIRE_MINUTES = 30  # int(
    #     os.environ["REFRESH_TOKEN_EXPIRE_MINUTES"]
    # )
except KeyError as e:
    raise Exception(f"Environment variable missing: {e}")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(username: str):
    user = find_person_by_username(username)
    return User(**user)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str) -> User:
    user = get_user(username)
    if not user:
        raise credentials_exception
    if not verify_password(password, user.hashed_password):
        raise credentials_exception
    return user


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        username = payload.get("sub")
        if username is None:
            raise InvalidCredentialsError
    except JWTClaimsError:
        raise InvalidCredentialsError

    user = get_user(username=username)
    if user is None:
        raise UserNotFoundError
    return user


def get_refresh_user(refresh_token: str) -> User:
    try:
        payload = jwt.decode(
            refresh_token, REFRESH_SECRET_KEY, algorithms=ALGORITHM
        )
        username = payload.get("sub")
        if username is None:
            raise InvalidCredentialsError
    except JWTClaimsError:
        raise InvalidCredentialsError

    if check_token_blacklist(refresh_token):
        # token is blacklisted
        raise InvalidCredentialsError

    user = get_user(username=username)
    if user is None:
        raise UserNotFoundError

    return user


def create_access_token(
    data: dict, expires_delta: timedelta | None = None
) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(
    data: dict, expires_delta: timedelta | None = None
) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=REFRESH_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM
    )
    return encoded_jwt


def blacklist_refresh_token(refresh_token: str) -> None:
    # TODO store refresh tokens somewhere and add invalid/valid flags
    pass


def check_token_blacklist(refresh_token: str) -> bool:
    """Returns true if token is blacklisted"""
    # TODO check if refresh token isn't in blacklist
    return False
