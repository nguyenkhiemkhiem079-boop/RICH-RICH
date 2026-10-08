# PHASE 7 — Automation, deployment, monitoring

## Role
Implementation agent. Plan first, STOP for approval. Ask the user to choose hosting (Cloudflare Pages or Vercel) before writing deploy config.

## Goal
Hands-off daily updates that cannot publish bad data.

## Tasks
1. **Scheduled workflow** `update-data.yml`: GitHub cron is in UTC; Vietnam is UTC+7. Schedule runs shortly after each game's draw time (use the verified draw days/times from Phase 0) with a second retry run later; also `workflow_dispatch`.
2. Steps: crawl new draws → `vl verify` → recompute stats → rerun only cheap derived outputs (full backtest weekly) → commit data to a bot branch → open PR or auto-merge ONLY if verification passes.
3. **Fail-safe**: if crawl/verify fails or the source changes format, do not commit; open a GitHub Issue with logs and keep the site on the last good dataset.
4. **Deploy workflow**: build static site on merge to main and deploy; show dataset version + "cập nhật lần cuối" on the site.
5. Monitoring: workflow-failure notification (email/GitHub), a weekly freshness check (latest draw id vs expected).
6. `docs/OPERATIONS.md`: how to rerun, rollback, rotate tokens, add a game.

## Acceptance criteria
- Dry-run of the update workflow on a branch shows a new draw flowing to the site (use a recorded fixture if no new draw is available).
- A deliberately corrupted fixture is rejected and creates an issue instead of a commit.
- No secrets in the repo; least-privilege workflow permissions.

## Gate
Gate Report, then STOP: `⏸ DỪNG — chờ "APPROVED PHASE 7"`.
