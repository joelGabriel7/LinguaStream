from sqlmodel import Field, SQLModel


class Languages(SQLModel, table=True):
    id : int | None = Field(default=None, primary_key=True)
    language_code: str = Field(index=True, nullable=False)  
    name: str = Field(nullable=False) 