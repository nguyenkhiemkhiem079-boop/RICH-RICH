# Vận hành

## Local checks

```powershell
$py = 'C:\Users\khiem.nguyen\AppData\Local\Programs\Python\Python312\python.exe'
& $py -m pip install -e '.[dev]'
& $py -m ruff check .
& $py -m pytest
cd web; npm ci; npm run build; npm test
```

## Cập nhật dữ liệu

Workflow `update-data.yml` chạy theo UTC, có `workflow_dispatch`, rate limit và fail-safe. Nếu crawl hoặc verify thất bại, workflow mở Issue và không commit dữ liệu. Không chạy crawler thủ công nếu chưa kiểm tra robots.txt/ToS và cache raw response.

## Rollback

Tạo revert commit cho commit dữ liệu sai, chạy lại `vl verify`, sau đó merge qua review. Không dùng reset phá lịch sử.

## Deploy

Workflow Cloudflare Pages cần secrets `CLOUDFLARE_API_TOKEN` và `CLOUDFLARE_ACCOUNT_ID`. Không commit secrets. Người vận hành phải tạo project Pages `vietlott-lab` và cấp token tối thiểu quyền.

## GitHub Pages public web

Workflow `.github/workflows/pages.yml` deploy thư mục `web/dist` lên GitHub Pages. Sau khi push lên `master`, vào **Repository Settings → Pages**, chọn **GitHub Actions** làm Source. URL dự kiến: `https://nguyenkhiemkhiem079-boop.github.io/RICH-RICH/`.

Không mở `web/index.html` bằng `file://`; Vite cần HTTP server. Chạy local bằng `npm run dev` trong thư mục `web`.

## Pháp lý

Chủ sở hữu cần tham vấn luật sư Việt Nam về việc xuất bản nội dung liên quan xổ số; tài liệu này không đưa ra kết luận pháp lý.
