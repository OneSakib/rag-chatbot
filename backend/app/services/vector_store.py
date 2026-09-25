from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from core.config import settings

api_key:SecretStr =settings.openai_api_key

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small", api_key=api_key
)
vector_store = Chroma(
    collection_name="documents",
    embedding_function=embeddings,
    persist_directory="/app/chroma_db",
)


def get_vector_store() -> Chroma:
    return Chroma(
        collection_name="documents",
        embedding_function=embeddings,
        persist_directory="/app/chroma_db",
    )
