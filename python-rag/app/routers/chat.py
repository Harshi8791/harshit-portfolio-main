"""Chat endpoint — the website (or any client) posts a question here."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.rag.pipeline import answer

router = APIRouter(prefix="/api", tags=["chat"])


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    question: str
    history: list[Message] = []


@router.post("/chat")
def chat(req: ChatRequest):
    try:
        return answer(req.question, [m.model_dump() for m in req.history])
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health():
    return {"status": "ok"}
