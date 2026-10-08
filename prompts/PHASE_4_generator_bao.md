# PHASE 4 — Combinatorics, reference-set generator, Bao calculator

## Role
Implementation agent. Skills: `lottery-stats-integrity`, `responsible-lottery-ui`. Plan first, STOP for approval.

## Goal
Pure, well-tested libraries (Python + TypeScript, identical results) for probabilities, generators and Bao cost/odds. UI comes in Phase 6.

## Tasks
1. **Combinatorics lib**: exact integer math (BigInt in TS). Per game and prize tier from the approved Phase 0 prize table: hypergeometric probability, 1-in-N, matching Python and TS via shared fixtures (extend `tests/fixtures/combinatorics.json` with hand-verified cases).
2. **Generators** (seeded RNG, reproducible): 
   - `random` (baseline), 
   - `low-popularity` (avoid all-≤31 sets, long consecutive runs, arithmetic progressions, extreme sums) — label 🟡 heuristic: aims to reduce prize-sharing, does NOT raise win probability, 
   - `frequency-weighted` and `gap-weighted` — labelled "historical reference, no predictive value",
   - optional filters: sum range, odd/even, low/high, max consecutive.
   Output: sorted unique sets valid for the game, plus the true probability line.
3. **Bao calculator** following OFFICIAL rules approved in Phase 0: tickets = C(n,k) (or the official equivalent), total cost, jackpot probability, probability of each lower tier, expected value using a user-entered jackpot (default: latest from data) — show EV is typically negative. Pari-mutuel sharing modelled as a simple adjustable "expected co-winners" input, clearly labelled.
4. Tests: property tests (validity, uniqueness, range, determinism by seed), fixtures parity Python↔TS, Bao ticket counts against official examples.

## Acceptance criteria
- Python and TS produce identical numbers on all shared fixtures.
- No generator output wording implies prediction.
- Reviewer-verifiable examples: C(45,6)=8,145,060; Bao 7 = 7 tickets; Bao 18 (Mega) = 18,564 tickets (verify against official Bao rules).

## Gate
Gate Report, then STOP: `⏸ DỪNG — chờ "APPROVED PHASE 4"`.
