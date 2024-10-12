from databases import get_session
from core.security import get_current_user
from fastapi import APIRouter, Depends
from typing import Annotated
from models.users import Users
from sqlmodel import select,Session


user_router = APIRouter(prefix='/user', tags=['Users'])
UserDep = Annotated[Users, Depends(get_current_user)]

@user_router.get('/me')
async def current_user_endpoint(
    current_user: UserDep,
    db: Session = Depends(get_session)
):
    query = select(Users).where(Users.id == current_user.id)
    result = db.exec(query) 
    return result.first()