from databases import get_session
from core.security import get_current_user
from fastapi import APIRouter, Depends, status
from typing import Annotated
from models.users import Users
from sqlmodel import select, Session
from services.user_preferences_services import set_preferences_services,get_user_preferences
from schemas.auth import UserPreferences


user_router = APIRouter(prefix="/user", tags=["Users"])
UserDep = Annotated[Users, Depends(get_current_user)]
SessionDep = Annotated[Session, Depends(get_session)]


@user_router.get("/me")
async def current_user_endpoint(
    current_user: UserDep, db: Session = Depends(get_session)
):
    query = select(Users).where(Users.id == current_user.id)
    result = db.exec(query)
    return result.first()


@user_router.post("/preferences", status_code=status.HTTP_201_CREATED)
async def set_preferences(user: UserDep, preferences: UserPreferences, db: SessionDep):
    await set_preferences_services(preferences, user, db)
    return {"message": "Preferences languages set up successfully"}

@user_router.get('/preferences', status_code=status.HTTP_200_OK)
async def get_user_preferences_endpoint(user: UserDep, db: SessionDep):
    return await get_user_preferences(user,db)