from datetime import datetime
from typing import Annotated, Optional
from sqlmodel import Session, select
from models.users import Users
from models.chat_history import ChatHistory
from core.security import get_current_user
from databases import get_session
from core.chatbot import chatbot_ai
from core.connection_manager import ConnectionManager
from api.deps.helpers.customs_errors import (
    CustomWebSocketError,
    InvalidTokenError,
    TokenExpiredError,
    TokenMissingError,
)
from fastapi import (
    APIRouter,
    Depends,
    WebSocket,
    WebSocketDisconnect,
    status,
    Query,
)


chatbot = APIRouter()
manager = ConnectionManager()
UserDep = Annotated[Users, Depends(get_current_user)]
SessionDep = Annotated[Session, Depends(get_session)]


@chatbot.websocket("/ws/chatbot/")
async def chatbotTranslator(
    websocket: WebSocket,
    db: SessionDep,
    token: Optional[str] = Query(None),
):
    await manager.connect(websocket)
    try:
        #! Preguntamos si el usuario esta autenticado
        if token is None:
            raise TokenMissingError()
        try:
            user = await get_current_user(token=token, db=db)
        except CustomWebSocketError as e:
            await manager.send_message(e.reason, websocket)
            await websocket.close(e.code)
            return
        except TokenExpiredError:
            await manager.send_message("Token has expired", websocket)
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        except InvalidTokenError:
            await manager.send_message("Invalid token", websocket)
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        except Exception as e:
            await manager.send_message(f"Unexpected error: {str(e)}", websocket)
            await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
            return

        while True:
            data = await websocket.receive_json()
            user_input = data["message"]
            target_language = data["target_language"]

            #! Usamos la funcion del chatbot que creamos
            translate_response = chatbot_ai(user_input, target_language)
            #! Guardamos los mensajes del chat para tener el history
            chat_history = ChatHistory(
                user_id=user.id,
                message=user_input,
                timestamp=datetime.now(),
                bot_response=translate_response,
            )
            db.add(chat_history)
            db.commit()
            #! Enviamos la respuesta traducida al cliente
            await manager.send_message(translate_response, websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)


@chatbot.get("/chat/history/", status_code=status.HTTP_200_OK)
async def get_chat_history(current_user: UserDep, db: SessionDep):
    query = (
        select(ChatHistory)
        .where(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.timestamp)
    )
    messages = db.exec(query).all()
    return messages
