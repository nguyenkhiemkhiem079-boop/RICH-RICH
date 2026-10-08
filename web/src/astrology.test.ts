import { describe, expect, it } from "vitest";
import { calculateAspects, calculateChartAngles, calculatePlacements, findHouse, localBirthToUtc, meanObliquity } from "./astrology";
import { explainAspect, explainAscendant, explainHouse, explainPlacement } from "./astrology-interpretations";

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
  it("calculates rising sign, midheaven and whole-sign houses from time and coordinates", () => {
    const date = new Date("2000-01-01T00:00:00Z");
    const angles = calculateChartAngles(date, 21.0285, 105.8542);
    expect(angles.houses).toHaveLength(12);
    expect(angles.ascendant).toBeGreaterThanOrEqual(0);
    expect(angles.ascendant).toBeLessThan(360);
    expect(angles.midheaven).toBeGreaterThanOrEqual(0);
    expect(angles.localSiderealHours).toBeGreaterThanOrEqual(0);
    expect(meanObliquity(date)).toBeCloseTo(23.4393, 3);
    expect(findHouse(angles.houses[0].longitude, angles.houses)).toBe(1);
    expect(() => calculateChartAngles(date, 90, 0)).toThrow();
  });
  it("matches the equinox noon geometry at Greenwich", () => {
    const angles = calculateChartAngles(new Date("2024-03-20T12:00:00Z"), 51.4779, 0);
    expect(angles.midheaven < 2 || angles.midheaven > 358).toBe(true);
    expect(Math.floor(angles.ascendant / 30)).toBe(3); // Cancer rising
  });
  it("explains placements, Whole Sign houses, aspects, and chart angles as symbolic conventions", () => {
    const date = new Date("2024-03-20T12:00:00Z");
    const placements = calculatePlacements(date);
    const houses = calculateChartAngles(date,21.0285,105.8542).houses;
    const sun = placements.find(item => item.name === "Mặt Trời")!;
    expect(explainPlacement(sun)).toContain("không phải kết luận khoa học");
    expect(explainAscendant("Cự Giải")).toContain("giờ sinh sai");
    expect(explainHouse(1,houses[0].sign,placements,houses)).toContain("Nhà 1");
    const aspects = calculateAspects(placements);
    if(aspects.length) expect(explainAspect(aspects[0])).toContain("orb");
  });
});
