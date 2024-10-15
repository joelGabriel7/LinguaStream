from typing import Annotated, Optional

from sqlmodel import Session
from schemas.auth import TokenData
from core.security import get_current_user
from databases import get_session
from core.chatbot import chatbot_ai
from core.connection_manager import ConnectionManager
from fastapi import (
    APIRouter,
    Depends,
    WebSocket,
    WebSocketDisconnect,
    WebSocketException,
    status,
    Query,
)


chatbot = APIRouter()
manager = ConnectionManager()
UserDep = Annotated[Optional[TokenData], Depends(get_current_user)]
SessionDep = Annotated[Session, Depends(get_session)]


@chatbot.websocket("/ws/chatbot/")
async def chatbotTranslator(
    websocket: WebSocket, db: SessionDep, token: Optional[str] = Query(None)
):
    await manager.connect(websocket)
    try:
        #! Preguntamos si el usuario esta autenticado
        if token is None:
            raise WebSocketException(
                code=status.WS_1008_POLICY_VIOLATION, reason="Token missing"
            )
        user = await get_current_user(token=token, db=db)
        print(f"USER: {user}")
        if not user:
            raise WebSocketException(
                code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token"
            )

        while True:
            data = await websocket.receive_json()
            user_input = data["message"]
            target_language = data["target_language"]

            #! Usamos la funcion del chatbot que creamos
            translate_response = chatbot_ai(user_input, target_language)

            #! Enviamos la respuesta traducida al cliente
            await manager.send_message(translate_response, websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
