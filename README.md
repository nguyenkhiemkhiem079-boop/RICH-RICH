# Vietlott Lab

Pipeline và website tĩnh tiếng Việt cho dữ liệu kết quả Vietlott. Kết quả xổ số là ngẫu nhiên; dự án không dự đoán kỳ quay sau.

## Local commands

```powershell
python -m pytest
python -m ruff check .
python -m pipeline.cli verify Mega
cd web; npm install; npm run build; npm test
```

Dữ liệu và thống kê chỉ được thêm sau khi kiểm tra nguồn chính thức, robots/ToS và fixture offline.
