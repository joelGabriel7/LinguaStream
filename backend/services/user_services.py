from databases import get_session, Session
from models.users import Users
from fastapi import  Depends
from typing import Annotated
from schemas.auth import UserCreate
from core.security import get_password_hash

SessionDep = Annotated[Session, Depends(get_session)]


async def create_user(users: UserCreate, db: SessionDep) -> Users:
    hash_password = get_password_hash(users.password)
    user = Users(email=users.email, name=users.name, hashed_password=hash_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
