# Báo cáo cổng Phase 2

## Tóm tắt

Đã triển khai validator offline, tải và cache ba JSONL mirror có MIT license, chuyển đổi schema curated thử nghiệm, và chạy kiểm tra. Mega 6/45 PASS 1.375 draw; Power 6/55 và Lotto 5/35 FAIL do mismatch ID/schema từ mirror. Không coi curated lỗi là dữ liệu sản xuất.

## Files

`pipeline/validation.py`, `pipeline/cli.py`, `tests/test_validation.py`, `data/raw/vietvudanh/2026-10-08/`, `data/curated/*.json`, `data/derived/crosscheck_*.md`.

## Lệnh đã chạy + output

```text
python -m ruff check .
All checks passed!
python -m pytest
3 passed in 0.02s
python -m pipeline.cli verify
mega: PASS (1375 draws)
power: FAIL: non-contiguous draw_id ... wrong number count at 944 ...
lotto535: FAIL: non-contiguous draw_id ...
```

## Tiêu chí nghiệm thu

| Tiêu chí | Kết quả | Evidence |
|---|---|---|
| `vl verify` cho từng game, zero gaps | FAIL | Power/Lotto validator output |
| Counts/first/last match official | FAIL | Chưa thể khẳng định khi mirror có conflict |
| 30 random draws/game | FAIL | Chưa xuất bản vì dữ liệu chưa đạt validation |
| Mirror agreement ≥99.5% hoặc giải thích mismatch | FAIL | Mismatch đã liệt kê, nhưng cần official cross-check |

## Sai khác

Không bỏ bản ghi hoặc nắn ID vì trái quy tắc fail-closed.

## Rủi ro

🔴 Không được chạy stats/backtest trên Power/Lotto cho tới khi nguồn chính thức giải quyết conflict. 🟡 Mega mirror chưa thay thế official verification.

## Câu hỏi mở

Cần nguồn chính thức/format lịch sử ổn định cho Power/Lotto để xác minh các đoạn ID conflict.

## Đề xuất

Chạy crawler official sau khi xác nhận endpoint lịch sử và ToS; giữ mirror chỉ làm cross-check.

⏸ DỪNG — chờ "APPROVED PHASE 2"
