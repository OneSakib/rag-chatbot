from fastapi import APIRouter, HTTPException, status, Depends
from fastapi import UploadFile, File
import shutil
import uuid
from app.core.config import settings
import os
from celery.result import AsyncResult
from app.worker.tasks import process_document
from app.worker.celery_app import celery_app
from app.models.document import Document
from app.db.session import get_db
from sqlalchemy.sql import func
from sqlalchemy.orm import Session
from app.services.vector_store import get_vector_store

router = APIRouter(prefix="/ingestion", tags=["Ingestion"])


UPLOAD_DIR = settings.upload_dir
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_source(file: UploadFile = File("..."), db: Session = Depends(get_db)):
    allowed_types = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File type {file.content_type} not allowed",
        )
    ext = file.filename.split(".")[-1]
    safe_name = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Save to db
    doc = Document(
        file_name=file.filename,
        file_path=file_path,
        file_size=os.path.getsize(file_path),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    task = process_document.delay(file_path, doc.id, file.content_type)
    return {
        "task_id": task.id,
        "filename": file.filename,
        "content_type": file.content_type,
        "size": os.path.getsize(file_path),
        "path": file_path,
    }


@router.get("/documents/count")
def get_count(db: Session = Depends(get_db)):
    total = db.query(func.count(Document.id)).scalar()
    completed = (
        db.query(func.count(Document.id))
        .filter(Document.status == "completed")
        .scalar()
    )
    queued = (
        db.query(func.count(Document.id)).filter(Document.status == "queued").scalar()
    )
    processing = (
        db.query(func.count(Document.id))
        .filter(Document.status == "processing")
        .scalar()
    )
    return {
        "total_documents": total,
        "completed": completed,
        "queued": queued,
        "processing": processing,
    }


@router.get("/documents")
def list_docs(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.created_at.desc()).all()


@router.delete("/document/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with id {doc_id} not found",
        )

    try:
        vector_store = get_vector_store()
        db.delete(doc)
        db.commit()
        # Delete from the vector store
        vector_store._collection.delete(where={"document_id": str(doc_id)})
        if doc.file_path and os.path.exists(doc.file_path):
            os.remove(doc.file_path)
        return {
            "message": "Document and vectors deleted successfully",
            "doc_id": doc_id,
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {str(e)}",
        )


@router.get("/task-status/{task_id}")
async def task_status(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None,
        "info": result.info if result.status == "PROGRESS" else None,
    }
