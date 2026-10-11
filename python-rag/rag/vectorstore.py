"""Builds the FAISS vector store from knowledge documents.

Embeddings run locally via sentence-transformers (HuggingFace) —
no API key needed for this step, and it works offline after first download.
"""
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from rag.loader import load_documents

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def build_vectorstore() -> FAISS:
    documents = load_documents()
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    return FAISS.from_documents(documents, embeddings)


def get_retriever(top_k: int = 5):
    """Returns a retriever that fetches the top-k most relevant chunks."""
    vectorstore = build_vectorstore()
    return vectorstore.as_retriever(search_kwargs={"k": top_k})
