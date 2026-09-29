from pydantic import BaseModel, Field
from typing import Any


class AskChat(BaseModel):
    query: str
    session_id: str


class ResponseChat(BaseModel):
    response: str
    sources: Any
