import type FunctionalAstrolabe from "iztro/lib/astro/FunctionalAstrolabe";
import type { IFunctionalPalace as FunctionalPalace } from "iztro/lib/astro/FunctionalPalace";

export type TuviInsight = { title: string; text: string; evidence: string; tone: "neutral" | "support" | "consider" };
export const PALACE_GUIDE = [
  ["Mệnh", "Cách nhìn truyền thống về khí chất và xu hướng tự thể hiện."],
  ["Phụ Mẫu", "Biểu tượng về quan hệ gia đình gốc và sự nâng đỡ."],
  ["Phúc Đức", "Góc nhìn truyền thống về nền tảng tinh thần, họ hàng và đời sống nội tâm."],
  ["Điền Trạch", "Chủ đề nhà cửa, không gian sống và tài sản cố định."],
  ["Quan Lộc", "Chủ đề công việc, vai trò và con đường nghề nghiệp."],
  ["Nô Bộc", "Chủ đề bạn bè, cộng sự và mạng lưới xã hội."],
  ["Thiên Di", "Chủ đề môi trường bên ngoài, di chuyển và cách hòa nhập xã hội."],
  ["Tật Ách", "Biểu tượng về sức khỏe và điểm cần quan tâm; không thay thế tư vấn y tế."],
  ["Tài Bạch", "Chủ đề nguồn lực, thu chi và thái độ với tiền bạc; không phải dự báo tài chính."],
  ["Tử Nữ", "Chủ đề con cái, sáng tạo và những điều mình chăm sóc/phát triển."],
  ["Phu Thê", "Chủ đề gắn kết một-một, cam kết và cách phối hợp."],
  ["Huynh Đệ", "Chủ đề anh chị em, bạn đồng trang lứa và sự cộng tác."],
] as const;

const centralStars = ["Tử Vi", "Thiên Cơ", "Thái Dương", "Vũ Khúc", "Thiên Đồng", "Liêm Trinh", "Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Thất Sát", "Phá Quân"];
const starNotes: Record<string, string> = {
  "Tử Vi": "truyền thống gắn với vai trò tổ chức, điều phối và trách nhiệm",
  "Thiên Cơ": "truyền thống gắn với tư duy, tính toán và khả năng thích nghi",
  "Thái Dương": "truyền thống gắn với sự chủ động, biểu đạt và tinh thần đóng góp",
  "Vũ Khúc": "truyền thống gắn với tính thực tế, kỷ luật và quản trị nguồn lực",
  "Thiên Đồng": "truyền thống gắn với sự mềm dẻo, hòa hợp và trải nghiệm",
  "Liêm Trinh": "truyền thống gắn với nguyên tắc, ranh giới và sự tự kiểm soát",
  "Thiên Phủ": "truyền thống gắn với tính tích lũy, ổn định và gìn giữ",
  "Thái Âm": "truyền thống gắn với chiều sâu nội tâm, quan sát và vun bồi",
  "Tham Lang": "truyền thống gắn với giao tiếp, trải nghiệm và nhiều mối quan tâm",
  "Cự Môn": "truyền thống gắn với ngôn ngữ, chất vấn và khả năng phân tích",
  "Thiên Tướng": "truyền thống gắn với phối hợp, hỗ trợ và tinh thần trách nhiệm",
  "Thiên Lương": "truyền thống gắn với nguyên tắc, cố vấn và xu hướng bảo hộ",
  "Thất Sát": "truyền thống gắn với quyết đoán, thử thách và hành động độc lập",
  "Phá Quân": "truyền thống gắn với đổi mới, tái cấu trúc và nhu cầu tự chủ",
};

const mutagenNotes: Record<string, string> = {
  "禄": "Hóa Lộc: truyền thống gắn với nguồn lực, cơ hội hoặc sự gia tăng; không cam kết tiền tài.",
  "Lộc": "Hóa Lộc: truyền thống gắn với nguồn lực, cơ hội hoặc sự gia tăng; không cam kết tiền tài.",
  "权": "Hóa Quyền: truyền thống gắn với quyền chủ động, trách nhiệm hoặc sức ảnh hưởng.",
  "Quyền": "Hóa Quyền: truyền thống gắn với quyền chủ động, trách nhiệm hoặc sức ảnh hưởng.",
  "科": "Hóa Khoa: truyền thống gắn với danh dự, học tập, trợ lực hoặc cách hóa giải.",
  "Khoa": "Hóa Khoa: truyền thống gắn với danh dự, học tập, trợ lực hoặc cách hóa giải.",
  "忌": "Hóa Kỵ: truyền thống gắn với vướng mắc, tập trung hoặc điều cần thận trọng; không mặc định là tai họa.",
  "Kỵ": "Hóa Kỵ: truyền thống gắn với vướng mắc, tập trung hoặc điều cần thận trọng; không mặc định là tai họa.",
};

export function explainMutagen(value: string): string {
  const normalized = value.replace(/^.*?Hóa\s*/i, "").trim();
  return mutagenNotes[normalized] ?? `Tứ hóa “${value}” theo dữ liệu an sao của iztro; ý nghĩa cần xét cùng toàn lá số và trường phái.`;
}

