from datetime import timedelta
from typing import Annotated
from fastapi import HTTPException, Depends, status, APIRouter
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from schemas.auth import Token, UserCreate, UserResponse
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


@router.post("/token/")
async def login_for_access_token(
    login_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: SessionDep
):
    try:
        user = authenticate_user(db, login_data.username, login_data.password)
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
    except HTTPException as e:
        #! Capturamos el detalle del error sin el código de estado
        error_message = e.detail if isinstance(e.detail, str) else "An error occurred"
        return JSONResponse(
            status_code=e.status_code,
            content={"message": error_message}  
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "An error occurred: " + str(e)}
        )



@router.post(
    "/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register_user(user: UserCreate, db: SessionDep):
    return await create_user(user, db)
