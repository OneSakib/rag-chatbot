# rag-chatbot

Production-ready FastAPI project boilerplate

## Quick Start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Open:

- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/v1/health`

## Database Migrations

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

## Test

```bash
pytest
```

## Lint

```bash
ruff check .
ruff format .
```
## Type Check

```bash
mypy app tests
```
## Docker

```bash
docker compose up --build
```
