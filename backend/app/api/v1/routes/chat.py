from fastapi import APIRouter
from app.schemas.chat import AskChat, ResponseChat
from app.services.vector_store import get_vector_store
from app.services.agent import ask_chatbot

router = APIRouter(prefix="/chat", tags=["Chat"])


vector_store = get_vector_store()


@router.post("/ask")
async def ask(input: AskChat) -> ResponseChat:
    query = input.query
    response = ask_chatbot(query=query)
    return ResponseChat(response=response["answer"], sources=response["sources"])
