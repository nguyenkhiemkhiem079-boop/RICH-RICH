# PHASE 6 — Website (Vietnamese, static)

## Role
Implementation agent. Skills: `responsible-lottery-ui` (binding), `frontend-design` (visual quality only), `lottery-stats-integrity`. Plan with page list + wireframe descriptions first, STOP for approval.

## Goal
A fast, accessible, mobile-first static site that reads `data/curated` and `data/derived` at build time.

## Pages
1. **Trang chủ**: latest results of each game, current jackpots, next draw time, short honesty statement.
2. **Trang từng game** (Mega, Power, Lotto 5/35, Max 3D, Max 3D Pro): history table with search by date/draw id, statistics charts from Phase 3 (with n + date range shown).
3. **Bộ số tham khảo**: client-side generator from Phase 4 libs, filters, seed shown, true probability line, disclaimer.
4. **Máy tính Bao**: ticket count, cost, odds, EV with editable jackpot.
5. **Backtest**: results from Phase 5 including the null result if that is the finding.
6. **Kiến thức**: independence, gambler's fallacy, how odds work, why "hot/cold" numbers do not predict, pari-mutuel sharing.
7. **Nguồn dữ liệu & phương pháp**: sources, update schedule, dataset version, limitations, no affiliation with Vietlott.
8. 18+ gate component; footer disclaimer on every page.

## Requirements
Vietnamese copy (diacritics verified), WCAG AA, Lighthouse ≥ 90 (performance, accessibility, SEO), responsive 360 px+, no third-party trackers, no ticket-purchase links, none of the forbidden wording (add a CI test that greps built HTML for the forbidden list in `responsible-lottery-ui`).

## Acceptance criteria
- `npm run build` static export succeeds; CI forbidden-word check green.
- Screenshots (mobile + desktop) of each page in the Gate Report.
- Generator/Bao outputs match the Phase 4 fixtures.

## Gate
Gate Report, then STOP: `⏸ DỪNG — chờ "APPROVED PHASE 6"`.
