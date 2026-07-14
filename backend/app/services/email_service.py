from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.gmail_address,
    MAIL_PASSWORD=settings.gmail_app_password,
    MAIL_FROM=settings.gmail_address,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    TEMPLATE_FOLDER=None,
)

fm = FastMail(conf)


async def send_code_email(email: str, code: str) -> None:
    message = MessageSchema(
        subject=f"[스마트 애쉬트레이] 이메일 인증코드: {code}",
        recipients=[email],
        body=f"인증 코드: {code}",
        subtype="plain",
    )
    await fm.send_message(message)
