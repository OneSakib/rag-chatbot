from pydantic import BaseModel, Field


class AskChat(BaseModel):
    query: str


class ResponseChat(BaseModel):
    response: str
