## Celery worker

```bash
    celery -A worker.celery_app worker --loglevel=info --pool=solo
```

## Celery worker with Flower for monitoring

```bash
    celery -A worker.celery_app flower --port=5555
```
