# Production Hardening Checklist

## Completed in this scaffold
- JWT-based email auth with password hashing.
- Database-backed user registration/login.
- Redis-backed leaderboard caching.
- Config-driven runtime limits for code execution.
- Basic execution safety policy and isolated interpreter flags.

## Required before launch
- Replace startup `create_all` with Alembic migrations.
- Implement full OAuth code exchange for Google and GitHub.
- Move challenge execution to isolated containers/microVMs.
- Add per-user rate limiting and abuse detection.
- Add CSRF/session protections for web auth flows.
- Add centralized logs, tracing, and metrics dashboards.
- Add secrets manager integration for all credentials.

## AI safety
- Prompt injection filtering for RAG sources.
- Audit logging for tutor/reviewer responses.
- Offline eval suite for hallucination and policy compliance.

