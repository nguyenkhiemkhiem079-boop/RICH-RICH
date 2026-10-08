import { describe, expect, it } from "vitest";
import { astro } from "iztro";
import { analyzeTuvi, explainMutagen, summarizeTuvi } from "./tuvi-analysis";

describe("Tử vi chart presentation and evidence-grounded interpretation", () => {
  it("creates 12 palace insights from a valid 12-palace chart", () => {
    const chart = astro.bySolar("1990-5-23", 5, "Nữ", true, "vi-VN");
    const insights = analyzeTuvi(chart);
    const overview = summarizeTuvi(chart, insights);
    expect(chart.palaces).toHaveLength(12);
    expect(insights).toHaveLength(12);
    expect(insights.map(item => item.title)).toContain("Cung Mệnh");
    expect(insights.every(item => item.evidence.length > 0 && item.text.includes("biểu tượng"))).toBe(true);
    expect(overview).toHaveLength(4);
    const bodyPalace = chart.palaces.find(palace => palace.isBodyPalace);
    expect(bodyPalace).toBeDefined();
    expect(overview[1].text).toContain(`cung ${bodyPalace!.name}`);
    expect(explainMutagen("Kỵ")).toContain("không mặc định là tai họa");
    expect(explainMutagen("Thái Dương Hóa Lộc")).toContain("không cam kết tiền tài");
    expect(insights.every(item => item.tone !== "support")).toBe(true);
  });
});
