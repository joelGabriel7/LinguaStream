from fastapi import Depends
from core.security import get_current_user
from databases import Session, get_session
from typing import Annotated
from schemas.auth import UserPreferences as Preferences
from models.users import UserPreferences, Users
from sqlmodel import select

SessionDep = Annotated[Session, Depends(get_session)]
UserDep = Annotated[Users, Depends(get_current_user)]


async def set_preferences_services( preferences_schemas: Preferences, current_user: UserDep, db: SessionDep):
    """
    1. Find the user if check has already save preferences
    2. if doesn't exist, created  and save
    3. if exist, updated
    4. Save preferences
    """
    #!   1. Find the user if check has already save preferences
    preferences = db.exec(
        select(UserPreferences).filter_by(user_id=current_user.id)
    ).first()

    #!  2. if doesn't exist, created  and save
    if not preferences:
        preferences = UserPreferences(
            user_id=current_user.id,
            source_language=preferences_schemas.source_languages,
            target_language=preferences_schemas.target_languages,
        )
        db.add(preferences)
    #! if exist, updated    
    else:
        preferences.source_language = preferences_schemas.source_languages
        preferences.target_language = preferences_schemas.target_languages
    #! Save preferences
    db.commit()
    return preferences
