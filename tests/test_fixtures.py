import json
from pathlib import Path


def test_shared_fixture_parses():
    data = json.loads(Path("tests/fixtures/combinatorics.json").read_text())
    assert data["choose_45_6"] == 8145060
    assert data["choose_55_6"] == 28989675
    assert data["choose_35_5"] == 324632
    assert data["lotto_5_35_12"] == data["choose_35_5"] * 12
