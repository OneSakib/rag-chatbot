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
    docker compose exec api alembic revision --autogenerate -m "create documents table"
    docker compose exec api alembic upgrade head
    docker compose exec api alembic current          # which migration you are on
    docker compose exec api alembic history          # list all
    docker compose exec api alembic downgrade -1     # undo last
```
