from fastapi import status


class CustomWebSocketError(Exception):
    def __init__(self, code: int, reason: str):
        self.code = code
        self.reason = reason
        super().__init__(self.reason)


class TokenMissingError(CustomWebSocketError):
    def __init__(self):
        super().__init__(code=status.WS_1008_POLICY_VIOLATION, reason="Token missing")


class TokenExpiredError(CustomWebSocketError):
    def __init__(self):
        super().__init__(code=status.WS_1008_POLICY_VIOLATION, reason="Token expired")


class InvalidTokenError(CustomWebSocketError):
    def __init__(self):
        super().__init__(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token")
