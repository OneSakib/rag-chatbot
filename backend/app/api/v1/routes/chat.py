from fastapi import APIRouter
from app.schemas.chat import AskChat, ResponseChat
from app.services.vector_store import get_vector_store

router = APIRouter(prefix="/chat", tags=["Chat"])


vector_store = get_vector_store()


@router.post("/ask")
async def ask(input: AskChat) -> ResponseChat:
    print("INput:", input, vector_store.similarity_search(input.query, k=5))
    return ResponseChat(response="working fine")
