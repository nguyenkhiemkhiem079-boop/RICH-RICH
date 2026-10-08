import argparse
import json
from pathlib import Path

from pipeline.validation import validate_draws


def main() -> None:
    parser = argparse.ArgumentParser(prog="vl")
    parser.add_argument("command", choices=["crawl", "verify", "stats", "backtest"])
    parser.add_argument("game", nargs="?")
    args = parser.parse_args()
    if args.command == "verify":
        games = [args.game] if args.game else ["mega", "power", "lotto535"]
        failed = False
        for game in games:
            path = Path("data/curated") / f"{game}.json"
            draws = json.loads(path.read_text(encoding="utf-8"))
            errors = validate_draws(game, draws)
            if errors:
                failed = True
                print(f"{game}: FAIL: {'; '.join(errors)}")
            else:
                print(f"{game}: PASS ({len(draws)} draws)")
        if failed:
            raise SystemExit(1)
        return
    print(f"{args.command}: not implemented")


if __name__ == "__main__":
    main()
