from datetime import timedelta
from typing import Annotated
from fastapi import HTTPException, Depends, status, APIRouter
from schemas.auth import LoginSchema, Token, UserCreate,UserResponse
from databases import get_session, Session
from services.user_services import create_user


from core.security import (
    authenticate_user,
    ACCESS_TOKEN_EXPIRATION,
    create_access_token,
)

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login")
async def login_for_access_token(login_data: LoginSchema, db: SessionDep):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRATION)
    access_token = create_access_token(
        data={"email": user.email, "id": user.id}, expire_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: SessionDep):
    return await create_user(user, db)
