from typing import Any


class RagService:
    async def retrieve(self, query: str) -> list[dict[str, Any]]:
        return [
            {"source": "python-track-docs", "chunk": "Use list comprehensions for concise transforms."},
            {"source": "style-guide", "chunk": "Write pure functions when possible for easier testing."}
        ]


rag_service = RagService()

