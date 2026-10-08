import argparse


def main() -> None:
    parser = argparse.ArgumentParser(prog="vl")
    parser.add_argument("command", choices=["crawl", "verify", "stats", "backtest"])
    parser.add_argument("game", nargs="?")
    args = parser.parse_args()
    print(f"{args.command}: not implemented")


if __name__ == "__main__":
    main()
