from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(payload: LoginRequest):
    if not payload.email or not payload.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이메일과 비밀번호를 입력해주세요.")

    return {
        "access_token": "demo-token",
        "token_type": "bearer",
        "user": {"email": payload.email, "name": "관리자"},
    }


@router.get("/me")
def me():
    return {"message": "로그인된 사용자 정보", "user": {"email": "admin@smartashtray.local", "name": "관리자"}}
