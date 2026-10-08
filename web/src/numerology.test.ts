import { describe, expect, it } from "vitest";
import { calculateNumerology, reduceNumerology } from "./numerology";
import { personalNumbers } from "./personal-numbers";
import { bundleJackpotOdds, choose, jackpotOdds, matchDistribution, probabilityFraction } from "./probability";

describe("numerology", () => {
  it("reduces date, name and personal year deterministically", () => {
    const result = calculateNumerology("Nguyễn Thị Đặng", new Date(1990, 4, 23), 2026);
    expect(result.lifePath).toBe(11);
    expect(result.personalYear).toBe(2);
    expect(result.expression).toBeGreaterThan(0);
    expect(result.maturity).toBe(reduceNumerology(result.lifePath + result.expression));
  });
  it("rejects invalid inputs", () => {
    expect(() => calculateNumerology("", new Date(1990, 0, 1))).toThrow();
    expect(() => calculateNumerology("A", new Date(Number.NaN))).toThrow();
  });
  it("calculates report sections and a nine-year cycle deterministically", () => {
    const result = calculateNumerology("Nguyễn Trần Gia Khiêm", new Date(2002, 8, 13), 2026);
    expect(result.lifePath).toBe(8);
    expect(result.attitude).toBe(4);
    expect(result.personalYear).toBe(5);
    expect(result.yearCycle).toHaveLength(9);
    expect(result.yearCycle.map(x => x.year)).toEqual([2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]);
    expect(result.yearCycle.find(x => x.year === 2026)?.number).toBe(5);
    expect(result.pinnacles).toHaveLength(4);
    expect(result.arrows).toHaveLength(8);
    expect(result.karmicLessons.every(value => value >= 1 && value <= 9)).toBe(true);
  });
  it("returns unique numbers with provenance in legal range", () => {
    const chart = calculateNumerology("Nguyễn Thị Đặng", new Date(1990, 4, 23), 2026);
    const numbers = personalNumbers(chart, new Date(1990, 4, 23), 45, 6);
    expect(numbers).toHaveLength(6);
    expect(new Set(numbers.map(n => n.value)).size).toBe(6);
    expect(numbers.every(n => n.value >= 1 && n.value <= 45 && n.sources.length > 0)).toBe(true);
  });
});

describe("exact lottery combinatorics", () => {
  it("matches known jackpot denominators", () => {
    expect(choose(45, 6)).toBe(8145060n);
    expect(jackpotOdds("Power 6/55").total).toBe(28989675n);
  });
  it("computes bundle chance and match distribution", () => {
    const bundle = bundleJackpotOdds(45, 6, 7);
    expect(bundle.tickets).toBe(7n);
    expect(probabilityFraction(bundle.favorable, bundle.total, false)).toBe("7/8145060");
    expect(matchDistribution(45, 6).reduce((s, x) => s + x.favorable, 0n)).toBe(choose(45, 6));
  });
});
