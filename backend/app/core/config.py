from functools import lru_cache
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "rag-chatbot"
    environment: str = "local"
    api_v1_prefix: str = "/api/v1"
    postgres_user: str = ""
    postgres_password: str = ""
    postgres_db: str = ""
    secret_key: str = "change-this-secret-before-production"
    access_token_expire_minutes: int = 30
    cors_origins: list[str] | Any = [
        "http://localhost:3000",
        "http://localhost:8000",
    ]
    allowed_hosts: list[str] = ["*"]
    log_level: str = "INFO"
    upload_dir: str = "uploads"
    openai_api_key:str=""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_ignore_empty=True,
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: Any) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
