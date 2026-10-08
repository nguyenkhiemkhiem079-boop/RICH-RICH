export type NumerologyChart = {
  lifePath: number; birthday: number; expression: number; soulUrge: number;
  personality: number; maturity: number; personalYear: number;
  steps: Record<string, string>;
};

export function reduceNumerology(value: number, keepMaster = true): number {
  let n = Math.abs(Math.trunc(value));
  while (n > 9 && !(keepMaster && [11, 22, 33].includes(n))) {
    n = [...String(n)].reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

function normalizedName(name: string): string {
  return name.toLocaleUpperCase("vi-VN").replace(/Đ/g, "D").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, "");
}

function letterValue(letter: string): number { return ((letter.charCodeAt(0) - 65) % 9) + 1; }
function sumDigits(value: string): number { return [...value].filter(c => /\d/.test(c)).reduce((sum, c) => sum + Number(c), 0); }

export function calculateNumerology(name: string, birth: Date, targetYear = new Date().getFullYear()): NumerologyChart {
  if (!Number.isFinite(birth.getTime())) throw new Error("Ngày sinh không hợp lệ.");
  if (birth.getFullYear() < 1 || birth.getFullYear() > 9999) throw new Error("Năm sinh ngoài phạm vi hỗ trợ.");
  const fullName = normalizedName(name);
  if (!fullName) throw new Error("Cần nhập họ tên có ký tự chữ cái.");

  // Pythagorean convention: reduce the full date digit sum; preserve 11/22/33.
  const dateDigits = `${birth.getFullYear()}${String(birth.getMonth() + 1).padStart(2, "0")}${String(birth.getDate()).padStart(2, "0")}`;
  const lifePathSum = sumDigits(dateDigits);
  const birthday = reduceNumerology(birth.getDate());
  const expressionSum = [...fullName].reduce((sum, c) => sum + letterValue(c), 0);
  const vowels = [...fullName].filter(c => "AEIOU".includes(c));
  const vowelSum = vowels.reduce((sum, c) => sum + letterValue(c), 0);
  const consonantSum = [...fullName].filter(c => !"AEIOU".includes(c)).reduce((sum, c) => sum + letterValue(c), 0);
  const personalYearSum = sumDigits(`${birth.getMonth() + 1}${birth.getDate()}${targetYear}`);
  const expression = reduceNumerology(expressionSum);

  return {
    lifePath: reduceNumerology(lifePathSum), birthday,
    expression, soulUrge: reduceNumerology(vowelSum),
    personality: reduceNumerology(consonantSum),
    maturity: reduceNumerology(reduceNumerology(lifePathSum) + expression),
    personalYear: reduceNumerology(personalYearSum),
    steps: {
      lifePath: `${[...dateDigits].join(" + ")} = ${lifePathSum} → ${reduceNumerology(lifePathSum)}`,
      birthday: `${birth.getDate()} → ${birthday}`,
      expression: `${expressionSum} → ${expression}`,
      soulUrge: `${vowelSum} → ${reduceNumerology(vowelSum)}`,
      personality: `${consonantSum} → ${reduceNumerology(consonantSum)}`,
      personalYear: `${birth.getMonth() + 1} + ${birth.getDate()} + ${targetYear} (rút gọn chữ số) → ${reduceNumerology(personalYearSum)}`,
    },
  };
}
