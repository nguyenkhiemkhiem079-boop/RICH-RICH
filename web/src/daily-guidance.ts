import { calculateAspects, calculatePlacements, type Aspect, type Placement } from "./astrology";
import { reduceNumerology } from "./numerology";

export type DailyGuidance = {
  dateKey: string;
  dayNumber: number;
  personalDay: number | null;
  planetaryDay: string;
  placements: Placement[];
  aspects: Aspect[];
  luckyNumbers: number[];
  themes: string[];
  note: string;
};

// Chaldean weekday rulers in Sunday-to-Saturday order.
const dayRulers = ["Mặt Trời", "Mặt Trăng", "Sao Hỏa", "Sao Thủy", "Sao Mộc", "Sao Kim", "Sao Thổ"];

export function dateFromKey(dateKey: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) throw new Error("Chọn ngày hợp lệ.");
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) throw new Error("Ngày không hợp lệ.");
  return date;
}

/** Calendar-day numerology + geocentric astrology for entertainment; never an event forecast. */
export function calculateDailyGuidance(dateKey: string, birth?: Date): DailyGuidance {
  const utcNoon = dateFromKey(dateKey);
  const dateDigits = `${dateKey.slice(0, 4)}${dateKey.slice(5, 7)}${dateKey.slice(8, 10)}`;
  const dayNumber = reduceNumerology([...dateDigits].reduce((sum, digit) => sum + Number(digit), 0));
  const targetYear = utcNoon.getUTCFullYear();
  const localNoonUtc = new Date(Date.UTC(targetYear, utcNoon.getUTCMonth(), utcNoon.getUTCDate(), 5));
  const personalYear = birth && Number.isFinite(birth.getTime())
    ? reduceNumerology(birth.getMonth() + 1 + birth.getDate() + targetYear)
    : null;
  const personalDay = personalYear === null ? null : reduceNumerology(personalYear + utcNoon.getUTCDate());
  const placements = calculatePlacements(localNoonUtc);
  const aspects = calculateAspects(placements);
  const sunSign = placements.find(item => item.name === "Mặt Trời")!.sign;
  const moonSign = placements.find(item => item.name === "Mặt Trăng")!.sign;
  const weekday = utcNoon.getUTCDay();
  const luckyNumbers = [...new Set([dayNumber, personalDay]
    .filter((value): value is number => value !== null && value >= 1 && value <= 9))];
  if (!luckyNumbers.length) luckyNumbers.push(dayNumber);
  const themes = [
    `Ngày số ${dayNumber}: theo một quy ước thần số học, tổng các chữ số của ngày ${dateKey} rút gọn thành ${dayNumber}; đây là chủ đề biểu tượng, không phải dự báo.`,
    `Ngày ${dateKey} lúc 12:00 giờ Việt Nam (05:00 UTC), phép tính địa tâm cho Mặt Trời ở ${sunSign} và Mặt Trăng ở ${moonSign}; thời điểm khác trong ngày có thể làm thay đổi vị trí Mặt Trăng.`,
    `Thứ trong tuần gắn với ${dayRulers[weekday]} theo quy ước chiêm tinh cổ điển; đây là liên hệ văn hóa, không phải quan hệ nhân quả.`,
    aspects.length ? `Các góc chiếu gần góc chuẩn nhất theo orb cấu hình: ${aspects.slice(0, 2).map(item => `${item.first}–${item.second} ${item.type} (orb ${item.orb}°)`).join("; ")}.` : "Không có góc chiếu chính nằm trong ngưỡng orb cấu hình tại thời điểm tính.",
  ];
  return { dateKey, dayNumber, personalDay, planetaryDay: dayRulers[weekday], placements, aspects, luckyNumbers, themes,
    note: "Đây là diễn giải biểu tượng dựa trên một quy ước thần số học và chiêm tinh phương Tây; không dự đoán sự kiện thực tế. Số may mắn chỉ được đề xuất để cá nhân hóa/giải trí, mọi bộ số Vietlott hợp lệ vẫn có xác suất như nhau." };
}
