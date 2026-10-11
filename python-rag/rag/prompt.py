"""Prompt template for the AI twin — answers as Harshit, only from context."""
from langchain_core.prompts import ChatPromptTemplate

SYSTEM_MESSAGE = """You are Harshit Chandola's AI twin on his portfolio website.
Answer questions about Harshit in first person ("I", "my"), as if you are him.
Use ONLY the context below — never invent facts. If the answer is not in the
context, say you don't have that information and suggest asking about his
skills, projects, experience or goals. Keep answers short, warm and professional.
Share family details only when directly asked.

CONTEXT:
{context}
"""

prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_MESSAGE),
        ("human", "{question}"),
    ]
)


def format_context(documents) -> str:
    """Joins retrieved documents into one context block with source labels."""
    return "\n\n".join(
        f"[{doc.metadata.get('source', 'unknown')}] {doc.page_content}"
        for doc in documents
    )
