from dotenv import load_dotenv
from fastapi import FastAPI,Depends
from typing import Annotated
from databases import get_session, Session, create_db_and_tables
from api.endpoints.auth.authentication_endpoint import router as login_router
from api.endpoints.auth.users import user_router 
from api.endpoints.languages.languages import languages_router
from api.endpoints.chat.chatbot_endpoint import chatbot 

SessionDep = Annotated[Session,Depends(get_session)]

app = FastAPI(title='ChatbotTranslator Docs API')
load_dotenv()

@app.on_event("startup")
async def on_startup():
    create_db_and_tables()

    
@app.get('/')
def hello_world():
    return "Hello world"

app.include_router(login_router)
app.include_router(user_router)
app.include_router(languages_router)
app.include_router(chatbot)