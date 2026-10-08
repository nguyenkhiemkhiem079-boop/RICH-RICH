import { describe, expect, it } from "vitest";
import { calculateDailyGuidance, dateFromKey } from "./daily-guidance";

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
  it("constructs day-specific ephemeris time at UTC noon", () => {
    expect(dateFromKey("2026-10-08").toISOString()).toBe("2026-10-08T12:00:00.000Z");
    expect(calculateDailyGuidance("2026-10-08").themes[1]).toContain("12:00 giờ Việt Nam (05:00 UTC)");
  });
  it("uses the traditional Sunday-to-Saturday planetary weekday sequence", () => {
    expect(calculateDailyGuidance("2026-10-04").planetaryDay).toBe("Mặt Trời");
    expect(calculateDailyGuidance("2026-10-08").planetaryDay).toBe("Sao Mộc");
  });
});
