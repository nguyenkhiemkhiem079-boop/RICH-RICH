# Phương pháp

Các kỳ quay được xem là độc lập và đồng đều theo giả thuyết không. Thống kê lịch sử không có giá trị dự đoán. Xem tài liệu Phase 0 tại `docs/research/`.

## Các công cụ diễn giải biểu tượng

Các công cụ này cung cấp phép tính hoặc thao tác lặp lại được và một lớp đọc biểu tượng. Chỉ phần phép tính có thể được kiểm thử; cách diễn giải Tarot, Tử Vi, thần số học và chiêm tinh không phải kết luận khoa học, chẩn đoán, lời khuyên chuyên môn hay dự báo bảo đảm. Các truyền thống có thể dùng quy ước khác nhau.

### Tarot

- Dùng bộ 78 lá (22 Ẩn chính, 56 Ẩn phụ) và xáo Fisher–Yates; tính ngẫu nhiên lấy từ Web Crypto khi trình duyệt hỗ trợ.
- Trải một lá hoặc ba vị trí “quá khứ / hiện tại / hướng đi”. Vị trí cuối chỉ là câu hỏi về lựa chọn, không phải tiên đoán tương lai.
- Ý nghĩa và câu hỏi phản tư được viết cho ứng dụng; không sao chép báo cáo của trang tham khảo. Lá ngược được diễn giải như sắc thái cần xem xét, không phải điềm xấu.

### Thần số học

- Dùng bảng chữ cái Pythagoras Latin A=1… I=9 lặp; chuẩn hóa tên tiếng Việt bằng bỏ dấu và Đ→D. Linh hồn tính nguyên âm AEIOU, còn lại được tính là phụ âm.
- Đường đời cộng từng chữ số YYYYMMDD; chỉ số cốt lõi giữ 11/22/33 trong cấu hình này. Thái độ và năm cá nhân rút về 1–9. Năm cá nhân = tháng sinh + ngày sinh + năm dương lịch; mốc đổi theo năm dương lịch, không phải ngày sinh nhật.
- Đỉnh cao lần lượt là tháng+ngày, ngày+năm, tổng hai đỉnh đầu, tháng+năm; thử thách là hiệu tuyệt đối giữa các phần đã rút gọn. Đỉnh đầu kết thúc ở tuổi 36 trừ Đường đời một chữ số; các đỉnh sau nối các chu kỳ 9 năm.
- Chỉ liệt kê “tổng 13/14/16/19” khi tổng một chỉ số cốt lõi được kiểm tra bằng đúng một trong các số đó trước rút gọn. Từ “nợ nghiệp” là thuật ngữ của một số trường phái, không phải dữ kiện về nghiệp quả.
- Không có cơ quan chuẩn hóa khoa học cho các luận giải số học này. Công thức và lựa chọn quy ước được công khai trong mã nguồn; diễn giải chỉ là gợi ý tự phản tư.

### Chiêm tinh phương Tây

- Vị trí thiên thể dùng `astronomy-engine` (phiên bản khai báo trong `web/package.json`) để lấy vector địa tâm và đổi sang kinh độ hoàng đạo; cung nhiệt đới chia 12 cung bằng các cung 30°.
- Giờ địa phương cần chuyển UTC bằng độ lệch nhập tay; tọa độ đông là dương. Dữ liệu giờ lịch sử/múi giờ không tự suy ra từ thành phố, nên người dùng cần nhập đúng giá trị.
- Cung Mọc/MC dùng thời gian thiên văn địa phương, vĩ độ, kinh độ và độ nghiêng hoàng đạo trung bình; nhà dùng Whole Sign. Đây là cấu hình cụ thể, không mặc định trùng Placidus hay mọi phần mềm khác.
- Góc chiếu: 0°±8°, 60°±5°, 90°±6°, 120°±6°, 180°±8°. “Nghịch hành” chỉ mô tả dấu vận tốc kinh độ trong cửa sổ ±12 giờ.
- Nguồn kỹ thuật: [Astronomy Engine JavaScript API](https://github.com/cosinekitty/astronomy/blob/master/source/js/README.md), truy cập 2026-10-08. Tài liệu mô tả hệ tọa độ/API, không chứng minh luận giải chiêm tinh.

### Tử Vi Đẩu Số

- Lá số và dữ liệu cung/sao do `iztro` phiên bản khai báo trong `web/package.json` tạo ra theo cấu hình thư viện. Giờ sinh dùng chỉ số địa chi; hệ quy tắc an sao có thể khác giữa các trường phái.
- Báo cáo hiển thị cung, chính tinh, độ sáng và tứ hóa như căn cứ dữ liệu. Không có chính tinh thì cần xét đối cung/tam phương tứ chính; tóm tắt hiện tại không giả nhận là luận toàn bộ cách cục.
- Vận ngày nhận ngày tại múi giờ Asia/Ho_Chi_Minh và chỉ số giờ địa chi tương ứng; đây là lớp lưu hạn của thư viện, không phải dự báo sự kiện.
- Nguồn kỹ thuật: [iztro](https://github.com/SylarLong/iztro) và [tài liệu vận hạn](https://github.com/SylarLong/iztro-docs/blob/main/posts/horoscope.md), truy cập 2026-10-08. Thư viện xác nhận cấu trúc/API, không xác nhận tính đúng đắn khoa học của thuật giải.

### Số tham khảo Vietlott

Các chỉ số biểu tượng chỉ được ánh xạ thành lựa chọn cá nhân hóa/giải trí. Số thêm vào để đủ số lượng được đánh dấu riêng là bổ sung kỹ thuật. Mọi bộ hợp lệ của cùng trò chơi có xác suất như nhau; không có bước nào ở đây làm tăng xác suất trúng.
