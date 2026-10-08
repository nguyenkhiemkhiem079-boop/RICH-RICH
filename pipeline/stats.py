import json
from collections import Counter
from itertools import pairwise
from pathlib import Path
from typing import Any


def chi_square_uniform(numbers: list[int], pool: int) -> float:
    counts = Counter(numbers)
    expected = len(numbers) / pool
    return sum((counts[i] - expected) ** 2 / expected for i in range(1, pool + 1)) if expected else 0.0


def runs_parity(draws: list[dict[str, Any]]) -> int:
    bits = [sum(draw["numbers"]) % 2 for draw in draws]
    return sum(a != b for a, b in pairwise(bits))


def export_stats(game: str, path: Path, output: Path, pool: int, seed: int = 20261008) -> dict[str, Any]:
    draws = json.loads(path.read_text(encoding="utf-8"))
    flat = [n for draw in draws for n in draw["numbers"]]
    result = {
        "game": game,
        "n_draws": len(draws),
        "date_range": {"first": draws[0]["draw_date"], "last": draws[-1]["draw_date"]} if draws else None,
        "seed": seed,
        "frequency": dict(sorted(Counter(flat).items())),
        "chi_square": chi_square_uniform(flat, pool),
        "runs_parity": runs_parity(draws),
        "gap_test": {"status": "descriptive_only", "note": "No p-value is claimed until the registered gap model is applied."},
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result
