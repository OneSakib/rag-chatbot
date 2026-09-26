from app.models.document import Document
from app.db.session import SessionLocal
from .celery_app import celery_app
import time
from uuid import uuid4
from app.services.document_loader import load_document
from app.services.vector_store import get_vector_store
from app.services.chunker import text_splitter


@celery_app.task(bind=True)
def process_document(
    self,
    file_path: str,
    doc_id: str,
    file_type: str,
):
    db = SessionLocal()
    try:
        self.update_state(state="PROGRESS", meta={"progress": 10})
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return
        if file_type == "application/pdf":
            documents = load_document(file_path)
        else:
            return {"error": f"Unsupported file type: {file_type}"}
        print("documents:", len(documents))
        doc.status = "processing"
        db.commit()
        self.update_state(state="PROGRESS", meta={"progress": 20})

        chunks = text_splitter.split_documents(documents)
        print("Chunks:", len(chunks))
        for index, chunk in enumerate(chunks):
            chunk.metadata.update(
                {
                    "document_id": doc_id,
                    "chunk_index": index,
                }
            )
        self.update_state(state="PROGRESS", meta={"progress": 50})
        doc.status = "processing"
        db.commit()
        print("CHUNKS:", len(chunks), flush=True)
        uuids = [str(uuid4()) for _ in chunks]
        print("Before vector_store.add_documents()", flush=True)
        vector_store = get_vector_store()
        vector_store.add_documents(documents=chunks, ids=uuids)
        print("After vector_store.add_documents()", flush=True)
        self.update_state(state="PROGRESS", meta={"progress": 80})
        doc.status = "completed"
        db.commit()
        self.update_state(state="PROGRESS", meta={"progress": 100})
        return {
            "status": "completed",
            "file": file_path,
            "chunks": len(chunks),
        }
    except Exception as e:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if doc:
            doc.status = "failed"
            db.commit()
        self.update_state(state="FAILURE", meta={"error": str(e)})
    finally:
        db.close()
