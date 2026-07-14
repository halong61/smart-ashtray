from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    server_ip: str = "localhost"
    mqtt_host: str = "mosquitto"
    mqtt_port: int = 1883
    database_url: str = "postgresql+asyncpg://ashtray_user:ashtray_password@timescaledb:5432/ashtray_db"
    jwt_secret_key: str = "dev-secret-key"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    gmail_address: str = "example@gmail.com"
    gmail_app_password: str = "replace-me"
    frontend_url: str = "http://localhost"

    class Config:
        env_file = ".env"


settings = Settings()
