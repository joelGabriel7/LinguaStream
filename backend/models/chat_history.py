from datetime import datetime
from sqlmodel import SQLModel, Field


class ChatHistory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    message: str
    bot_response: str
    timestamp: datetime = Field(default_factory=datetime.now)
