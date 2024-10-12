from fastapi import HTTPException, status
from sqlmodel import Session
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

from dotenv import load_dotenv
import os
from backend.models.users import Users

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRATION = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db: Session, email: str):
    return db.exec(Users).filter(Users.email == email).first()


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = get_user(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="password incorrecta"
        )
    return user
