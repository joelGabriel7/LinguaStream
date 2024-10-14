from typing import Optional
from sqlmodel import Field, SQLModel, Relationship


class Users(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False)
    name: str = Field(index=True)
    hashed_password: str = Field(nullable=False)
    preferences: Optional["UserPreferences"] = Relationship(back_populates="user")

class UserPreferences(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key='users.id')
    source_language: str = Field(default=None)
    target_language: str = Field(default=None)
    user: Optional['Users'] = Relationship(back_populates='preferences')