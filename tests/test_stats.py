from pipeline.stats import chi_square_uniform, runs_parity


def test_stats_small_hand_case():
    assert chi_square_uniform([1, 2, 3, 4], 4) == 0
    assert runs_parity([{"numbers": [1]}, {"numbers": [2]}, {"numbers": [4]}]) == 1
