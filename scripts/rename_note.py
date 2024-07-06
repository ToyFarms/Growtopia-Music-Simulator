import os
from pathlib import Path
import argparse


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("dir", help="Input directory with the notes in it")
    parser.add_argument("-r", "--rename", help="Actually rename the file", action="store_true")

    args = parser.parse_args()

    dir = Path(args.dir)

    notes = ["C", "D", "E", "F", "G", "A", "B"]
    mapping: list[str] = []

    for i in range(len(notes)):
        note = notes[i]

        mapping.append(note)
        if note in ("E", "B"):
            continue

        mapping.append(f"{note}#-{notes[i + 1]}b")

    print(mapping)

    count: dict[str, int] = {}

    for file in dir.glob("*"):
        instr, code = file.stem.rsplit("_", maxsplit=1)
        note = mapping[int(code) % len(mapping)].split("-")
        if (len(note) > 1):
            note = f"{note[0]}{int(code) // 12}-{note[1]}{(int(code) + 1) // 12}"
        else:
            note = f"{note[0]}{int(code) // 12}"

        dst = file.parent / f"{instr}_{note}{file.suffix}"
        print(f"source={file}, instrument={instr} code={code} result={note} saving to {dst}")
        if args.rename:
            os.rename(file, dst)

        if instr in count:
            count[instr] += 1
        else:
            count[instr] = 0

    print(count)

if __name__ == "__main__":
    main()
