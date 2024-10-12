from typing import Optional
from sqlmodel import Field, SQLModel


class Users(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False)
    name: str = Field(index=True)
    hashed_password: str = Field(nullable=False)