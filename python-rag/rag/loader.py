"""Loads knowledge chunks from data/knowledge.json into LangChain Documents."""
import json
from pathlib import Path

from langchain_core.documents import Document

KNOWLEDGE_PATH = Path(__file__).parent.parent / "data" / "knowledge.json"


def load_documents() -> list[Document]:
    """Each knowledge chunk becomes one Document with source metadata."""
    with open(KNOWLEDGE_PATH, encoding="utf-8") as f:
        chunks = json.load(f)

    return [
        Document(
            page_content=chunk["text"],
            metadata={"id": chunk["id"], "source": chunk["source"]},
        )
        for chunk in chunks
    ]
