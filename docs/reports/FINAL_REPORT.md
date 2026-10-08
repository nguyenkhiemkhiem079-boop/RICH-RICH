# Vietlott Lab — báo cáo hiện trạng

## Tóm tắt

Repo đã có kit, nghiên cứu nguồn, scaffold Python/TypeScript, validator fail-closed, combinatorics parity, thống kê mô tả Mega 6/45, website tĩnh tiếng Việt và workflow CI/update/deploy. Dữ liệu Power 6/55 và Lotto 5/35 chưa đạt kiểm tra nguồn nên chưa được dùng cho stats/backtest.

## Definition of Done

| Hạng mục | Trạng thái | Bằng chứng |
|---|---|---|
| Research 01–04 và audit 7 repo | 🟢/🟡 | `docs/research/` |
| Curated Mega/Power/Lotto, zero gaps | 🔴 | Mega PASS; Power/Lotto FAIL validator |
| Stats mọi game, Holm correction | 🔴 | Mới có descriptive Mega |
| Combinatorics Python/TS | 🟢 | `pipeline/combinatorics.py`, `web/src/combinatorics.ts`, tests |
| Pre-registered backtests | 🔴 | Chưa chạy vì thiếu datasets hợp lệ |
| Website đầy đủ + Lighthouse/screenshots | 🟡 | Build/test PASS; Lighthouse và screenshots chưa chạy |
| CI/update/deploy workflows | 🟡 | Workflow files đã tạo; chưa chạy GitHub-hosted |
| Fresh clone all green | 🔴 | Phase 2 blocker |

## Kiểm thử đã xác minh

```text
ruff check .              All checks passed!
pytest                    6 passed
npm run build             ✓ built
npm test                  3 passed
Mega verify               PASS (1375 draws)
Power/Lotto verify        FAIL — ID/schema conflicts
```

## Items 🟡/🔴

- 🟡 `robots.txt` trả HTML thay vì directives; ToS chưa có điều khoản tự động hóa rõ ràng.
- 🟡 Website dùng Vite static shell, chưa có Lighthouse audit và ảnh màn hình.
- 🔴 Power record 00944 thiếu số đặc biệt; Lotto có nhiều đoạn ID gap.
- 🔴 Chưa có Holm-corrected randomness suite đầy đủ.
- 🔴 Chưa có backtest 10.000-run baseline.
- 🔴 License placeholder cần chủ sở hữu chọn.

## Việc người dùng phải làm thủ công

1. Xác nhận với Vietlott/luật sư quyền truy cập tự động và wording pháp lý.
2. Chọn license cho repo.
3. Tạo Cloudflare Pages project, thêm `CLOUDFLARE_API_TOKEN` và `CLOUDFLARE_ACCOUNT_ID`.
4. Xác nhận cron/secrets GitHub Actions.
5. Đối chiếu các kỳ Power/Lotto lỗi trên trang chính thức trước khi cho phép pipeline commit.

## Kết luận

Chưa thể tuyên bố dự án hoàn tất end-to-end. Repo hiện ở trạng thái an toàn để tiếp tục: dữ liệu lỗi bị chặn, không có tuyên bố dự đoán, và các workflow không deploy nếu thiếu credentials.
