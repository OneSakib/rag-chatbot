from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings


def get_vector_store():
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small"
    )

    return Chroma(
        collection_name="documents",
        embedding_function=embeddings,
        persist_directory="/app/chroma_db",
    )