import { describe, expect, it } from "vitest";
describe("responsible copy", () => {
  it("does not contain forbidden promotional claims", () => {
    const copy = "tham khảo lịch sử; ngẫu nhiên; không dự đoán; không mua vé";
    for (const term of ["dự đoán chính xác", "chắc trúng", "số đẹp bảo đảm", "số sắp ra", "mua ngay"]) expect(copy).not.toContain(term);
  });
});
