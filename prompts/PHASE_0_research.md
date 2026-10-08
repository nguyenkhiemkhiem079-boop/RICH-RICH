# PHASE 0 — Research & source audit (NO production code)

## Role
You are the implementation agent for "Vietlott Lab". Read `AGENTS.md` (if it does not exist yet, ask the user to place the kit first) and the skills in `.agent/skills/`. Work in Planning mode: write a short plan, STOP for approval, then execute.

## Goal
Produce verified knowledge so later phases never guess. Output is documentation only.

## Tasks
1. **Game rules** — for each of Mega 6/45, Power 6/55, Lotto 5/35, Max 3D, Max 3D Pro, Keno, Bingo18, from vietlott.vn (primary): how to play, number ranges, ticket price, draw days/times, full prize table (tier, match rule, value), jackpot mechanics (rollover, Jackpot 2 for Power, Lotto 5/35 prize-sharing rule), official Bao (system bet) rules and how many tickets each Bao equals, launch date, first draw id, latest draw id.
2. **Official data access** — locate the public result pages/endpoints per game, pagination, parameters, response format. Read robots.txt and Terms of Use; quote the relevant clauses (≤ 15 words each) and state whether automated access is permitted. Recommend a safe request rate.
3. **Repo audit** — for each: `vietvudanh/vietlott-data`, `leoodz/vn-vietlott`, `nhannguyenhcm95/vietlott-power655`, `imacat1310/vietlott-numbers`, `beuvivu/VLM`, `LuongTanDat/VietlotFast`, `Thienlee86/XS-Vietlott-Project`: license, last commit, data coverage, code quality, whether reusable (code vs data cross-check only), security red flags (do NOT run their code).
4. **Risks** — legal/ToS, data availability, game-rule changes, scope risks.

## Deliverables (Markdown in `docs/research/`)
`01_sources.md`, `02_game_rules.md`, `03_repo_audit.md`, `04_risks.md`.
Every fact: URL + retrieval date + 🟢🟡🔴. Conflicts between sources are listed side by side, never resolved silently.

## Acceptance criteria
- All 7 games covered with prize tables or an explicit "not found + where I looked".
- robots/ToS conclusion stated with evidence.
- Each of the 7 repos has a license + reuse verdict.
- No crawler or application code written.

## Gate
Finish with the Gate Report (skill `qa-review-gate`) and STOP: `⏸ DỪNG — chờ "APPROVED PHASE 0"`.
