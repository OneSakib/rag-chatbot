from fastapi import APIRouter
from app.schemas.chat import AskChat, ResponseChat

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/ask")
async def ask(input: AskChat) -> ResponseChat:
    print("INput:", input)
    return ResponseChat(response="working fine")
