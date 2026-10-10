# AI twin (RAG chatbot)

```text
ai/
  providers/model.server.ts   Chat model selection (Gemini key -> Lovable AI fallback)
  knowledge/chunks.ts         Knowledge base: resume + personal background, one fact group per chunk
  retrieval/bm25.server.ts    Tokenizer + BM25 search that picks the top chunks for a question
  context/resume-context.ts   Live portfolio content -> text (client) -> chunks (server)
  prompts/system-prompt.ts    System prompt built from retrieved chunks
```

Flow: question -> retrieval (knowledge + live portfolio) -> prompt -> model -> streamed answer (`src/routes/api/chat.ts`).
To add knowledge, append a chunk to `knowledge/chunks.ts`.
