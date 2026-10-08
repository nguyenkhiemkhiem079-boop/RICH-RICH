import { describe, expect, it } from "vitest";
import { explainTarotPull, recommendTarotAction, shuffleTarot, synthesizeTarotSpread, tarotDeck, tarotPositions, tarotReadingLens } from "./tarot";

describe("Tarot deck", () => {
  it("contains the 22 Major and 56 Minor Arcana with unique IDs", () => {
    expect(tarotDeck).toHaveLength(78);
    expect(new Set(tarotDeck.map(card => card.id)).size).toBe(78);
    expect(tarotDeck.filter(card => card.arcana === "Ẩn chính")).toHaveLength(22);
    expect(tarotDeck.filter(card => card.arcana === "Ẩn phụ")).toHaveLength(56);
  });
  it("shuffles without losing or duplicating cards", () => {
    const shuffled = shuffleTarot();
    expect(shuffled).toHaveLength(78);
    expect(new Set(shuffled.map(card => card.id)).size).toBe(78);
    expect(shuffled.map(card => card.id).sort()).toEqual(tarotDeck.map(card => card.id).sort());
  });
  it("explains each spread position without treating it as a certain prediction", () => {
    expect(tarotPositions.three).toHaveLength(3);
    expect(tarotPositions.single[0].lens).toContain("không phải câu trả lời");
    expect(tarotPositions.three[2].lens).toContain("không phải dự báo");
    const card = tarotDeck.find(item => item.id === "major-0")!;
    const reading = explainTarotPull(card, false, tarotPositions.three[1], "Tình cảm");
    expect(reading).toContain(card.upright);
    expect(reading).toContain("đồng thuận");
    expect(reading).toContain("hoàn cảnh hiện tại");
  });
  it("uses distinct topic-specific reflective lenses", () => {
    expect(tarotReadingLens("Công việc / học tập")).toContain("nguồn lực");
    expect(tarotReadingLens("Phát triển bản thân")).toContain("thực hành");
    expect(tarotReadingLens("unrecognized topic")).toContain("cách giải thích khác");
  });
  it("provides concrete upright and reversed guidance for all 78 cards", () => {
    expect(tarotDeck.every(card => card.actionUpright.length > 30 && card.actionReversed.length > 30)).toBe(true);
    const sixOfCups = tarotDeck.find(card => card.id === "minor-1-5")!;
    expect(sixOfCups.upright).not.toContain("Trong biểu tượng Tarot, lá này gợi");
    expect(recommendTarotAction(sixOfCups, false, 1, "Tình cảm")).toContain("đồng thuận");
    expect(recommendTarotAction(sixOfCups, true, 1, "Tình cảm")).not.toBe(recommendTarotAction(sixOfCups, false, 1, "Tình cảm"));
  });
  it("connects the actual cards and repeated suit in a three-card synthesis", () => {
    const pulls = [
      { card: tarotDeck.find(card => card.id === "minor-1-0")!, reversed: false },
      { card: tarotDeck.find(card => card.id === "minor-1-5")!, reversed: true },
      { card: tarotDeck.find(card => card.id === "major-17")!, reversed: false },
    ];
    const synthesis = synthesizeTarotSpread(pulls, "Tình cảm");
    expect(synthesis).toContain("Át Cốc");
    expect(synthesis).toContain("Sáu Cốc");
    expect(synthesis).toContain("Ngôi Sao");
    expect(synthesis).toContain("bộ Cốc");
    expect(synthesis).toContain("không chứng minh quan hệ nhân quả");
  });
});
