from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: int
    email: str


class LoginSchema(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    email: str
    name: str
    password: str  
    
class UserResponse(BaseModel):
    id: int
    email: str
    name: str

    class Config:
        from_attributes = True