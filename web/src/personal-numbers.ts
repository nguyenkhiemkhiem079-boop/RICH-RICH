import type { NumerologyChart } from "./numerology";

export type LuckyNumber = { value: number; sources: string[] };

/** Maps personal/cultural inputs to a unique set. This does not alter lottery odds. */
export function personalNumbers(chart: NumerologyChart, birth: Date, max: number, count = 6): LuckyNumber[] {
  if (!Number.isFinite(birth.getTime()) || !Number.isInteger(max) || max < 1 ||
      !Number.isInteger(count) || count < 1 || count > max) {
    throw new Error("Ngày sinh hoặc phạm vi trò chơi không hợp lệ.");
  }
  const candidates: Array<[number, string]> = [
    [chart.lifePath, "Thần số học · Đường đời"], [chart.birthday, "Thần số học · Ngày sinh"],
    [chart.expression, "Thần số học · Biểu đạt"], [chart.soulUrge, "Thần số học · Linh hồn"],
    [chart.personality, "Thần số học · Nhân cách"], [chart.personalYear, "Thần số học · Năm cá nhân"],
    [chart.attitude, "Thần số học · Thái độ"], [chart.balance, "Thần số học · Cân bằng"],
    [chart.pinnacles[0]?.number ?? chart.lifePath, "Thần số học · Đỉnh cao 1"],
    [birth.getDate(), "Ngày sinh"], [birth.getMonth() + 1, "Tháng sinh"],
    [birth.getFullYear() % 100, "Năm sinh (2 chữ số cuối)"],
  ];
  const merged = new Map<number, string[]>();
  for (const [raw, source] of candidates) {
    if (!Number.isFinite(raw)) continue;
    const value = ((Math.abs(Math.trunc(raw)) - 1 + max) % max) + 1;
    const sources = merged.get(value) ?? [];
    if (!sources.includes(source)) sources.push(source);
    merged.set(value, sources);
  }

  // Stable, profile-derived fill makes the output reproducible without claiming significance.
  let state = [...candidates.map(([value]) => String(value)).join(":")]
    .reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 2166136261);
  while (merged.size < count) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const value = (state % max) + 1;
    if (!merged.has(value)) merged.set(value, ["Bổ sung theo seed hồ sơ (mang tính giải trí)"]);
  }
  return [...merged.entries()].slice(0, count).map(([value, sources]) => ({ value, sources }))
    .sort((a, b) => a.value - b.value);
}
