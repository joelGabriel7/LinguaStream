from fastapi import HTTPException, status


class CustomWebSocketError(Exception):
    def __init__(self, code: int, reason: str):
        self.code = code
        self.reason = reason
        super().__init__(self.reason)
        
    def to_http_exception(self) -> HTTPException:
        """Convierte una excepción WebSocket en una excepción HTTP."""
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=self.reason,
            headers={"WWW-Authenticate": "Bearer"},
        )    


class TokenMissingError(CustomWebSocketError):
    def __init__(self):
        super().__init__(code=status.WS_1008_POLICY_VIOLATION, reason="Token missing")


class TokenExpiredError(CustomWebSocketError):
    def __init__(self):
        super().__init__(code=status.WS_1008_POLICY_VIOLATION, reason="Token expired")


class InvalidTokenError(CustomWebSocketError):
    def __init__(self):
        super().__init__(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token")
