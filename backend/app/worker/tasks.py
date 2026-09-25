from app.models.ingestion import Document
from app.db.session import SessionLocal
from .celery_app import celery_app
import time


@celery_app.task(bind=True)
def process_document(self, file_path: str, doc_id: str):
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return
        doc.status = "processing"
        db.commit()
        print(f"File is processing: {file_path}")
        time.sleep(10)
        self.update_state(state="PROGRESS", meta={"progress": 50})
        doc.status = "processing"
        db.commit()
        time.sleep(5)
        doc.status = "completed"
        db.commit()
        return {"status": "completed", "file": file_path, "pages": 42}
    except Exception as e:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if doc:
            doc.status = "failed"
            db.commit()
        self.update_state(state="FAILURE", meta={"error": str(e)})
    finally:
        db.close()
