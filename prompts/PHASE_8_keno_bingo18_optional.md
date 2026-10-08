# PHASE 8 (OPTIONAL) — Keno & Bingo18: history and statistics only

## Role
Implementation agent. Start only if the user explicitly approves Phase 8. Plan first, STOP.

## Rules
- NO number generator, NO "suggestions", NO Bao-style tools for these games. These draw every few minutes with fixed-prize payouts; extra tooling encourages rapid repeated play.
- Show only: recent results, aggregated statistics (frequency over windows, parity, sum), the game's true odds and house edge computed from the official prize table, and a prominent responsible-play notice.

## Tasks
1. Verify rules, draw interval, and data access from official pages (Phase 0 method; record ToS/robots outcome).
2. Because volume is large (tens of thousands of draws per year), store raw data compressed outside git (or a release artifact) and commit only aggregated daily/weekly summaries.
3. Add two read-only pages with the notice from `responsible-lottery-ui`.

## Acceptance criteria
- Storage stays within repository size limits (report sizes).
- Odds/house-edge numbers reproducible from the official prize table.
- No generator code paths exist for these games (add a test asserting this).

## Gate
Gate Report, then STOP: `⏸ DỪNG — chờ "APPROVED PHASE 8"`.
