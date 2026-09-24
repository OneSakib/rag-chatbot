from fastapi import APIRouter, HTTPException, status
from fastapi import UploadFile, File
import shutil
import uuid
from core.config import settings
import os
from celery.result import AsyncResult
from worker.tasks import process_document
from worker.celery_app import celery_app

router = APIRouter(prefix="/ingestion", tags=["Ingestion"])


UPLOAD_DIR = settings.upload_dir
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_source(file: UploadFile = File("...")):
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
    task = process_document.delay(file_path)
    return {
        "task_id": task.id,
        "filename": file.filename,
        "content_type": file.content_type,
        "size": os.path.getsize(file_path),
        "path": file_path,
    }


@router.get("/task-status/{task_id}")
async def task_status(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None,
        "info": result.info if result.status == "PROGRESS" else None,
    }
