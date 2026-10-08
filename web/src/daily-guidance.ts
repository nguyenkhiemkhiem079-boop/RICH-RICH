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

const dayRulers = ["Mặt Trăng", "Sao Hỏa", "Sao Thủy", "Mặt Trời", "Sao Mộc", "Sao Kim", "Sao Thổ"];

function dateFromKey(dateKey: string): Date {
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
  const personalDay = birth && Number.isFinite(birth.getTime())
    ? reduceNumerology(reduceNumerology(birth.getMonth() + 1 + birth.getDate() + new Date(`${dateKey}T12:00:00Z`).getUTCFullYear()) + dayNumber)
    : null;
  const placements = calculatePlacements(utcNoon);
  const aspects = calculateAspects(placements);
  const sunSign = placements.find(item => item.name === "Mặt Trời")!.sign;
  const moonSign = placements.find(item => item.name === "Mặt Trăng")!.sign;
  const weekday = utcNoon.getUTCDay();
  const luckyNumbers = [...new Set([dayNumber, personalDay, weekday + 1, ...aspects.slice(0, 2).map(item => reduceNumerology(item.angle))]
    .filter((value): value is number => value !== null && value >= 1 && value <= 9))];
  if (!luckyNumbers.length) luckyNumbers.push(dayNumber);
  const themes = [
    `Ngày số ${dayNumber}: chủ đề thần số học theo phép rút gọn ngày dương lịch.`,
    `Ngày ${dateKey} (UTC): Mặt Trời ở ${sunSign}, Mặt Trăng ở ${moonSign}.`,
    `Thứ trong tuần gắn với ${dayRulers[weekday]} theo quy ước chiêm tinh cổ điển.` ,
    aspects.length ? `Góc chiếu nổi bật theo orb cấu hình: ${aspects.slice(0, 2).map(item => `${item.first}–${item.second} ${item.type} (${item.orb}°)`).join("; ")}.` : "Không có góc chiếu chính trong orb cấu hình đang dùng.",
  ];
  return { dateKey, dayNumber, personalDay, planetaryDay: dayRulers[weekday], placements, aspects, luckyNumbers, themes,
    note: "Đây là diễn giải biểu tượng dựa trên một quy ước thần số học và chiêm tinh phương Tây; không dự đoán sự kiện thực tế. Số may mắn chỉ được đề xuất để cá nhân hóa/giải trí, mọi bộ số Vietlott hợp lệ vẫn có xác suất như nhau." };
}
