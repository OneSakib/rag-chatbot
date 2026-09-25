from fastapi import APIRouter

from app.api.v1.routes import health, ingestion, chat

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(ingestion.router, tags=["Ingestion"])
api_router.include_router(chat.router, tags=["Chat"])
