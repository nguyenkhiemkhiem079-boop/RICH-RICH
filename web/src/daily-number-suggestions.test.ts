import { describe, expect, it } from "vitest";
import { calculateDailyGuidance } from "./daily-guidance";
import { dailyNumberSuggestions } from "./daily-number-suggestions";

describe("daily number suggestions", () => {
  it("preserves the real source for symbolic numbers and labels technical fillers", () => {
    const guidance = calculateDailyGuidance("2026-10-08", new Date(1990, 4, 23));
    const first = dailyNumberSuggestions(guidance, 45);
    expect(first).toHaveLength(6);
    expect(new Set(first.map(item => item.value)).size).toBe(6);
    expect(first.find(item => item.value === guidance.dayNumber)?.sources[0]).toContain("ngày dương lịch");
    expect(first.filter(item => item.sources.some(source => source.includes("Bổ sung kỹ thuật"))).length).toBeGreaterThan(0);
    expect(dailyNumberSuggestions(guidance,45)).toEqual(first);
  });
  it("does not fabricate a personal-day source when birth date is absent", () => {
    const guidance = calculateDailyGuidance("2026-10-08");
    const picks = dailyNumberSuggestions(guidance, 10, 3);
    expect(picks.every(item => item.value >= 1 && item.value <= 10)).toBe(true);
    expect(picks.some(item => item.sources.some(source => source.includes("ngày cá nhân")))).toBe(false);
  });
  it("rejects invalid game ranges", () => {
    const guidance = calculateDailyGuidance("2026-10-08");
    expect(() => dailyNumberSuggestions(guidance, 5, 6)).toThrow();
  });
});
