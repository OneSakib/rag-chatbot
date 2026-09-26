from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vector_store = Chroma(
    collection_name="test_collection",
    embedding_function=embeddings,
    persist_directory=str(BASE_DIR / "chromaa_db"),
)

docs = [
    Document(page_content="Hello world"),
    Document(page_content="This is a test document"),
]

print("BEFORE ADD", flush=True)

ids = vector_store.add_documents(docs)

print("AFTER ADD", ids, flush=True)

print(vector_store.similarity_search("hello", k=1))
