from fastapi import APIRouter
from app.schemas.chat import AskChat, ResponseChat
from app.services.vector_store import get_vector_store
from app.services.agent import ask_chatbot
from fastapi.responses import StreamingResponse
from uuid import uuid4
from app.db.session import Session, get_db
from fastapi import Depends
from app.models.chat_history import ChatSession, ChatMessage

router = APIRouter(prefix="/chat", tags=["Chat"])


vector_store = get_vector_store()


@router.post("/sessions")
def create_session(db: Session = Depends(get_db)):
    print("create session")
    session = ChatSession(id=str(uuid4()), title="New Conversion")
    print("Session", session)
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"id": session.id, "title": session.title}


@router.get("/sessions")
def get_sessions(db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).order_by(ChatSession.updated_at.desc()).all()
    return [
        {
            "id": session.id,
            "title": session.title,
            "created_at": session.created_at,
            "updated_at": session.updated_at,
        }
        for session in sessions
    ]


@router.get("/sessions/{session_id}/messages")
def get_session_messages(session_id: str, db: Session = Depends(get_db)):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return messages


@router.post("/ask")
async def ask(input: AskChat,db:Session=Depends(get_db)) -> StreamingResponse:
    query = input.query
    session_id = input.session_id
    return StreamingResponse(
        ask_chatbot(query=query, session_id=session_id,db=db),
        media_type="application/x-ndjson",
    )
