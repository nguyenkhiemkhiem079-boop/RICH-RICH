from pipeline.validation import validate_draws


def test_valid_mega_draws():
    draws = [{"draw_id": 1, "draw_date": "2024-01-01", "numbers": [1, 2, 3, 4, 5, 6]}]
    assert validate_draws("mega", draws) == []


def test_rejects_gap_and_invalid_numbers():
    draws = [
        {"draw_id": 1, "draw_date": "2024-01-01", "numbers": [1, 2, 3, 4, 5, 6]},
        {"draw_id": 3, "draw_date": "2024-01-02", "numbers": [1, 1, 3, 4, 5, 99]},
    ]
    errors = validate_draws("mega", draws)
    assert any("non-contiguous" in error for error in errors)
    assert any("invalid numbers" in error for error in errors)
