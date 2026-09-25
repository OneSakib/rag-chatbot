## Celery worker

```bash
    celery -A worker.celery_app worker --loglevel=info --pool=solo
```

## Celery worker with Flower for monitoring

```bash
    celery -A worker.celery_app flower --port=5555
```
## For migrations

```bash
    alembic revision --autogenerate -m "create documents table"
    alembic upgrade head
    alembic current          # which migration you are on
    alembic history          # list all
    alembic downgrade -1     # undo last
    alembic upgrade head     # apply all
```
