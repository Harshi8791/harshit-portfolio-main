"""In-memory vector store: loads knowledge chunks, embeds them, cosine search."""
import json

import numpy as np

from app.config import KNOWLEDGE_PATH
from app.rag.embeddings import Embedder


class VectorStore:
    _instance: "VectorStore | None" = None

    def __init__(self) -> None:
        with open(KNOWLEDGE_PATH, encoding="utf-8") as f:
            self.chunks: list[dict] = json.load(f)
        embeddings = Embedder.get().encode([c["text"] for c in self.chunks])
        self.matrix = np.asarray(embeddings, dtype=np.float32)

    @classmethod
    def get(cls) -> "VectorStore":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        q = np.asarray(Embedder.get().encode([query]), dtype=np.float32)[0]
        scores = self.matrix @ q  # vectors are normalized → dot = cosine
        top = np.argsort(scores)[::-1][:top_k]
        return [
            {**self.chunks[i], "score": float(scores[i])}
            for i in top
        ]
