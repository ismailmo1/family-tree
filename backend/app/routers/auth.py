from app.dependencies.auth import (
    authenticate_user,
    create_refresh_token,
    get_current_user,
    create_access_token,
)
from app.models.token import Token

from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/auth")


@router.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    try:
        user = authenticate_user(form_data.username, form_data.password)
    except IndexError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    print("refreshing")
    return {}


# TODO add signup - check for existing username/email then add node
# TODO add invite link for family members to prevent duplicate nodes+graphs
