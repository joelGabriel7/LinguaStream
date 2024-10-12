from fastapi import HTTPException, status, Depends
from sqlmodel import Session
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
import os
import jwt
from backend.models.users import Users

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRATION = 30
REFRESH_TOKEN_EXPIRATION = 60 * 24


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

"""Verify the passwod is correct"""


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


""" hash the password """


def get_password_hash(password):
    return pwd_context.hash(password)


""" Find de user """


def get_user(db: Session, email: str):
    return db.exec(Users).filter(Users.email == email).first()


"""  authenticated user  """


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


""" Generate JWT """


def create_access_token(data: dict, expire_delta: timedelta | None = None):
    #! doing a copy of dict to income on request
    to_encode = data.copy()
    #! Validate if de time of expirations is valid we add to value
    if expire_delta:
        expire = datetime.now(timezone.utc) + expire_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    #! Add expiration date to  data encoded
    to_encode.update({"exp": expire})
    #! Generate JWT
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


""" Refresh token """


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=REFRESH_TOKEN_EXPIRATION)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


""" Get current user on session """


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends()
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(db, email=email)
    if user is None:
        raise credentials_exception
    return user
