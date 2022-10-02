from app.dependencies.auth import (
    authenticate_user,
    blacklist_refresh_token,
    create_invite_token,
    create_refresh_token,
    decode_invite_token,
    get_current_user,
    create_access_token,
    get_refresh_user,
    hash_password,
)
from app.models.token import InviteToken, SignupForm, Token
from jose.exceptions import ExpiredSignatureError, JWTError
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Response, status
from app.dependencies.exceptions import (
    ExpiredTokenError,
    InvalidInviteTokenError,
    UserExistsError,
)
from app.db.transactions.find import find_person_by_id
from app.db.transactions.update import add_person_prop


router = APIRouter(prefix="/auth")


@router.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = authenticate_user(form_data.username, form_data.password)

    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(token: Token):
    # only refresh token if access token is expired
    try:
        # this will error if token is expired
        get_current_user(token.access_token)
        # if this doesn't error then we return existing
        # tokens without generating new ones
        # i.e. mum can we have new tokens? no we have tokens at home
        return {
            "access_token": token.access_token,
            "refresh_token": token.refresh_token,
            "token_type": "bearer",
        }
    except ExpiredTokenError as e:
        # we expect this error as the current access token should've expired
        # before asking for a refresh
        # now try using the refresh token
        try:
            refresh_payload = get_refresh_user(token.refresh_token)
        except ExpiredSignatureError:
            # refresh token is also expired, client needs to login again
            # redirect on client side
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
            )
        # invalidate current refresh token so it can't be reused
        blacklist_refresh_token(token.refresh_token)
        new_access_token = create_access_token(
            data={"sub": refresh_payload.username}
        )
        new_refresh_token = create_refresh_token(
            data={"sub": refresh_payload.username}
        )

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }


# TODO add signup - check for existing username/email then add node
# TODO add invite link for family members to prevent duplicate nodes+graphs
@router.post("/invite", response_model=InviteToken)
def get_invite_token(
    target_user_id: str,
    current_user: User = Depends(get_current_user),
):
    invite_token = create_invite_token(current_user.id, target_user_id)

    return InviteToken(
        token=invite_token,
        source_user_id=current_user.id,
        target_user_id=target_user_id,
    )


@router.get("/signup")
def validate_invite(invite: str):
    try:
        invite_data = decode_invite_token(invite)
    except JWTError:
        raise InvalidInviteTokenError
    return {
        "source_user_id": invite_data["source_user_id"],
        "target_user_id": invite_data["target_user_id"],
    }


@router.post("/signup")
def signup_user(form_data: SignupForm):
    try:
        invite_data = decode_invite_token(form_data.invite_token)
    except JWTError:
        raise InvalidInviteTokenError

    target_user_id = invite_data["target_id"]
    target_user = find_person_by_id(target_user_id)[0]
    if "username" in target_user:
        raise UserExistsError
    hashed_password = hash_password(form_data.password)
    add_person_prop(target_user_id, {"username": form_data.username})
    add_person_prop(target_user_id, {"hashed_password": hashed_password})
    return Response(status_code=status.HTTP_201_CREATED)
