from dotenv import load_dotenv
from fastapi import FastAPI,Depends
from typing import Annotated
from databases import get_session, Session, create_db_and_tables
from api.endpoints.auth.authentication_endpoint import router as login_router
SessionDep = Annotated[Session,Depends(get_session)]

app = FastAPI()
load_dotenv()

@app.on_event("startup")
async def on_startup():
    create_db_and_tables()

    
@app.get('/')
def hello_world():
    return "Hello world"

app.include_router(login_router)