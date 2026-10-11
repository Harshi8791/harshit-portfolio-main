"""The RAG pipeline: question → retrieve relevant chunks → Gemini answers.

Built with LangChain's LCEL (LangChain Expression Language):
    retriever → format context → prompt → LLM → parse output
"""
from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI

from rag.prompt import format_context, prompt_template
from rag.vectorstore import get_retriever

load_dotenv()

LLM_MODEL = "gemini-2.0-flash"


def build_chain():
    """Assembles the full RAG chain."""
    retriever = get_retriever(top_k=5)
    llm = ChatGoogleGenerativeAI(model=LLM_MODEL, temperature=0.3)

    chain = (
        {
            "context": retriever | format_context,
            "question": RunnablePassthrough(),
        }
        | prompt_template
        | llm
        | StrOutputParser()
    )
    return chain, retriever


def ask(question: str) -> dict:
    """Ask a question; returns the answer plus the chunks that were used."""
    chain, retriever = build_chain()
    answer = chain.invoke(question)
    sources = [
        {"id": doc.metadata["id"], "source": doc.metadata["source"]}
        for doc in retriever.invoke(question)
    ]
    return {"answer": answer, "sources": sources}
