import secrets
from datetime import datetime, timedelta


class AuthService:
    @staticmethod
    def create_code() -> str:
        return f"{secrets.randbelow(900000) + 100000:06d}"

    @staticmethod
    def create_verify_token(email: str) -> str:
        return f"verify:{email}:{datetime.utcnow().timestamp()}"
