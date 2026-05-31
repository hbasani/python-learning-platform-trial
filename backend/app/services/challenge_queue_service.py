import asyncio
import json
import uuid
from time import time

from app.core.config import settings
from app.db.redis_client import redis


class ChallengeQueueService:
    queue_key = "execution:jobs"

    async def submit(self, code: str, stdin: str) -> str:
        job_id = str(uuid.uuid4())
        payload = {"job_id": job_id, "code": code, "stdin": stdin, "created_at": time()}
        await redis.set(f"execution:status:{job_id}", "queued", ex=300)
        await redis.lpush(self.queue_key, json.dumps(payload))
        return job_id

    async def get_status(self, job_id: str) -> dict:
        status = await redis.get(f"execution:status:{job_id}")
        result_raw = await redis.get(f"execution:result:{job_id}")
        result = json.loads(result_raw) if result_raw else None
        return {"job_id": job_id, "status": status or "unknown", "result": result}

    async def wait_for_result(self, job_id: str) -> dict:
        deadline = time() + settings.execution_job_timeout_seconds
        while time() < deadline:
            result_raw = await redis.get(f"execution:result:{job_id}")
            if result_raw:
                await redis.set(f"execution:status:{job_id}", "completed", ex=300)
                return json.loads(result_raw)
            status = await redis.get(f"execution:status:{job_id}")
            if status == "failed":
                break
            await asyncio.sleep(0.2)
        return {"stdout": "", "stderr": "Execution timed out", "exit_code": 124}


challenge_queue_service = ChallengeQueueService()

