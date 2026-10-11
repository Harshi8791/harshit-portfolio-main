# Python RAG Service — Harshit AI Twin

Standalone FastAPI service that answers questions about Harshit using RAG
(embeddings + vector search + Gemini). The live website currently uses the
built-in TypeScript RAG (`src/lib/ai/`); this service is for running the same
brain in Python — locally or on any server.

## Structure

```
python-rag/
├── app/
│   ├── main.py            # FastAPI app + CORS
│   ├── config.py          # .env settings
│   ├── routers/chat.py    # POST /api/chat, GET /api/health
│   └── rag/
│       ├── embeddings.py  # sentence-transformers model (loaded once)
│       ├── vector_store.py# knowledge chunks → vectors, cosine search
│       └── pipeline.py    # retrieve → prompt → Gemini answer
├── data/knowledge.json    # all resume + personal facts (edit here)
├── requirements.txt
└── .env.example
```

## Run locally

```bash
cd python-rag
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # add your GEMINI_API_KEY
uvicorn app.main:app --reload --port 8000
```

Test:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What are Harshit'\''s strengths?"}'
```

The response includes the answer plus which knowledge chunks were used
(`sources`), so you can see the retrieval working.

## Adding knowledge

Edit `data/knowledge.json` — add one object per fact group
(`id`, `source`, `text`). Restart the server; embeddings rebuild on startup.

## Connecting the website later

Point the site's chat route (`src/routes/api/chat.ts`) at
`http://<your-server>:8000/api/chat` instead of the built-in pipeline.
