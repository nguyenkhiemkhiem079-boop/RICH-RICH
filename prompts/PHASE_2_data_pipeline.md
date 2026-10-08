# PHASE 2 — Data collection, validation, curated datasets

## Role
Implementation agent. Use skill `vietlott-data-pipeline`. Use ONLY facts approved in Phase 0 docs. Plan first, STOP for approval.

## Goal
Reliable, reproducible historical datasets for: Mega 6/45, Power 6/55, Lotto 5/35 (first), then Max 3D and Max 3D Pro.

## Tasks
1. Implement crawlers against the official source approved in Phase 0 (rate limit ≥ 2 s, backoff, resume, User-Agent). Save raw responses with manifest (url, params, retrieved_at, sha256).
2. Parse to staging CSV; validate per skill rules (contiguous ids, ranges, counts, duplicates, dates, special-number rules).
3. Build curated JSON per game with prizes (winners + value per tier) and jackpot values when available; write `dataset_manifest.json` (version, coverage, row counts, source agreement).
4. Cross-check against one community mirror approved in Phase 0; list every mismatch in `data/derived/crosscheck_<game>.md`.
5. CLI: `vl crawl <game> [--since ID]`, `vl backfill <game>`, `vl verify [<game>]`.
6. Tests: offline fixtures for each parser, validators (good + bad cases), idempotency (run twice → identical output).
7. Do games in this order and report after the first three; Max 3D/Pro only after the user confirms their schema from Phase 0.

## Acceptance criteria
- `vl verify` passes for each game; zero gaps in draw ids.
- Draw counts and first/last ids match official pages (show evidence).
- Include a table of **30 randomly sampled draws per game** (seeded) with id/date/numbers so the user can verify manually on vietlott.vn.
- Mirror agreement ≥ 99.5% or every discrepancy explained.

## Gate
Gate Report, then STOP: `⏸ DỪNG — chờ "APPROVED PHASE 2"`.
