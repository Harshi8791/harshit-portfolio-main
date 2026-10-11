"""Demo runner — ask questions to the AI twin from the terminal.

Usage:
    python main.py "What are Harshit's strengths?"
    python main.py          # interactive mode
"""
import sys

from rag.pipeline import ask


def show(question: str) -> None:
    result = ask(question)
    print(f"\nQ: {question}")
    print(f"A: {result['answer']}")
    used = ", ".join(s["id"] for s in result["sources"])
    print(f"   (retrieved chunks: {used})\n")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        show(" ".join(sys.argv[1:]))
    else:
        print("Harshit AI Twin — type a question, or 'exit' to quit.")
        while True:
            q = input("\nYou: ").strip()
            if q.lower() in {"exit", "quit", ""}:
                break
            show(q)
