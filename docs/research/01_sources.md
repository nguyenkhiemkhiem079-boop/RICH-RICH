# Nguồn dữ liệu và truy xuất

Ngày truy xuất: 2026-10-08.

| Phạm vi | Nguồn | Kết luận |
|---|---|---|
| Kết quả chính thức | https://vietlott.vn/ | 🟢 Trang chính thức, có kết quả và liên kết sản phẩm. |
| Power 6/55 | https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/655?id=01382&nocatche=1 | 🟢 Trang kết quả có kỳ, ngày, bộ số, Jackpot 1/2 và bảng giải. |
| Lotto 5/35 | https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/535?id=00779&nocatche=1 | 🟢 Trang kết quả có bộ số, lịch 2 kỳ/ngày và bảng giải. |
| Mega 6/45 | https://media.vietlott.vn/vi/04.2019/system/archivedate/the-le-mega-6.45.pdf | 🟢 PDF thể lệ chính thức; cần dùng trang kết quả tương ứng khi crawl. |
| Max 3D Pro | https://media.vietlott.vn/main/03.2026/system/game.pdf.result/00706_max3dpro_a4_v2_00706.pdf | 🟢 Poster kết quả chính thức cho thấy schema bộ ba chữ số. |
| Robots/ToS | https://vietlott.vn/robots.txt và https://vietlott.vn/dieu-khoan-su-dung | 🟡 `/robots.txt` trả HTTP 200 nhưng trả về HTML trang Vietlott thay vì robots directives; không thấy chỉ thị `Disallow`. Điều khoản URL cũng trả trang HTML chung, không trích được điều khoản tự động hóa. Không coi đây là cho phép; cần thận trọng và dừng nếu phản hồi/ToS xác định cấm. |

Khuyến nghị vận hành: User-Agent mô tả rõ, cache response nguyên bản, tối thiểu 2 giây giữa request, exponential backoff và dừng khi robots/ToS cấm.
