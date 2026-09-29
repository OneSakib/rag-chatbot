from langchain_anthropic import ChatAnthropic
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from app.services.vector_store import get_vector_store
from app.services.retriever import retrieve_documents
from app.db.session import Session
from app.models.chat_history import ChatMessage, ChatSession
from datetime import datetime
import json

load_dotenv()


llm = ChatAnthropic(model_name="claude-sonnet-4-6", timeout=30, stop=None)


vector_store = get_vector_store()


prompt = ChatPromptTemplate.from_template("""
You are a helpful assistant.

Answer the question using ONLY the provided context.

If the answer is not present in the context,
say that you don't know.

Context:
{context}

Query:
{query}

Answer:
""")


def ask_chatbot(query: str, session_id: str, db: Session):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        yield json.dumps({"type": "error", "message": "session not found"})
        return
    chat_messages = (
        db.query(ChatMessage).filter(ChatMessage.session_id == session_id).first()
    )
    if not chat_messages:
        session.title = query[:50]
        db.commit()
    user_messasge = ChatMessage(session_id=session_id, role="user", content=query)
    db.add(user_messasge)
    db.commit()
    documents = retrieve_documents(query)
    context = "\n\n".join(document.page_content for document in documents)
    messages = prompt.format_messages(context=context, query=query)
    yield json.dumps(
        {
            "type": "sources",
            "sources": [
                {
                    "id": doc.id,
                    "metadata": doc.metadata,
                    "page_content": doc.page_content,
                    "type": "Document",
                }
                for doc in documents
            ],
        }
    ) + "\n"
    full_answer = ""

    for chunk in llm.stream(messages):
        if chunk.content:
            full_answer += str(chunk.content)
            yield json.dumps({"type": "token", "content": chunk.content}) + "\n"
    assistant_message = ChatMessage(
        session_id=session_id, role="assistant", content=full_answer
    )
    db.add(assistant_message)
    db.commit()
    session.updated_at = datetime.utcnow()
    db.commit()
    yield json.dumps({"type": "done"}) + "\n"
