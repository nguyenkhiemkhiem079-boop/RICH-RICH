from datetime import date
from typing import Any

GAME_RULES = {
    "mega": (45, 6, False),
    "power": (55, 6, True),
    "lotto535": (35, 5, True),
}


def validate_draws(game: str, draws: list[dict[str, Any]]) -> list[str]:
    if game not in GAME_RULES:
        return [f"unsupported game: {game}"]
    max_number, count, has_special = GAME_RULES[game]
    errors: list[str] = []
    expected_id = draws[0].get("draw_id") if draws else None
    previous_date: date | None = None
    seen: set[int] = set()
    for draw in draws:
        draw_id = draw.get("draw_id")
        numbers = draw.get("numbers")
        if not isinstance(draw_id, int) or draw_id != expected_id:
            errors.append(f"non-contiguous draw_id at {draw_id}, expected {expected_id}")
        if isinstance(draw_id, int):
            if draw_id in seen:
                errors.append(f"duplicate draw_id: {draw_id}")
            seen.add(draw_id)
        if not isinstance(numbers, list) or len(numbers) != count:
            errors.append(f"wrong number count at {draw_id}")
        elif numbers != sorted(numbers) or len(set(numbers)) != count or not all(1 <= n <= max_number for n in numbers):
            errors.append(f"invalid numbers at {draw_id}")
        if has_special and (not isinstance(draw.get("special"), int) or not 1 <= draw["special"] <= max_number):
            errors.append(f"invalid special at {draw_id}")
        if isinstance(draw.get("draw_date"), str):
            try:
                current = date.fromisoformat(draw["draw_date"])
                if previous_date and current < previous_date:
                    errors.append(f"dates decrease at {draw_id}")
                previous_date = current
            except ValueError:
                errors.append(f"invalid date at {draw_id}")
        if expected_id is not None:
            expected_id += 1
    return errors
