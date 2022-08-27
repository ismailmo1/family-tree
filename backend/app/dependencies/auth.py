import os
from datetime import timedelta, datetime

from app.db.transactions.find import find_person_by_username
from app.models.token import Token, TokenData
from app.models.user import User
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)
REFRESH_TOKEN_EXPIRE_MINUTES = int(
    os.environ.get("REFRESH_TOKEN_EXPIRE_MINUTES", 1440)
)
SECRET_KEY = os.environ.get("SECRET_KEY")
REFRESH_SECRET_KEY = os.environ.get("REFRESH_SECRET_KEY")
ALGORITHM = os.environ.get("JWT_ALGORITHM")

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


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    if token_data.username:
        user = get_user(username=token_data.username)
        if user is None:
            raise credentials_exception
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
