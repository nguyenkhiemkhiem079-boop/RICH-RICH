import { describe, expect, it } from "vitest";
import { calculateAspects, calculatePlacements, localBirthToUtc } from "./astrology";

describe("birth chart calculations", () => {
  it("converts local Vietnam wall time to UTC", () => {
    expect(localBirthToUtc("2000-01-01T07:00", 420).toISOString()).toBe("2000-01-01T00:00:00.000Z");
  });
  it("rejects impossible dates and offsets", () => {
    expect(() => localBirthToUtc("2000-02-30T12:00", 420)).toThrow();
    expect(() => localBirthToUtc("2000-01-01T12:00", 1000)).toThrow();
  });
  it("calculates ten geocentric planet placements and aspects", () => {
    const placements = calculatePlacements(new Date("2000-01-01T00:00:00Z"));
    expect(placements).toHaveLength(10);
    expect(placements.every(p => p.longitude >= 0 && p.longitude < 360 && p.degree >= 0 && p.degree < 30)).toBe(true);
    expect(calculateAspects(placements).every(a => a.orb >= 0 && a.orb <= 8)).toBe(true);
  });
});
