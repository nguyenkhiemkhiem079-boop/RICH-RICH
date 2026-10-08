export function choose(n: number, k: number): bigint {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) return 0n;
  let result = 1n;
  for (let i = 1; i <= Math.min(k, n - k); i++) result = result * BigInt(n - i + 1) / BigInt(i);
  return result;
}

export function probabilityFraction(favorable: bigint, total: bigint, simplify = true): string {
  if (total <= 0n || favorable < 0n) throw new Error("Số trường hợp không hợp lệ.");
  if (favorable === 0n) return "0";
  const gcd = (a: bigint, b: bigint): bigint => b === 0n ? a : gcd(b, a % b);
  const divisor = simplify ? gcd(favorable, total) : 1n;
  return `${favorable / divisor}/${total / divisor}`;
}

export function jackpotOdds(game: "Mega 6/45" | "Power 6/55") {
  if (game === "Mega 6/45") return { label: "Jackpot", favorable: 1n, total: choose(45, 6) };
  return { label: "Jackpot 1", favorable: 1n, total: choose(55, 6) };
}

/** Exact hypergeometric probabilities for matching k main numbers on a 6-number ticket. */
export function matchDistribution(max: number, drawn: number, picked = drawn) {
  const total = choose(max, drawn);
  return Array.from({ length: Math.min(drawn, picked) + 1 }, (_, matched) => ({
    matched,
    favorable: choose(picked, matched) * choose(max - picked, drawn - matched),
    total,
  })).filter(row => row.favorable > 0n);
}

export function bundleJackpotOdds(max: number, drawCount: number, selectedCount: number) {
  const tickets = choose(selectedCount, drawCount);
  const total = choose(max, drawCount);
  return { tickets, favorable: tickets, total };
}
