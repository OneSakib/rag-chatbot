from fastapi import FastAPI
from core.config import settings
from api.v1.ingestion import router as ingestion_router

app = FastAPI(name=settings.app_name)


@app.get("/")
def root():
    return {"ok": True}


@app.get("/health")
def health():
    return {"ok": True}


app.include_router(ingestion_router, prefix="/v1")
