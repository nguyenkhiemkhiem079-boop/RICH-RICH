# Vietlott Lab — Antigravity kit

## Cách dùng
1. Tạo thư mục dự án mới, copy vào gốc: `AGENTS.md` và thư mục `.agent/` (chứa 4 skill).
   Skill theo dự án nằm ở `.agent/skills/`; muốn dùng toàn cục thì chép sang `~/.gemini/antigravity/skills/`.
2. Mở thư mục trong Antigravity (chế độ Planning).
3. Với mỗi phase: dán toàn bộ nội dung file trong `prompts/` vào agent, theo thứ tự PHASE_0 → PHASE_7 (PHASE_8 tùy chọn).
4. Agent sẽ lập kế hoạch → dừng chờ bạn duyệt → làm → nộp "Gate Report" → dừng.
5. Dán Gate Report (và output quan trọng) cho Claude để QA. Sau khi đạt, trả lời agent: `APPROVED PHASE N`.

## Mẹo
- Đừng cài cả thư viện hàng nghìn skill; chỉ thêm skill khi cần và đã đọc nội dung.
- Mỗi phase chạy trong một cuộc hội thoại/agent session mới để tránh đầy context; AGENTS.md và skill giữ ngữ cảnh chung.
- Phase 0 xong mới biết chính xác luật và nguồn dữ liệu: các phase sau chỉ dựa vào tài liệu `docs/research/`.
