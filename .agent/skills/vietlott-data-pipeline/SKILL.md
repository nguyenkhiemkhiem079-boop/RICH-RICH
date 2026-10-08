---
name: vietlott-data-pipeline
description: Rules for crawling, validating and storing Vietlott draw results (Mega 6/45, Power 6/55, Lotto 5/35, Max 3D, Max 3D Pro, Keno, Bingo18). Use for any task touching data collection, schemas, or data quality.
---
# Vietlott data pipeline

## Source priority
1. Official vietlott.vn result/detail pages (primary).
2. Community mirrors (cross-check only): e.g. vietvudanh/vietlott-data, leoodz/vn-vietlott, nhannguyenhcm95/vietlott-power655. Check license before reusing any code; data from mirrors is never trusted alone.

## Crawling etiquette
Respect robots.txt and ToS; >= 2 s between requests; exponential backoff; clear User-Agent; resume-able; never bypass auth or captchas. If blocked, stop and report.

## Layers (immutable raw, reproducible downstream)
- `data/raw/<source>/<run_id>/` raw responses + `manifest.jsonl` (url, params, retrieved_at, sha256).
- `data/staging/<source>/draws.csv` parsed + validated.
- `data/curated/<game>.json` one record per draw + `dataset_manifest.json` (version, coverage, row counts, source agreement %).

## Draw record (curated)
`game`, `draw_id` (int), `draw_date` (ISO, Asia/Ho_Chi_Minh), `draw_time`, `numbers` (sorted ints), `special` (nullable), `prizes` (per tier: winners, value_vnd), `jackpot_vnd` fields where applicable. Max 3D / Pro use their own schema (digit strings) — define from official rules, do not guess.

## Validation (fail the run, do not "fix" silently)
Contiguous draw ids; no duplicates; numbers within game range and correct count; no duplicate numbers within a draw; dates non-decreasing; special number rules per game; cross-source agreement >= 99.5% on overlapping draws, every mismatch listed.

## Testing
Offline fixtures only. Parsers tested against saved HTML/JSON samples. Idempotency test: running crawl twice yields identical curated output.
