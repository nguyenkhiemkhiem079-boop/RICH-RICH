import { describe, expect, it } from "vitest";
import { choose, exactMatchProbability } from "./combinatorics";

describe("combinatorics parity fixtures", () => {
  it("matches hand-verified values", () => {
    expect(choose(45n, 6n)).toBe(8145060n);
    expect(choose(55n, 6n)).toBe(28989675n);
    expect(choose(35n, 5n) * 12n).toBe(3895584n);
    expect(exactMatchProbability(45n, 6n, 6n)).toEqual([1n, 8145060n]);
  });
});
