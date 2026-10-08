# PHASE 5 — Pre-registered backtests

## Role
Implementation agent. Skill: `lottery-stats-integrity` (strictly). Plan first, STOP for approval.

## Goal
Test honestly whether any strategy beats random choice, and publish the result whatever it is.

## Tasks
1. **Pre-registration**: create `pipeline/backtest/strategies.yaml` listing strategies and ALL parameters (random, frequency-weighted windows 50/100/all, gap-weighted, low-popularity, filters). Commit it and record the git hash in every report BEFORE running anything. No parameter changes after results are seen; new ideas go to a separate file labelled "exploratory".
2. **Walk-forward evaluation**: for each draw t, generate sets using only draws < t. Metrics: distribution of matches (0..k), rate of ≥ 3 matches, and net return per ticket using real historical prize values and ticket price (Phase 2 prize data).
3. **Baseline**: Monte Carlo random strategy ≥ 10,000 runs per game, fixed seed. Report mean, 95% CI, and a permutation/bootstrap p-value for each strategy vs baseline, with Holm correction across strategies.
4. **Optional hypothesis (🟡)**: using winners-per-tier data, test whether "popular" patterns (all ≤ 31, long runs) associate with more co-winners. Report as exploratory with its limits.
5. Outputs: `data/derived/backtest_<game>.json`, `docs/methodology/backtest_<game>.md` (Vietnamese summary + English technical detail), and a plain conclusion block:
   "Kết luận: [không có bằng chứng chiến lược nào vượt ngẫu nhiên] / [phát hiện ... p=..., sau hiệu chỉnh]".

## Acceptance criteria
- Strategies file hash predates results; reviewer can rerun and reproduce numbers exactly.
- No look-ahead leakage (add an explicit test that shuffles future draws and confirms outputs for draw t do not change).
- Conclusions use cautious language; small-sample games flagged.

## Gate
Gate Report, then STOP: `⏸ DỪNG — chờ "APPROVED PHASE 5"`.
