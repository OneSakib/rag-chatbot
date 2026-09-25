from pathlib import Path
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
)


def load_document(file_path: str):
    path = Path(file_path)

    suffix = path.suffix.lower()
    if suffix == ".pdf":
        loader = PyPDFLoader(str(path))
        return loader.load()
    if suffix in {".txt", ".md"}:
        loader = TextLoader(str(path), encoding="utf-8")
        return loader.load()
    raise ValueError(f"Unsupported file type: {suffix}")
