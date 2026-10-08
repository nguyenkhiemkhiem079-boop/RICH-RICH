from math import comb


def choose(n: int, k: int) -> int:
    if n < 0 or k < 0 or k > n:
        return 0
    return comb(n, k)


def exact_match_probability(pool: int, pick: int, matches: int) -> tuple[int, int]:
    """Return favourable outcomes and denominator for exactly `matches`."""
    favourable = choose(pick, matches) * choose(pool - pick, pick - matches)
    return favourable, choose(pool, pick)


def bao_ticket_count(selected: int, base: int) -> int:
    if selected < base:
        raise ValueError("selected must be >= base")
    return choose(selected, base)
