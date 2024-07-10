from PIL import Image
from pathlib import Path
import argparse
import math
import json


def parse_size(s: str) -> list[int]:
    return list(map(int, s.split("x")))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("dir", help="Directory with the images")
    parser.add_argument("-s", "--size", help="Size of each image, ex='100x50'", type=parse_size, default=None)
    parser.add_argument("-o", "--output", help="Output filename, no extension", default=None)

    args = parser.parse_args()

    files = [file for file in Path(args.dir).glob("*") if file.suffix in (".jpg", ".jpeg", ".png")]
    each_size = Image.open(files[0]).size

    side = math.ceil(math.sqrt(len(files)))
    atlas = Image.new("RGBA", (side * each_size[0], side * each_size[1]))
    info: dict[str, int | tuple[int, int]] = {}
    info["size"] = atlas.size
    info["tex_size"] = each_size
    info["tex_count"] = len(files)
    info["tex_in_row"] = side

    for i, file in enumerate(files):
        size: tuple[int, int] = args.size if args.size else each_size
        x = (i % side) * size[0]
        y = (i // side) * size[1]

        atlas.paste(Image.open(file), (x, y))
        info[file.stem] = (x, y)

    out_name: str = args.output if args.output else Path(args.dir).name
    atlas.save(f"{out_name}.png")
    with open(f"{out_name}.json", "w") as f:
        json.dump(info, f, indent=2)

if __name__ == "__main__":
    main()
