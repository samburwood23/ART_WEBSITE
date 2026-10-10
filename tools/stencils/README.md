# SAMHART stencil pipeline

Turns images from your SAMHART model on Replicate into cut-ready stencil SVGs
for a laser cutter or Cricut, with bridges added automatically so no pieces
fall out.

It works on any image, not only SAMHART output, so you can also feed it
photos, scans of sketches, or a photo of one of your paintings.

## One-time setup

You only do this once per computer. Commands go in the **Terminal** app
(on Mac: Cmd+Space, type "Terminal"). On Windows, use **PowerShell**.

**1. Check you have Python 3.10 or newer**

```bash
python3 --version
```

If it says "command not found", install it from [python.org](https://www.python.org/downloads/).
On Windows, type `python` wherever this guide says `python3`.

**2. Go to this folder**

```bash
cd path/to/art_website/tools/stencils
```

Tip: type `cd ` (with a space), drag the `stencils` folder onto the Terminal
window, and press Enter.

**3. Make a virtual environment and install the libraries**

A virtual environment is a private box of Python libraries for this project,
so it can't clash with anything else on your computer.

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**4. Set your API token**

Get your token from [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens).
Never paste it into a file in this repo.

```bash
export REPLICATE_API_TOKEN=r8_your_token_here          # Mac
$env:REPLICATE_API_TOKEN="r8_your_token_here"          # Windows
```

This only lasts until you close the Terminal window. To make it permanent on
a Mac, add the `export` line to the end of `~/.zshrc`.

**Check your spend cap.** Each image costs a few pence. Set a monthly limit
in your Replicate account settings before running big batches.

## Every time you use it

```bash
cd path/to/art_website/tools/stencils
source .venv/bin/activate          # Windows: .venv\Scripts\Activate.ps1
```

Then do one of the following.

**Generate and convert in one step:**

```bash
python3 stencil.py make "circuit traces radiating from an enso circle" --num 4
```

**Or do it in two steps** to pick your favourite image before converting:

```bash
python3 stencil.py generate "circuit traces radiating from an enso circle" --num 4
python3 stencil.py convert runs/<the new folder>/generated_02.png
```

**Convert your own image:**

```bash
python3 stencil.py convert ~/Desktop/sketch.jpg --invert
```

Everything goes into the `runs/` folder, one folder per run. Git ignores it,
so images don't end up on the website.

## What you get

For every stencil there's a folder with a picture of each pipeline step:

| File | What it shows |
| --- | --- |
| `1_source.png` | The image placed on your sheet, with the margin |
| `2_black_and_white.png` | Split into paint (black) and sheet (white) |
| `3_cleaned.png` | Slivers, specks and too-thin strips removed |
| `4_islands.png` | **Red** = pieces that would fall out, **blue** = bridges added, **orange** = tiny pieces cut away |
| `5_final.png` | The finished stencil. Black is where the paint goes |
| `stencil_cut.svg` | **The file you send to the cutter.** Red hairlines in millimetres |
| `stencil_preview.svg` | A filled preview of the sprayed result |
| `report.json` | Island counts and every setting used, so you can recreate it |

`generation.json` in the run folder records the prompt, the seed settings and
the Replicate prediction ID.

## How the pipeline works

A pipeline is a chain of small steps, where each step takes the previous
step's output. Keeping the steps separate means you can test each one,
see its result, and swap one out without touching the others. Each stage is
its own file in `pipeline/`:

1. **`generate.py`** sends your prompt to SAMHART. It adds your trigger word
   and stencil wording ("bold black and white, no gradients...") so the model
   draws shapes that can be cut, then downloads the images straight away,
   because Replicate's links expire.
2. **`prepare.py`** places the image on the sheet in millimetres. A slight
   blur smooths the edges, then each pixel is classed as paint or sheet.
   Otsu's method picks the light/dark split point automatically from the
   image's histogram. Morphology removes lines too thin to cut: "opening"
   erases thin paint lines and "closing" erases thin sheet strips.
3. **`islands.py`** labels every connected region of sheet. The region
   touching the corner is the main sheet, and anything else is an island. For each
   island, a *distance transform* finds its nearest point to the main sheet,
   and a straight bridge is drawn there. Large islands get a second bridge,
   as far from the first as possible. Then it re-checks that no islands are
   left.
4. **`vectorize.py`** traces the edge of every black region into outlines,
   simplifies them into smooth paths, and writes the SVGs.

`stencil.py` is the conductor: it reads your options and runs the stages in
order.

Good next experiments if you want to learn by changing things:
- Edit `STENCIL_STYLE` in `generate.py` to change how every prompt is styled.
- Try `--threshold 100` and then `--threshold 160` on the same image and compare `2_black_and_white.png`.
- Add a new stage. For example, `pipeline/combine.py` could merge a SAMHART
  stencil with a circuit-trace stencil on one sheet.

## Options

Run `python3 stencil.py convert --help` to see them all. These are the ones
you'll use most:

| Option | Default | What it does |
| --- | --- | --- |
| `--num 4` | 1 | How many images to generate (1–4) |
| `--seed 42` | random | Recreate the same image later |
| `--lora-scale 1.3` | 1.0 | How strongly your style is applied |
| `--width 300 --height 400` | 210 × 297 (A4) | Sheet size in mm |
| `--margin 20` | 15 | Solid border around the design, in mm |
| `--invert` | off | Spray the light parts instead of the dark |
| `--threshold 140` | automatic | 0–255; higher gives more paint |
| `--min-feature 2` | 1.0 | Thinnest line kept, in mm. **Use 2+ for hand cutting** |
| `--bridge-width 2` | 1.5 | Thicker bridges are sturdier but more visible |
| `--islands keep` | bridge | Don't add bridges. Pieces fall out, and you keep them as masks |
| `--no-outline` | off | Don't cut the outer edge of the sheet |

## Cutting tips

- **Material:** 0.19–0.25 mm mylar is reusable and survives spray paint.
- **Cricut / Silhouette:** import `stencil_cut.svg` and check the size reads
  210 × 297 mm (or your size) before cutting.
- **Laser service:** send `stencil_cut.svg`. Red 0.1 mm hairlines are the
  usual "cut" convention, but check your service's guidelines.
- A light coat of repositionable spray mount on the back keeps fine edges
  sharp.

## If something goes wrong

| Problem | Fix |
| --- | --- |
| `REPLICATE_API_TOKEN is not set` | Do setup step 4 again (it resets when Terminal closes) |
| `No module named ...` | You forgot `source .venv/bin/activate` |
| Replicate says an input is invalid | Your model's inputs may differ. Check the API tab on your model's Replicate page and edit `inputs` in `generate.py` |
| Stencil is mostly black or mostly white | Try `--threshold`, or `--invert` |
| Too many tiny bridges | Raise `--min-feature` and `--min-island` to simplify the design |
| Images are grey and soft, not graphic | Raise `--lora-scale` a little, or add "linocut" or "screen print" to the prompt |
