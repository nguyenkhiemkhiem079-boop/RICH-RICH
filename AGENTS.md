# AGENTS.md — Vietlott Lab

## Purpose
A public-ready website + data pipeline that (1) archives Vietlott draw results, (2) shows honest statistics, (3) offers a *reference* number generator and a Bao (system-bet) cost/probability calculator, (4) publishes backtests showing what strategies can and cannot do.

## Core honesty principle (non-negotiable)
Draws are independent random events. Past results cannot predict future draws. Never write code, copy, or UI that claims or implies prediction ability. The only defensible "edge" is reducing prize-sharing risk by avoiding popular number patterns, and it must be labelled as a heuristic (🟡), not a guarantee.

## Language
- Talk to the user (Jayk) in **Vietnamese**. Code, identifiers, commit messages, and agent docs in English.
- Public website copy in Vietnamese (see skill `responsible-lottery-ui`).

## Confidence markers (use in every report)
🟢 verified against an official/primary source or by test · 🟡 plausible, from secondary source or inference · 🔴 unverified/likely wrong. Cite the source URL + retrieval date for every external fact.

## Workflow rules — APPROVAL-GATED
1. Before coding any phase: produce an implementation plan and **STOP for approval**.
2. After finishing: produce a Gate Report (format in skill `qa-review-gate`) and **STOP**. Do not start the next phase until the user replies "APPROVED PHASE N".
3. Never expand scope. If you find a better idea, list it under "Suggestions", do not implement it.
4. If sources conflict or a rule is unclear, report both and ask. Never silently pick one.

## Stack (defaults; deviate only with approval)
- Pipeline: Python 3.12, `uv`, `httpx`, `pydantic`, `pytest`, `ruff`, SQLite optional. 
- Web: Next.js (static export) + TypeScript + Tailwind, `vitest`. Charts: lightweight (Recharts or uPlot).
- CI/CD: GitHub Actions. Hosting: Cloudflare Pages or Vercel (ask user in Phase 7).
- Combinatorics are implemented in BOTH Python and TypeScript and must pass the SAME fixtures in `tests/fixtures/combinatorics.json`.

## Repo layout
```
/.agent/skills/            project skills
/AGENTS.md
/pipeline/                 crawl, validate, stats, backtest (Python)
/data/{raw,staging,curated,derived}/
/web/                      static site
/tests/fixtures/           shared test vectors
/docs/{research,methodology}/
/.github/workflows/
```

## Hard prohibitions
- No scraping beyond robots.txt/ToS; min 2 s between requests; identify with a clear User-Agent; cache raw responses.
- No selling/linking to ticket purchase, no affiliate links, no claim of affiliation with Vietlott.
- No secrets in the repo. No third-party code copied without checking its license (record in `docs/research/03_repo_audit.md`).
- No live-network calls in unit tests.
- Do not install large third-party skill libraries; only skills the user approves.
