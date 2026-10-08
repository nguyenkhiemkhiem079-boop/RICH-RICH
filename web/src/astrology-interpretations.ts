import { findHouse, type Aspect, type HouseCusp, type Placement } from "./astrology";

const signs: Record<string, string> = {
  "Bạch Dương": "khởi xướng, hành động và tính trực tiếp",
  "Kim Ngưu": "ổn định, cảm giác an toàn và giá trị bền vững",
  "Song Tử": "tò mò, trao đổi thông tin và nhiều góc nhìn",
  "Cự Giải": "nuôi dưỡng, ký ức và nhu cầu thuộc về",
  "Sư Tử": "sáng tạo, thể hiện và được ghi nhận",
  "Xử Nữ": "phân tích, thực hành và cải thiện chi tiết",
  "Thiên Bình": "cân nhắc, hợp tác và tìm kiếm sự hài hòa",
  "Bọ Cạp": "chiều sâu, chuyển hóa và sự riêng tư",
  "Nhân Mã": "khám phá, mở rộng hiểu biết và tìm ý nghĩa",
  "Ma Kết": "trách nhiệm, cấu trúc và mục tiêu dài hạn",
  "Bảo Bình": "độc lập, ý tưởng mới và góc nhìn cộng đồng",
  "Song Ngư": "tưởng tượng, cảm thông và nhạy cảm với bối cảnh",
};

const planets: Record<string, string> = {
  "Mặt Trời": "bản sắc và cách chủ động thể hiện",
  "Mặt Trăng": "nhu cầu cảm xúc và phản ứng theo thói quen",
  "Sao Thủy": "tư duy, học hỏi và giao tiếp",
  "Sao Kim": "giá trị, sự gắn kết và cách đón nhận niềm vui",
  "Sao Hỏa": "động lực, hành động và cách đối diện xung đột",
  "Sao Mộc": "niềm tin, mở rộng và học hỏi",
  "Sao Thổ": "giới hạn, trách nhiệm và tính bền bỉ",
  "Sao Thiên Vương": "đổi mới, tự do và những thay đổi bất ngờ",
  "Sao Hải Vương": "tưởng tượng, lý tưởng và ranh giới mơ hồ",
  "Sao Diêm Vương": "quyền lực, chuyển hóa và điều nằm sâu bên dưới",
};

export const houseThemes: Record<number, string> = {
  1: "cách bắt đầu, hiện diện và thể hiện bản thân",
  2: "giá trị cá nhân, nguồn lực và cảm giác an toàn vật chất",
  3: "học tập gần, giao tiếp và môi trường thường nhật",
  4: "gốc rễ, gia đình và không gian riêng",
  5: "sáng tạo, vui chơi và cách thể hiện tình cảm",
  6: "thói quen, công việc thường nhật và chăm sóc sức khỏe",
  7: "quan hệ một-một, cam kết và hợp tác",
  8: "nguồn lực chung, sự thân mật và chuyển đổi",
  9: "học vấn cao, thế giới quan và hành trình xa",
  10: "vai trò công chúng, hướng nghề nghiệp và trách nhiệm xã hội",
  11: "bạn bè, nhóm và mục tiêu chung",
  12: "đời sống riêng tư, nghỉ ngơi và những điều khó gọi tên",
};

const aspectThemes: Record<string, string> = {
  "Giao hội": "hai biểu tượng ở gần nhau trên hoàng đạo, được đọc như sự kết hợp hoặc tập trung chủ đề",
  "Lục hợp": "một liên hệ hài hòa theo quy ước, gợi cơ hội phối hợp nếu có chủ động",
  "Vuông góc": "một liên hệ có độ căng theo quy ước, gợi nhu cầu điều chỉnh giữa hai chủ đề",
  "Tam hợp": "một liên hệ thuận lợi theo quy ước, gợi dòng chảy hoặc sự dễ dàng tương đối",
  "Đối đỉnh": "hai biểu tượng nằm đối nhau, gợi việc cân bằng hoặc nhìn thấy hai phía",
};

export function explainPlacement(placement: Placement): string {
  const planet = planets[placement.name] ?? "chủ đề biểu tượng của thiên thể";
  const sign = signs[placement.sign] ?? "một sắc thái biểu tượng của cung hoàng đạo";
  const motion = placement.retrograde
    ? "Trong khoảng kiểm tra ±12 giờ, kinh độ hoàng đạo biểu kiến giảm; đây là mô tả chuyển động nhìn từ Trái Đất, không phải thiên thể thực sự đảo chiều quỹ đạo."
    : "Trong khoảng kiểm tra ±12 giờ, kinh độ hoàng đạo biểu kiến tăng; đây là mô tả chuyển động nhìn từ Trái Đất.";
  return `${placement.name} được dùng làm biểu tượng cho ${planet}; ở ${placement.sign}, sắc thái truyền thống gợi ${sign}. ${motion} Đây là ngôn ngữ chiêm tinh, không phải kết luận khoa học về cá nhân.`;
}

export function explainAspect(aspect: Aspect): string {
  const theme = aspectThemes[aspect.type] ?? "một liên hệ góc theo quy ước";
  return `${theme}. Góc thực tế lệch ${aspect.orb}° so với góc chuẩn ${aspect.angle}° (orb); orb nhỏ hơn chỉ có nghĩa là gần góc chuẩn hơn theo cấu hình này, không đo mức độ ảnh hưởng thực tế.`;
}

export function explainAscendant(sign: string): string {
  return `Cung Mọc ${sign} là dấu hoàng đạo phía Đông tại thời điểm và tọa độ đã nhập. Trong chiêm tinh, cung Mọc được dùng như lăng kính về cách tiếp cận tình huống và ấn tượng ban đầu; giờ sinh sai có thể đổi độ hoặc cung. ${signs[sign] ? `Sắc thái ${sign} thường gợi ${signs[sign]}.` : ""} Đây là diễn giải truyền thống, không phải phép đo tính cách.`;
}

export function explainMidheaven(sign: string): string {
  return `Thiên Đỉnh (MC) là giao điểm phía Nam của hoàng đạo với kinh tuyến địa phương theo cấu hình tính. Trong chiêm tinh truyền thống, điểm này thường được dùng để suy ngẫm về vai trò công chúng và định hướng nghề nghiệp; không dự báo thành công. MC không nhất thiết trùng với đỉnh Nhà 10 trong hệ Whole Sign.`;
}

export function explainHouse(house: number, sign: string, placements: Placement[], houses: HouseCusp[]): string {
  const bodies = placements.filter(placement => findHouse(placement.longitude, houses) === house);
  const signTheme = signs[sign] ?? "một sắc thái biểu tượng của cung hoàng đạo";
  return `Nhà ${house} được quy ước gắn với ${houseThemes[house]}. ${sign} ở đầu nhà gợi sắc thái ${signTheme}.${bodies.length ? ` Thiên thể trong nhà: ${bodies.map(item => item.name).join(", ")}; xem mô tả từng vị trí bên dưới.` : " Không có thiên thể được liệt kê trong nhà này; điều đó không có nghĩa chủ đề nhà không tồn tại."}`;
}
