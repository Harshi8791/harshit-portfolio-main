# Python + LangChain RAG Pipeline — Harshit AI Twin

A clean RAG (Retrieval-Augmented Generation) pipeline that answers questions
about Harshit using his resume and personal background as the knowledge base.
This is the Python/LangChain implementation of the AI twin's brain — the live
portfolio frontend runs on Lovable and uses its own built-in version.

## How the pipeline works

```
question → embed → FAISS similarity search → top-5 chunks
        → injected into prompt → Gemini → first-person answer
```

## Structure

```
python-rag/
├── main.py              # terminal demo — ask questions, see answers + sources
├── rag/
│   ├── loader.py        # knowledge.json → LangChain Documents
│   ├── vectorstore.py   # HuggingFace embeddings + FAISS vector store
│   ├── prompt.py        # system prompt + context formatting
│   └── pipeline.py      # LCEL chain: retrieve → prompt → Gemini → answer
├── data/knowledge.json  # all resume + personal facts (edit to add knowledge)
├── requirements.txt
└── .env.example
```

## Run it

```bash
cd python-rag
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # add your GOOGLE_API_KEY
python main.py "What are Harshit's strengths?"
```

Or interactive mode:

```bash
python main.py
```

Every answer also prints which knowledge chunks were retrieved, so the
retrieval step is visible — great for demos and interviews.

## Adding knowledge

Edit `data/knowledge.json` — one object per fact group (`id`, `source`,
`text`). The vector store rebuilds on the next run.
