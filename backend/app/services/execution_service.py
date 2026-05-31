import subprocess
import tempfile
from pathlib import Path

from app.core.config import settings


class ExecutionService:
    def run_python(self, code: str, stdin: str = "") -> dict:
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
            return {
                "stdout": proc.stdout,
                "stderr": proc.stderr,
                "exit_code": proc.returncode
            }


execution_service = ExecutionService()
