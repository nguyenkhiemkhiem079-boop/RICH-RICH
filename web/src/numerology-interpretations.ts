const numberThemes: Record<number, string> = {
  1: "khởi xướng, tự chủ và định hướng cá nhân",
  2: "hợp tác, lắng nghe và cân bằng trong quan hệ",
  3: "biểu đạt, sáng tạo và giao tiếp",
  4: "cấu trúc, thực hành và tính bền bỉ",
  5: "thay đổi, trải nghiệm và khả năng thích nghi",
  6: "chăm sóc, trách nhiệm và sự hài hòa",
  7: "quan sát, học hỏi và chiều sâu nội tâm",
  8: "tổ chức, mục tiêu vật chất và trách nhiệm với nguồn lực",
  9: "lòng trắc ẩn, tổng kết và góc nhìn rộng",
  11: "trực giác và cảm hứng; trong quy ước này 11 được giữ như số chủ đạo",
  22: "tầm nhìn đi cùng khả năng xây dựng có hệ thống; trong quy ước này 22 được giữ",
  33: "phụng sự và chăm sóc cộng đồng; trong quy ước này 33 được giữ",
};

const metricLens: Record<string, string> = {
  "Đường đời": "chủ đề phát triển được gán từ toàn bộ ngày sinh",
  "Ngày sinh": "đặc điểm được gán từ ngày trong tháng bạn sinh",
  "Sứ mệnh / Biểu đạt": "cách diễn giải tổng tên khai sinh theo bảng chữ cái đã công bố",
  "Linh hồn": "cách diễn giải tổng các nguyên âm AEIOU sau chuẩn hóa tên",
  "Nhân cách": "cách diễn giải tổng các phụ âm sau chuẩn hóa tên",
  "Trưởng thành": "chủ đề tổng hợp Đường đời và Biểu đạt trong quy ước này",
  "Thái độ": "cách rút gọn tháng sinh cộng ngày sinh",
  "Năm cá nhân": "chủ đề biểu tượng từ tháng, ngày sinh và năm đang chọn",
  "Cân bằng": "cách rút gọn tổng chữ cái đầu của các từ trong tên",
};
const challengeThemes: Record<number, string> = {
  0: "nhận diện và tích hợp nhiều chủ đề học hỏi khác nhau",
  1: "rèn sự tự chủ và bày tỏ nhu cầu mà vẫn tôn trọng người khác",
  2: "kiên nhẫn, hợp tác và giữ cân bằng cảm xúc",
  3: "diễn đạt suy nghĩ và nuôi dưỡng khả năng sáng tạo",
  4: "xây dựng nề nếp, tính kiên trì và sự linh hoạt trước thay đổi",
  5: "dùng tự do có trách nhiệm và tránh hành động bốc đồng",
  6: "cân bằng trách nhiệm chăm sóc với nhu cầu và ranh giới cá nhân",
  7: "kết hợp suy ngẫm, tin cậy và kết nối với thực tế",
  8: "sử dụng quyền hạn, tham vọng và nguồn lực một cách cân nhắc",
  9: "khép lại, buông bỏ điều không còn phù hợp và mở rộng lòng trắc ẩn",
};

export function numerologyTheme(value: number): string {
  return numberThemes[value] ?? "một giá trị trong hệ số đã chọn";
}

export function explainNumerologyMetric(label: string, value: number): string {
  const lens = metricLens[label] ?? "chỉ số theo quy ước thần số học đã chọn";
  return `Theo cách đọc biểu tượng này, ${value} gợi ${numerologyTheme(value)}. Ở đây chỉ số đại diện cho ${lens}; hãy xem như câu hỏi tự phản tư, không phải kết luận đã được kiểm chứng về tính cách hay tương lai.`;
}

export function explainPinnacle(number: number, challenge: number): string {
  return `Đỉnh ${number} gợi chủ đề ${numerologyTheme(number)}. Thử thách ${challenge} trong cách đọc này gợi ${challengeThemes[challenge] ?? "một chủ đề cần suy ngẫm"}. Đây là từ khóa biểu tượng, không có nghĩa bạn chắc chắn gặp trở ngại cụ thể.`;
}

export function explainPersonalYear(number: number): string {
  return `Năm cá nhân ${number} được dùng như chủ đề biểu tượng về ${numerologyTheme(number)} trong năm đã chọn. Đây không phải dự báo sự kiện; kết quả phụ thuộc quy ước rút gọn được công bố.`;
}
