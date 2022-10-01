import os
from datetime import timedelta, datetime
from typing import Any, Dict

from app.db.transactions.find import find_person_by_username
from app.models.user import User
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from jose.exceptions import JWTClaimsError, ExpiredSignatureError, JWTError
from passlib.context import CryptContext

from app.dependencies.exceptions import (
    ExpiredTokenError,
    InvalidCredentialsError,
    InvalidTokenError,
    UserNotFoundError,
)

# register env variables
try:
    ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
    )
    SECRET_KEY = os.environ.get("SECRET_KEY", "")
    REFRESH_SECRET_KEY = os.environ.get("REFRESH_SECRET_KEY", "test22")
    REFRESH_TOKEN_EXPIRE_MINUTES = int(
        os.environ.get("REFRESH_TOKEN_EXPIRE_MINUTES", 60)
    )
    INVITE_TOKEN_EXPIRE_MINUTES = int(
        os.environ.get("REFRESH_TOKEN_EXPIRE_MINUTES", 60 * 24)
    )

except KeyError as e:
    raise Exception(f"Environment variable missing: {e}")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(username: str) -> User:
    user = find_person_by_username(username)
    return User(**user)


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str) -> User:
    try:
        user = get_user(username)
    except UserNotFoundError:
        # dont want to specify to user if pass or username is wrong
        raise InvalidCredentialsError
    if not verify_password(password, user.hashed_password):
        raise InvalidCredentialsError
    return user


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        username = payload.get("sub")
        if username is None:
            raise InvalidCredentialsError
    except JWTClaimsError:
        raise InvalidCredentialsError
    except ExpiredSignatureError:
        raise ExpiredTokenError
    except JWTError:
        raise InvalidTokenError

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


def create_invite_token(source_user_id: str, target_user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=INVITE_TOKEN_EXPIRE_MINUTES)
    data = {
        "source_id": source_user_id,
        "target_id": target_user_id,
        "exp": expire,
    }
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def decode_invite_token(invite_token: str) -> Dict[str, Any]:
    return jwt.decode(invite_token, key=SECRET_KEY)
