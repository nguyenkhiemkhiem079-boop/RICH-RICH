# PHASE 3 — Statistics & randomness tests

## Role
Implementation agent. Use skill `lottery-stats-integrity`. Plan first, STOP for approval.

## Goal
Reproducible, honest statistics per game, exported as JSON for the website.

## Tasks
1. Per game (Mega, Power, Lotto 5/35; Max 3D/Pro digit-based equivalents): frequency (all-time, last 10/50/100 draws), current gap (draws since last seen), average and max gap, odd/even split, low/high split, sum distribution, pair frequency (top N), consecutive-number rate, decade distribution.
2. Randomness tests with Holm correction: chi-square per number, runs test, gap-vs-geometric test, sum vs Monte Carlo (seeded).
3. Every output includes: n draws, date range, seed, software versions, dataset version.
4. Export to `data/derived/stats_<game>.json` + `docs/methodology/stats_<game>.md` with plain-Vietnamese interpretation (no prediction language).
5. Tests: synthetic uniform data should NOT reject randomness at α=0.05 in the large majority of seeded trials; synthetic biased data SHOULD be detected; hand-computed small cases match.

## Acceptance criteria
- Reviewer can reproduce any 3 numbers by hand/independent script (include scripts).
- Lotto 5/35 outputs carry a visible "small sample" flag.
- `vl stats <game>` deterministic across runs.

## Gate
Gate Report, then STOP: `⏸ DỪNG — chờ "APPROVED PHASE 3"`.
