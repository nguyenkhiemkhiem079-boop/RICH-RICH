export function choose(n: bigint, k: bigint): bigint {
  if (n < 0n || k < 0n || k > n) return 0n;
  const r = k < n - k ? k : n - k;
  let result = 1n;
  for (let i = 1n; i <= r; i++) result = (result * (n - r + i)) / i;
  return result;
}

export function exactMatchProbability(pool: bigint, pick: bigint, matches: bigint): [bigint, bigint] {
  return [choose(pick, matches) * choose(pool - pick, pick - matches), choose(pool, pick)];
}
