from dotenv import load_dotenv
from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from databases import get_session, Session, create_db_and_tables
from api.endpoints.auth.authentication_endpoint import router as login_router
from api.endpoints.auth.users import user_router 
from api.endpoints.languages.languages import languages_router
from api.endpoints.chat.chatbot_endpoint import chatbot 
import os

SessionDep = Annotated[Session,Depends(get_session)]

app = FastAPI(title='LinguaStream Docs API')
load_dotenv()

@app.on_event("startup")
async def on_startup():
    create_db_and_tables()

    
@app.get('/')
def hello_world():
    return "Hello world"
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv('FRONTEND_URL'),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(login_router)
app.include_router(user_router)
app.include_router(languages_router)
app.include_router(chatbot)