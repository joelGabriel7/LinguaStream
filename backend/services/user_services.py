from databases import get_session, Session
from models.users import Users
from fastapi import  Depends, HTTPException,status
from typing import Annotated
from schemas.auth import UserCreate
from core.security import get_password_hash, get_user

SessionDep = Annotated[Session, Depends(get_session)]


async def create_user(users: UserCreate, db: SessionDep) -> Users:
    hash_password = get_password_hash(users.password)
    exist_user = get_user(db, users.email)
    if exist_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email already register')
    user = Users(email=users.email, name=users.name, hashed_password=hash_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
