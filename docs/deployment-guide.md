# Deployment Guide

## Runtime
- Frontend container (Next.js)
- Backend container (FastAPI/Uvicorn)
- Managed PostgreSQL
- Managed Redis

## Production Pattern
1. Build immutable images.
2. Push to registry.
3. Run DB migrations.
4. Deploy backend with rolling updates.
5. Deploy frontend and switch traffic.

## Security
- Store OAuth and OpenAI keys in secret manager.
- Enforce HTTPS.
- Add API rate limiting and abuse monitoring.
- Restrict challenge execution with sandboxing.

## Observability
- Structured logs (JSON)
- Metrics: latency, error rate, token usage, challenge run success
- Traces across frontend->backend->AI calls

