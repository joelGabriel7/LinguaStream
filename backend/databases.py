from sqlmodel import create_engine, SQLModel, Session
from dotenv import load_dotenv
import os

load_dotenv()

SQLMODEL_DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(SQLMODEL_DATABASE_URL)


def create_db_and_tables():
    from models.users import Users  # noqa: F401
    SQLModel.metadata.create_all(engine)



def get_session():
    with Session(engine) as session:
        yield session
