from openai import AsyncOpenAI

from app.core.config import settings
from app.services.rag_service import rag_service


class AIService:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

    async def tutor(self, question: str, context: str = "") -> str:
        docs = await rag_service.retrieve(question)
        grounding = "\n".join(item["chunk"] for item in docs)
        if not self.client:
            return f"[Mock Tutor] Context: {grounding}\nAnswer: Start by breaking the problem into tiny testable steps."

        resp = await self.client.responses.create(
            model="gpt-4.1-mini",
            input=f"You are a Python tutor. Context:\n{grounding}\nExtra:{context}\nQuestion:{question}"
        )
        return resp.output_text

    async def review_code(self, code: str, rubric: str) -> str:
        if not self.client:
            return "[Mock Review] Solid attempt. Add input validation, type hints, and unit tests."
        resp = await self.client.responses.create(
            model="gpt-4.1-mini",
            input=f"Review this Python code with rubric: {rubric}\nCode:\n{code}"
        )
        return resp.output_text


ai_service = AIService()

