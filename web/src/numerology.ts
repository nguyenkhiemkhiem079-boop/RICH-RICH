export type Pinnacle = { index: number; number: number; challenge: number; startAge: number; endAge: number; year: number; formula: string };
export type BirthArrow = { name: string; digits: number[]; present: boolean; meaning: string };
export type KarmicDebtEvidence = { number: number; source: string; formula: string };
export type NumerologyChart = {
  lifePath: number; birthday: number; expression: number; soulUrge: number;
  personality: number; maturity: number; personalYear: number; attitude: number;
  balance: number; lifePathBridge: number; expressionBridge: number;
  karmicLessons: number[]; karmicDebt: number[]; karmicDebtEvidence: KarmicDebtEvidence[]; arrows: BirthArrow[]; pinnacles: Pinnacle[];
  yearCycle: Array<{ year: number; number: number }>;
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
function reducePart(value: number): number { return reduceNumerology(value, false); }

export function calculateNumerology(name: string, birth: Date, targetYear = new Date().getFullYear()): NumerologyChart {
  if (!Number.isFinite(birth.getTime())) throw new Error("Ngày sinh không hợp lệ.");
  if (birth.getFullYear() < 1 || birth.getFullYear() > 9999 || !Number.isInteger(targetYear) || targetYear < 1 || targetYear > 9999) throw new Error("Năm ngoài phạm vi hỗ trợ.");
  const fullName = normalizedName(name);
  if (!fullName) throw new Error("Cần nhập họ tên có ký tự chữ cái.");
  const month = birth.getMonth() + 1;
  const day = birth.getDate();
  const year = birth.getFullYear();
  const dateDigits = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
  const lifePathSum = sumDigits(dateDigits);
  const lifePath = reduceNumerology(lifePathSum);
  const birthday = reduceNumerology(day);
  const expressionSum = [...fullName].reduce((sum, c) => sum + letterValue(c), 0);
  const vowels = [...fullName].filter(c => "AEIOU".includes(c));
  const consonants = [...fullName].filter(c => !"AEIOU".includes(c));
  const vowelSum = vowels.reduce((sum, c) => sum + letterValue(c), 0);
  const consonantSum = consonants.reduce((sum, c) => sum + letterValue(c), 0);
  const expression = reduceNumerology(expressionSum);
  const soulUrge = reduceNumerology(vowelSum);
  const personality = reduceNumerology(consonantSum);
  const personalYearSum = month + day + targetYear;
  const personalYear = reducePart(personalYearSum);
  const attitude = reducePart(month + day);
  const initials = name.toLocaleUpperCase("vi-VN").replace(/Đ/g, "D").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim().split(/\s+/).map(word => word[0]).filter((c): c is string => Boolean(c && /[A-Z]/.test(c)))
    .reduce((sum, c) => sum + letterValue(c), 0);
  const balance = reduceNumerology(initials);
  const maturity = reduceNumerology(lifePath + expression);
  const lifePathBridge = Math.abs(reducePart(lifePath) - reducePart(birthday));
  const expressionBridge = Math.abs(reducePart(expression) - reducePart(lifePath));

  const nameDigits = new Set([...fullName].map(letterValue));
  const karmicLessons = Array.from({ length: 9 }, (_, i) => i + 1).filter(n => !nameDigits.has(n));
  // Only report a compound debt when a selected core-number total is exactly
  // 13, 14, 16, or 19 before reduction; do not flag arbitrary intermediate sums.
  const karmicDebtEvidence = [
    { number: lifePathSum, source: "Đường đời", formula: `${[...dateDigits].join(" + ")} = ${lifePathSum}` },
    { number: day, source: "Ngày sinh", formula: `${day}` },
    { number: expressionSum, source: "Biểu đạt", formula: `Tổng chữ cái tên = ${expressionSum}` },
    { number: vowelSum, source: "Linh hồn", formula: `Tổng nguyên âm AEIOU = ${vowelSum}` },
    { number: consonantSum, source: "Nhân cách", formula: `Tổng phụ âm = ${consonantSum}` },
  ].filter(item => [13, 14, 16, 19].includes(item.number));
  const karmicDebt = [...new Set(karmicDebtEvidence.map(item => item.number))].sort((a, b) => a - b);

  const arrowDefinitions: Array<[string, number[]]> = [
    ["Thực tế", [1, 4, 7]], ["Cảm xúc", [2, 5, 8]], ["Trí tuệ", [3, 6, 9]],
    ["Kế hoạch", [1, 2, 3]], ["Ý chí", [4, 5, 6]], ["Hoạt động", [7, 8, 9]],
    ["Quyết tâm", [1, 5, 9]], ["Nhạy cảm", [3, 5, 7]],
  ];
  const birthDigits = new Set([...dateDigits].filter(d => d !== "0").map(Number));
  const arrows = arrowDefinitions.map(([name, digits]) => {
    const present = digits.every(n => birthDigits.has(n));
    return { name, digits, present, meaning: present ? "Đủ ba số trong ngày sinh theo lưới Pitago." : `Thiếu ${digits.filter(n => !birthDigits.has(n)).join(", ")} trong trục này.` };
  });

  const m = reducePart(month), d = reducePart(day), y = reducePart(sumDigits(String(year)));
  const p1 = reduceNumerology(m + d), p2 = reduceNumerology(d + y), p3 = reduceNumerology(p1 + p2), p4 = reduceNumerology(m + y);
  const c1 = Math.abs(m - d), c2 = Math.abs(d - y), c3 = Math.abs(c1 - c2), c4 = Math.abs(m - y);
  const firstEnd = Math.max(0, 36 - reducePart(lifePath));
  const pinnacleData: Array<[number, number, number, number, number, string]> = [
    [p1, c1, 0, firstEnd, year + firstEnd, `${m} + ${d}; thử thách |${m} − ${d}|`],
    [p2, c2, firstEnd + 1, firstEnd + 9, year + firstEnd + 1, `${d} + ${y}; thử thách |${d} − ${y}|`],
    [p3, c3, firstEnd + 10, firstEnd + 18, year + firstEnd + 10, `${p1} + ${p2}; thử thách |${c1} − ${c2}|`],
    [p4, c4, firstEnd + 19, 99, year + firstEnd + 19, `${m} + ${y}; thử thách |${m} − ${y}|`],
  ];
  const pinnacles = pinnacleData.map(([number, challenge, startAge, endAge, startYear, formula], i) => ({
    index: i + 1, number, challenge, startAge, endAge, year: startYear, formula,
  }));
  const firstCycleYear = Math.max(1, targetYear - 4);
  const cycleLength = Math.min(9, 10000 - firstCycleYear);
  const yearCycle = Array.from({ length: cycleLength }, (_, i) => {
    const cycleYear = firstCycleYear + i;
    return { year: cycleYear, number: reducePart(month + day + cycleYear) };
  });

  return {
    lifePath, birthday, expression, soulUrge, personality, maturity, personalYear,
    attitude, balance, lifePathBridge, expressionBridge, karmicLessons, karmicDebt, karmicDebtEvidence, arrows, pinnacles, yearCycle,
    steps: {
      lifePath: `${[...dateDigits].join(" + ")} = ${lifePathSum} → ${lifePath}`,
      birthday: `${day} → ${birthday}`,
      expression: `${expressionSum} (tên bỏ dấu, Đ→D; A=1… I=9 lặp) → ${expression}`,
      soulUrge: `Tổng nguyên âm AEIOU = ${vowelSum} → ${soulUrge}`,
      personality: `Tổng phụ âm = ${consonantSum} → ${personality}`,
      maturity: `${lifePath} + ${expression} → ${maturity}`,
      personalYear: `${month} + ${day} + ${targetYear} = ${personalYearSum} → ${personalYear}`,
      attitude: `${month} + ${day} = ${month + day} → ${attitude}`,
      balance: `Tổng chữ cái đầu tên = ${initials} → ${balance}`,
      bridge: `Cầu nối Đường đời–Ngày sinh = |${reducePart(lifePath)} − ${reducePart(birthday)}| = ${lifePathBridge}; Sứ mệnh–Đường đời = |${reducePart(expression)} − ${reducePart(lifePath)}| = ${expressionBridge}`,
    },
  };
}