function starsOf(palace: FunctionalPalace) {
  return [...palace.majorStars, ...palace.minorStars, ...palace.adjectiveStars];
}

export function analyzeTuvi(chart: FunctionalAstrolabe): TuviInsight[] {
  const insights: TuviInsight[] = [];
  for (const [name, topic] of PALACE_GUIDE) {
    const palace = chart.palaces.find(item => item.name === name);
    if (!palace) continue;
    const stars = starsOf(palace);
    const major = palace.majorStars.map(star => star.name).filter(Boolean);
    const selected = major.filter(star => centralStars.includes(star));
    const mutagens = stars.filter(star => star.mutagen).map(star => `${star.name} Hóa ${star.mutagen}`);
    const brightness = palace.majorStars.filter(star => star.brightness).map(star => `${star.name} (${star.brightness})`);
    const starText = selected.length
      ? selected.map(star => `${star}: ${starNotes[star]}`).join("; ")
      : major.length ? `Chính tinh ở cung này: ${major.join(", ")}. Nên đối chiếu thêm tam phương tứ chính trước khi luận.`
        : "Cung không có chính tinh theo dữ liệu thư viện; cách luận truyền thống cần xét mượn sao từ đối cung và tam phương tứ chính.";
    const evidence = [
      major.length ? `Chính tinh: ${major.join(", ")}` : "Không có chính tinh",
      brightness.length ? `Độ sáng thư viện: ${brightness.join(", ")}` : "Không có dữ liệu độ sáng cho chính tinh",
      mutagens.length ? `Tứ hóa gắn sao: ${mutagens.join(", ")}` : "Không ghi nhận sao tứ hóa tại cung",
    ].join(" · ");
    insights.push({
      title: `Cung ${name}`,
      text: `${topic} ${starText} ${mutagens.length ? mutagens.map(explainMutagen).join(" ") : "Không có tứ hóa được ghi nhận tại cung này trong dữ liệu thư viện."} Đây là ngôn ngữ biểu tượng của Tử Vi Đẩu Số, không phải kết luận thực chứng về con người hay tương lai.`,
      evidence: `${evidence} · Cách đọc: kết hợp cung, chính tinh, độ sáng và tứ hóa; đây không phải luận toàn diện mọi cách cục.`,
      tone: selected.length ? "neutral" : "consider",
    });
  }
  return insights;
}

export function summarizeTuvi(chart: FunctionalAstrolabe, insights: TuviInsight[]) {
  const life = chart.palaces.find(p => p.name === "Mệnh");
  const body = chart.palaces.find(p => p.isBodyPalace);
  const money = chart.palaces.find(p => p.name === "Tài Bạch");
  const career = chart.palaces.find(p => p.name === "Quan Lộc");
  const lifeStars = life?.majorStars.map(star => star.name).filter(Boolean) ?? [];
  const bodyName = body?.name ?? "không xác định";
  const highlighted = insights.filter(item => item.evidence.includes("Tứ hóa gắn sao:") && !item.evidence.includes("Không ghi nhận sao tứ hóa")).slice(0, 2).map(item => item.title);
  return [
    { title: "Khung lá số", text: `Lá số ${chart.gender}, sinh ${chart.solarDate} (${chart.lunarDate}), ${chart.time} · ${chart.chineseDate}. Mệnh cục: ${chart.fiveElementsClass}; Mệnh chủ ${chart.soul}; Thân chủ ${chart.body}. Đây là thông số an lá số, không phải đánh giá tốt/xấu.` },
    { title: "Cung Mệnh & Thân", text: `Cung Mệnh có ${lifeStars.length ? lifeStars.join(", ") : "không có chính tinh"}; cung Thân an tại cung ${bodyName}. Theo từ điển biểu tượng đã chọn: ${lifeStars.map(star => starNotes[star]).filter(Boolean).join("; ") || "cần xem tam phương tứ chính và đối cung"}. Đây là tóm tắt một phần, không thay thế việc xét toàn cục.` },
    { title: "Công việc & nguồn lực", text: `Quan Lộc: ${career?.majorStars.map(star => star.name).join(", ") || "không có chính tinh"}. Tài Bạch: ${money?.majorStars.map(star => star.name).join(", ") || "không có chính tinh"}. Đây là hai cung để đọc chủ đề nghề nghiệp và cách quản trị nguồn lực theo truyền thống, không phải dự báo thành công hay tiền bạc.` },
    { title: "Điểm để tự chiêm nghiệm", text: highlighted.length ? `${highlighted.join(" và ")} có ghi nhận sao mang tứ hóa theo dữ liệu lá số. Hãy xem đây là gợi ý để suy ngẫm về lựa chọn và thói quen, không phải lời tiên đoán.` : "Không có tứ hóa tại các cung đang xét theo dữ liệu thư viện; không nên suy ra tốt/xấu chỉ từ một dấu hiệu đơn lẻ." },
  ];
}
