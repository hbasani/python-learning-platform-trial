import asyncio
import contextlib

from fastapi import FastAPI

from app.worker import consume_forever

app = FastAPI(title="Execution Worker")
_task: asyncio.Task | None = None


@app.on_event("startup")
async def startup() -> None:
    global _task
    _task = asyncio.create_task(consume_forever())


@app.on_event("shutdown")
async def shutdown() -> None:
    global _task
    if _task:
        _task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await _task


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
