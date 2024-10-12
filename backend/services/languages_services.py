from sqlmodel import select
from databases import get_session, Session
from models.languages_available import Languages
from fastapi import Depends, HTTPException, status
from typing import Annotated
from google.cloud import translate_v2 as translate

SessionDep = Annotated[Session, Depends(get_session)]


async def sync_languages_with_google_translate(db: SessionDep):
    translate_client = translate.Client()
    results = translate_client.get_languages()
    for lang in results:
        languages = Languages(language_code=lang["language"], name=lang["name"])
        current_languages =  db.exec(
            (select(Languages).where(Languages.language_code == lang["language"]))
        )
        if not current_languages.first():
            db.add(languages)
    db.commit()


async def get_all_languages(db:SessionDep):
    languages = db.exec(select(Languages)).all()
    if not languages:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not languages founds")
    return languages
 