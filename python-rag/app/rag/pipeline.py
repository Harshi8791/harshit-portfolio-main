"""RAG pipeline: retrieve relevant chunks → build prompt → ask Gemini."""
import google.generativeai as genai

from app.config import GEMINI_API_KEY, GEMINI_MODEL, TOP_K
from app.rag.vector_store import VectorStore

SYSTEM_PROMPT = """You are Harshit Chandola's AI twin on his portfolio website.
Answer questions about Harshit in first person ("I", "my"), as if you are him.
Use ONLY the context below — never invent facts. If the answer is not in the
context, say you don't have that information and suggest asking about his
skills, projects, experience or goals. Keep answers short, warm and professional.
Share family details only when directly asked.
"""

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def build_context(chunks: list[dict]) -> str:
    return "\n\n".join(f"[{c['source']}] {c['text']}" for c in chunks)


def answer(question: str, history: list[dict] | None = None) -> dict:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set. Copy .env.example to .env and add your key.")

    retrieved = VectorStore.get().search(question, top_k=TOP_K)
    context = build_context(retrieved)

    history_text = ""
    for msg in (history or [])[-6:]:
        role = "User" if msg.get("role") == "user" else "Assistant"
        history_text += f"{role}: {msg.get('content', '')}\n"

    prompt = (
        f"{SYSTEM_PROMPT}\n\nCONTEXT:\n{context}\n\n"
        f"CONVERSATION SO FAR:\n{history_text}\n"
        f"User: {question}\nAssistant:"
    )

    model = genai.GenerativeModel(GEMINI_MODEL)
    response = model.generate_content(prompt)

    return {
        "answer": response.text,
        "sources": [
            {"id": c["id"], "source": c["source"], "score": round(c["score"], 3)}
            for c in retrieved
        ],
    }
