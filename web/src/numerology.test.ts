import { describe, expect, it } from "vitest";
import { calculateNumerology, reduceNumerology } from "./numerology";
import { explainNumerologyMetric, explainPinnacle, explainPersonalYear } from "./numerology-interpretations";
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
  it("reports compound debt markers only when a selected core total exactly matches the convention", () => {
    expect(calculateNumerology("A", new Date(1990, 3, 9), 2026).karmicDebt).toEqual([]);
    const debt = calculateNumerology("ABCDAB", new Date(1990, 3, 9), 2026);
    expect(debt.karmicDebt).toContain(13);
    expect(debt.karmicDebtEvidence.some(item => item.number === 13 && item.source === "Biểu đạt")).toBe(true);
  });
  it("provides qualified explanations for each numeric interpretation", () => {
    expect(explainNumerologyMetric("Đường đời", 11)).toContain("không phải kết luận");
    expect(explainPinnacle(8, 4)).toContain("xây dựng nề nếp");
    expect(explainPersonalYear(5)).toContain("năm đã chọn");
  });
  it("keeps the nine-year display inside supported calendar years at boundaries", () => {
    expect(calculateNumerology("A",new Date(2000,0,1),1).yearCycle.map(item=>item.year)).toEqual([1,2,3,4,5,6,7,8,9]);
    expect(calculateNumerology("A",new Date(2000,0,1),9999).yearCycle.map(item=>item.year)).toEqual([9995,9996,9997,9998,9999]);
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
