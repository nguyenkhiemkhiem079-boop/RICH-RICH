import { describe, expect, it } from "vitest";
import { shuffleTarot, tarotDeck } from "./tarot";

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
});
