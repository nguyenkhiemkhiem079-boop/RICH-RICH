import type { DailyGuidance } from "./daily-guidance";

export type DailyNumberSuggestion = { value: number; sources: string[] };

/** Preserves the actual daily-number sources and labels neutral fillers explicitly. */
export function dailyNumberSuggestions(guidance: DailyGuidance, max: number, count = 6): DailyNumberSuggestion[] {
  if (!Number.isInteger(max) || max < 1 || !Number.isInteger(count) || count < 1 || count > max) {
    throw new Error("Phạm vi trò chơi không hợp lệ.");
  }
  const selected = new Map<number, string[]>();
  const candidates: Array<[number | null, string]> = [
    [guidance.dayNumber, "Thần số học · tổng ngày dương lịch rút gọn"],
    [guidance.personalDay, "Thần số học · ngày cá nhân theo công thức hiển thị"],
  ];
  for (const [number, source] of candidates) {
    if (number === null || !Number.isInteger(number) || number < 1 || number > max) continue;
    const sources = selected.get(number) ?? [];
    sources.push(source);
    selected.set(number, sources);
  }
  let state = [...`${guidance.dateKey}|${max}|${guidance.dayNumber}|${guidance.personalDay ?? "none"}`]
    .reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 2166136261);
  while (selected.size < count) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const value = (state % max) + 1;
    if (!selected.has(value)) selected.set(value, ["Bổ sung kỹ thuật để đủ số · không mang ý nghĩa biểu tượng"]);
  }
  return [...selected.entries()].slice(0, count).map(([value, sources]) => ({ value, sources })).sort((a,b)=>a.value-b.value);
}
