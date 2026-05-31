import asyncio
import json
import subprocess
import tempfile
from pathlib import Path

from redis.asyncio import Redis

from app.config import settings

redis = Redis.from_url(settings.redis_url, decode_responses=True)
QUEUE_KEY = "execution:jobs"


def execute_python(code: str, stdin: str) -> dict:
    if len(code) > settings.execution_max_chars:
        return {"stdout": "", "stderr": "Code exceeds max length", "exit_code": 1}

    blocked_tokens = ["import os", "import subprocess", "__import__", "open(", "socket", "ctypes"]
    lower_code = code.lower()
    if any(token in lower_code for token in blocked_tokens):
        return {"stdout": "", "stderr": "Blocked by safety policy", "exit_code": 1}

    with tempfile.TemporaryDirectory() as tmpdir:
        script = Path(tmpdir) / "main.py"
        script.write_text(code, encoding="utf-8")
        proc = subprocess.run(
            ["python", "-I", "-S", str(script)],
            input=stdin,
            text=True,
            capture_output=True,
            timeout=settings.execution_timeout_seconds
        )
        return {"stdout": proc.stdout, "stderr": proc.stderr, "exit_code": proc.returncode}


async def consume_forever() -> None:
    while True:
        _, raw = await redis.brpop(QUEUE_KEY, timeout=0)
        payload = json.loads(raw)
        job_id = payload["job_id"]
        await redis.set(f"execution:status:{job_id}", "running", ex=300)
        try:
            result = execute_python(payload["code"], payload.get("stdin", ""))
            await redis.set(f"execution:result:{job_id}", json.dumps(result), ex=300)
            await redis.set(f"execution:status:{job_id}", "completed", ex=300)
        except Exception as exc:
            await redis.set(f"execution:status:{job_id}", "failed", ex=300)
            await redis.set(
                f"execution:result:{job_id}",
                json.dumps({"stdout": "", "stderr": str(exc), "exit_code": 1}),
                ex=300
            )
        await asyncio.sleep(0)

