---
name: qa-review-gate
description: Defines the Gate Report every phase must end with, and the QA checklist reviewed by the user's QA lead (Claude) before approval. Use at the end of every phase.
---
# Gate Report (end of every phase) — in Vietnamese

1. **Tóm tắt** (≤ 8 lines): what was done / not done.
2. **Files** created/changed (paths).
3. **Lệnh đã chạy** + results (tests, lint, build). Paste real output tails.
4. **Tiêu chí nghiệm thu**: each criterion from the phase prompt → PASS/FAIL + evidence.
5. **Sai khác so với kế hoạch** (deviations) and why.
6. **Rủi ro / điều chưa chắc** with 🟢🟡🔴.
7. **Câu hỏi mở** for the user.
8. **Đề xuất** (not implemented).
9. End with exactly: `⏸ DỪNG — chờ "APPROVED PHASE N"`.

# QA checklist (applied by reviewer)
- Scope respected? Nothing extra built?
- Every external fact has URL + date + confidence marker?
- Tests meaningful (not only happy path), offline, deterministic?
- Numbers re-computed independently for at least 3 samples?
- Any wording that implies prediction? (grep forbidden list)
- Licenses checked for any reused code?
- Reproducible from a clean clone with documented commands?
