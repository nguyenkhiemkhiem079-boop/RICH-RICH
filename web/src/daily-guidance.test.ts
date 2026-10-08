import { describe, expect, it } from "vitest";
import { calculateDailyGuidance } from "./daily-guidance";

describe("daily guidance", () => {
  it("is deterministic for a chosen date and returns legal personal lucky digits", () => {
    const birth = new Date(1990, 4, 23);
    const first = calculateDailyGuidance("2026-10-08", birth);
    expect(calculateDailyGuidance("2026-10-08", birth)).toEqual(first);
    expect(first.luckyNumbers.length).toBeGreaterThan(0);
    expect(first.luckyNumbers.every(n => n >= 1 && n <= 9)).toBe(true);
    expect(first.placements).toHaveLength(10);
    expect(first.personalDay).not.toBeNull();
  });
  it("rejects malformed and impossible calendar days", () => {
    expect(() => calculateDailyGuidance("today")).toThrow();
    expect(() => calculateDailyGuidance("2026-02-30")).toThrow();
  });
});
