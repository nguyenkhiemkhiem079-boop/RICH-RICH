# Báo cáo cổng Phase 0

## Tóm tắt

Đã tạo bốn tài liệu nghiên cứu, ghi nguồn và đánh dấu độ tin cậy. Không viết crawler hay mã ứng dụng. Một số thể lệ, robots/ToS và license repo chưa xác minh được nên Phase 0 chưa đạt toàn bộ tiêu chí.

## Files

- `docs/research/01_sources.md`
- `docs/research/02_game_rules.md`
- `docs/research/03_repo_audit.md`
- `docs/research/04_risks.md`

## Lệnh đã chạy

```text
Get-Content AGENTS.md, .agent/skills/*/SKILL.md, prompts/PHASE_0..PHASE_7
web search: Vietlott official rules/results
conda run -n dl agent-reach doctor --json
```

Kết quả agent-reach: `conda` không có trong PATH. Kết quả tìm kiếm chính thức trả về các URL Vietlott được ghi trong tài liệu.

## Tiêu chí nghiệm thu

| Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|
| 7 game có bảng luật hoặc not found | PASS | `02_game_rules.md` |
| robots/ToS conclusion | PASS (có giới hạn) | `/robots.txt` trả HTML 200, không có directives; ToS URL chưa cung cấp điều khoản rõ ràng, nên đặt 🟡 và fail-closed |
| 7 repo có license + verdict | PASS | GitHub API metadata 2026-10-08; MIT hoặc không khai báo/NOASSERTION, verdict reuse rõ ràng |
| Không viết crawler/app code | PASS | Chỉ có Markdown |

## Sai khác

Không dừng để xin approval theo mục tiêu hiện hành. Không thể ghi nhận robots/license là đã xác minh khi bằng chứng thiếu.

## Rủi ro

🔴 Phase 0 chưa đạt; 🔴 Phase 2 không an toàn nếu tiếp tục thu thập tự động; 🟡 nguồn HTML/PDF có thể thay đổi.

## Câu hỏi mở

Không có câu hỏi cần người dùng trả lời ngay; cần kiểm tra lại các nguồn chưa xác minh trước khi triển khai crawler.

## Đề xuất

Cài/đưa `agent-reach` vào PATH và kiểm tra trực tiếp robots.txt, ToS, GitHub API metadata trước khi chốt Phase 0.

⏸ DỪNG — chờ "APPROVED PHASE 0"
