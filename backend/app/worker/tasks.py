from .celery_app import celery_app

import time


@celery_app.task(bind=True)
def process_document(self, file_path: str):
    try:
        print(f"File is processing: {file_path}")
        time.sleep(10)
        self.update_state(state="PROGRESS", meta={"progress": 50})
        time.sleep(5)
        return {"status": "completed", "file": file_path, "pages": 42}
    except Exception as e:
        self.update_state(state="FAILURE", meta={"error": str(e)})
