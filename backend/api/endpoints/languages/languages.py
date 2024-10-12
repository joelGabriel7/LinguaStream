from models.users import Users
from databases import get_session
from core.security import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, List
from sqlmodel import Session
from services.languages_services import (
    sync_languages_with_google_translate,
    get_all_languages,
)
from schemas.languages_available import LanguagesResponse


languages_router = APIRouter(prefix="/languages", tags=["Languages available"])

UserDep = Annotated[Users, Depends(get_current_user)]
SessionDep = Annotated[Session, Depends(get_session)]


@languages_router.post("/seed", status_code=200)
async def save_languages(db: SessionDep):
    await sync_languages_with_google_translate(db)
    return {"message": "sync succefully"}


@languages_router.get("/all", response_model=List[LanguagesResponse], status_code=400)
async def get_languages(current_user: UserDep, db: SessionDep):
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    return await get_all_languages(db)
