# PHASE 1 — Project scaffold, tooling, CI

## Role
Implementation agent. Re-read `AGENTS.md` and all four skills. Plan first, STOP for approval.

## Goal
A clean, reproducible monorepo skeleton with quality gates, no business logic.

## Tasks
1. Create the layout in `AGENTS.md` (pipeline/, data/, web/, tests/fixtures/, docs/, .github/workflows/).
2. Pipeline: `pyproject.toml` with `uv`, ruff, pytest, pydantic, httpx; CLI entry `vl` with placeholder sub-commands (`crawl`, `verify`, `stats`, `backtest`) that print "not implemented".
3. Web: Next.js (static export) + TypeScript + Tailwind + vitest; one placeholder home page in Vietnamese with the required disclaimer footer (skill `responsible-lottery-ui`).
4. Shared fixtures: `tests/fixtures/combinatorics.json` with these hand-verified vectors (Python and TS tests must both load it, currently asserting only that the file parses):
   C(45,6)=8145060, C(55,6)=28989675, C(35,5)=324632, C(35,5)*12=3895584.
5. CI workflow: on PR run ruff, pytest, tsc, vitest, web build. Add `README.md` (setup + commands) and `LICENSE` placeholder (ask the user which license).
6. `docs/` stubs: METHODOLOGY.md, DATA_SOURCES.md (link to Phase 0 research).

## Acceptance criteria
- Fresh clone → documented commands → all checks green.
- No network calls, no game logic yet.
- Disclaimer text appears on the placeholder page.

## Gate
Gate Report, then STOP: `⏸ DỪNG — chờ "APPROVED PHASE 1"`.
