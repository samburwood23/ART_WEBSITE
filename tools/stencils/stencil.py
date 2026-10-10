"""SAMHART stencil pipeline: AI image -> cut-ready stencil SVG.

    python stencil.py generate "circuit traces around an enso circle" --num 4
    python stencil.py convert runs/<folder>/generated_01.png
    python stencil.py make "circuit traces around an enso circle" --num 4

See README.md for setup and what every option does.
"""

import argparse
import json
import re
from datetime import datetime
from pathlib import Path

from PIL import Image

from pipeline import islands, prepare, vectorize
from pipeline.generate import generate

RUNS = Path(__file__).parent / "runs"


def new_run_folder(label):
    slug = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")[:40] or "run"
    folder = RUNS / f"{datetime.now():%Y-%m-%d_%H%M%S}_{slug}"
    return folder


def convert(image_path, out_dir, args):
    """Run stages 2-4 on one image, saving a picture after each step."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    ppm = args.px_per_mm
    print(f"\nConverting {image_path} -> {out_dir}/")

    grey, box = prepare.load_on_sheet(image_path, args.width, args.height, args.margin, ppm)
    Image.fromarray(grey).save(out_dir / "1_source.png")

    paint = prepare.threshold(grey, box, ppm, level=args.threshold, invert=args.invert)
    vectorize.save_mask_png(out_dir / "2_black_and_white.png", paint)

    paint = prepare.clean(paint, ppm, args.margin, args.min_feature, args.min_hole)
    vectorize.save_mask_png(out_dir / "3_cleaned.png", paint)

    if args.islands == "bridge":
        bridged, bridges, report = islands.add_bridges(
            paint, ppm, args.bridge_width, args.min_island, args.bridges)
    else:
        bridged, bridges = paint, paint & False
        _, _, found = islands.find_islands(paint)
        report = {"islands_found": len(found), "islands_remaining": len(found)}
    vectorize.save_islands_png(out_dir / "4_islands.png", paint, bridged, bridges)
    vectorize.save_mask_png(out_dir / "5_final.png", bridged)

    outlines = vectorize.trace(bridged, ppm, args.smoothing)
    vectorize.write_cut_svg(out_dir / "stencil_cut.svg", outlines, args.width, args.height,
                            sheet_outline=not args.no_outline)
    vectorize.write_preview_svg(out_dir / "stencil_preview.svg", outlines, args.width, args.height)

    report.update({"source": str(image_path), "cut_paths": len(outlines),
                   "settings": {k: v for k, v in vars(args).items() if k not in ("func", "images", "prompt")}})
    (out_dir / "report.json").write_text(json.dumps(report, indent=2))

    print(f"  islands found: {report['islands_found']}", end="")
    if args.islands == "bridge":
        print(f", bridged: {report['bridges_added']} bridge(s), "
              f"too small so cut away: {report['islands_removed']}")
    else:
        print()
    if report["islands_remaining"]:
        print(f"  WARNING: {report['islands_remaining']} piece(s) will fall out when cut "
              f"(shown in red in 4_islands.png). Keep them and place them by hand.")
    else:
        print("  OK: nothing will fall out when cut.")
    print(f"  cut file: {out_dir / 'stencil_cut.svg'}")


def cmd_generate(args):
    folder = new_run_folder(args.prompt)
    generate(args.prompt, folder, args.num, args.seed, args.aspect_ratio,
             args.lora_scale, args.guidance, stencil_style=not args.raw_prompt)
    print(f"\nNext: python stencil.py convert {folder}/generated_01.png")


def cmd_convert(args):
    for image in args.images:
        image = Path(image)
        convert(image, args.out or image.parent / f"stencil_{image.stem}", args)


def cmd_make(args):
    folder = new_run_folder(args.prompt)
    for image in generate(args.prompt, folder, args.num, args.seed, args.aspect_ratio,
                          args.lora_scale, args.guidance, stencil_style=not args.raw_prompt):
        convert(image, folder / f"stencil_{image.stem}", args)


def add_generate_options(p):
    p.add_argument("prompt", help="what to draw, e.g. 'circuit traces around an enso circle'")
    p.add_argument("--num", type=int, default=1, choices=range(1, 5), metavar="1-4",
                   help="how many images to make (default 1)")
    p.add_argument("--seed", type=int, help="fix the randomness so you can recreate an image")
    p.add_argument("--aspect-ratio", default="2:3", help="image shape, e.g. 2:3, 1:1, 3:2 (default 2:3)")
    p.add_argument("--lora-scale", type=float, default=1.0,
                   help="how strongly to apply your style, 0-2 (default 1.0)")
    p.add_argument("--guidance", type=float, default=3.5,
                   help="how closely to follow the prompt, 0-10 (default 3.5; try 4-5 "
                        "if images aren't black and white enough)")
    p.add_argument("--raw-prompt", action="store_true",
                   help="don't add the stencil-print wording to the prompt")


def add_convert_options(p):
    g = p.add_argument_group("sheet size (millimetres)")
    g.add_argument("--width", type=float, default=210, help="sheet width (default 210, A4)")
    g.add_argument("--height", type=float, default=297, help="sheet height (default 297, A4)")
    g.add_argument("--margin", type=float, default=15, help="solid border around the design (default 15)")

    g = p.add_argument_group("black and white")
    g.add_argument("--threshold", type=int, help="0-255; higher = more paint (default: automatic)")
    g.add_argument("--invert", action="store_true", help="spray the light parts instead of the dark")

    g = p.add_argument_group("cleaning up")
    g.add_argument("--min-feature", type=float, default=1.0,
                   help="thinnest line or strip kept, mm (default 1.0; try 2 for hand cutting)")
    g.add_argument("--min-hole", type=float, default=2.0, help="smallest hole kept, mm² (default 2)")

    g = p.add_argument_group("islands")
    g.add_argument("--islands", choices=["bridge", "keep"], default="bridge",
                   help="bridge = add bridges (default); keep = leave them and warn")
    g.add_argument("--bridge-width", type=float, default=1.5, help="bridge width, mm (default 1.5)")
    g.add_argument("--bridges", type=int, default=2, help="bridges for large islands (default 2)")
    g.add_argument("--min-island", type=float, default=4.0,
                   help="islands smaller than this (mm²) are cut away instead of bridged (default 4)")

    g = p.add_argument_group("output")
    g.add_argument("--smoothing", type=float, default=0.15, help="curve smoothing, mm (default 0.15)")
    g.add_argument("--px-per-mm", type=float, default=6, help="working resolution (default 6)")
    g.add_argument("--no-outline", action="store_true", help="don't cut the sheet's outer edge")


def main():
    parser = argparse.ArgumentParser(description="Turn SAMHART images into cut-ready stencils.")
    sub = parser.add_subparsers(required=True, metavar="command")

    p = sub.add_parser("generate", help="make images with SAMHART")
    add_generate_options(p)
    p.set_defaults(func=cmd_generate)

    p = sub.add_parser("convert", help="turn image(s) into stencils")
    p.add_argument("images", nargs="+", help="image file(s): SAMHART output, a photo, a sketch...")
    p.add_argument("--out", help="output folder (default: next to the image)")
    add_convert_options(p)
    p.set_defaults(func=cmd_convert)

    p = sub.add_parser("make", help="generate and convert in one go")
    add_generate_options(p)
    add_convert_options(p)
    p.set_defaults(func=cmd_make)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
