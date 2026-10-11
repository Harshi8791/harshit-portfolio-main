"""Embedding model wrapper — loads once, encodes text into vectors."""
from sentence_transformers import SentenceTransformer

from app.config import EMBEDDING_MODEL


class Embedder:
    _instance: "Embedder | None" = None

    def __init__(self) -> None:
        self.model = SentenceTransformer(EMBEDDING_MODEL)

    @classmethod
    def get(cls) -> "Embedder":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def encode(self, texts: list[str]):
        return self.model.encode(texts, normalize_embeddings=True)
