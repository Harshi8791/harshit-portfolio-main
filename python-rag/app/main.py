"""FastAPI entrypoint — run with: uvicorn app.main:app --reload --port 8000"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.chat import router as chat_router

app = FastAPI(title="Harshit AI Twin — Python RAG service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your site URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
