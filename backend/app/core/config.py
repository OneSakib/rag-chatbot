from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RAG App"
    upload_dir: str = "uploads"

    postgres_user: str = "myuser"
    postgres_password: str = "mypassword"
    postgres_db: str = "mydatabase"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
