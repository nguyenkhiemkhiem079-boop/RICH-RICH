from pipeline.combinatorics import bao_ticket_count, choose, exact_match_probability


def test_hand_verified_counts():
    assert choose(45, 6) == 8_145_060
    assert choose(55, 6) == 28_989_675
    assert choose(35, 5) * 12 == 3_895_584
    assert bao_ticket_count(7, 6) == 7
    assert bao_ticket_count(18, 6) == 18_564


def test_exact_match_probability():
    favourable, denominator = exact_match_probability(45, 6, 6)
    assert favourable == 1
    assert denominator == 8_145_060
