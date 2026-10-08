---
name: lottery-stats-integrity
description: Statistical integrity rules for lottery frequency analysis, randomness tests, generators and backtests. Use for any statistics, strategy, backtest or reporting of "patterns".
---
# Lottery statistics integrity

1. **Null hypothesis first**: draws are uniform and independent. Findings are reported as "no evidence against randomness" or "evidence against, p=…, after correction".
2. **Always show sample size and date range** next to any statistic. Lotto 5/35 has only ~15 months of data; never compare it to Mega as equal-strength evidence.
3. **Multiple comparisons**: when testing many numbers/patterns, apply Holm or Bonferroni correction and say so.
4. **Core tests**: chi-square goodness of fit (per number, per position), runs test on parity/high-low, gap distribution vs geometric, sum distribution vs simulated.
5. **Backtests**: walk-forward only (never train on future). Pre-register strategies and parameters in a committed config BEFORE running. Compare to a Monte Carlo random baseline (>= 10,000 runs, fixed seed). Report mean, 95% CI, and p-value. Include real prize values and ticket cost for return-on-ticket.
6. **No p-hacking**: do not tune parameters after seeing results. Any exploratory result is labelled "exploratory".
7. **Exact probabilities** via hypergeometric/combinatorics, verified against shared fixtures (Python and TypeScript must agree).
8. **Language**: never "predict", "likely to appear next", "hot numbers will…". Use "historically most frequent", "reference set".
9. Pari-mutuel jackpots: expected value depends on jackpot size and number of co-winners; model it, don't ignore it.
