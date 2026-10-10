"""Stage 1: generate images with the SAMHART model on Replicate."""

import json
import os
import urllib.request
from pathlib import Path

# Your fine-tuned model on Replicate (samburwood23/art). If you train a new
# version, paste its version hash here.
MODEL_VERSION = "83c1d8ab5db77b2ce2a81ecff7a813f0dba258e53736b42c014f1e1fa75893f8"

TRIGGER_WORD = "SAMHART"

# Added to every prompt so the model draws something that can be cut:
# solid shapes, two tones, nothing in between. It only says what we *want*:
# Flux (the model SAMHART is built on) has no real sense of "no", so
# "no gradients" can actually make gradients more likely.
STENCIL_STYLE = (
    "two-colour stencil print, flat solid black ink on plain white paper, "
    "thick bold lines, chunky shapes, crisp hard edges, graphic"
)


def build_prompt(prompt, stencil_style=True):
    if TRIGGER_WORD not in prompt:
        prompt = f"{TRIGGER_WORD} style, {prompt}"
    if stencil_style:
        prompt = f"{prompt}, {STENCIL_STYLE}"
    return prompt


def generate(prompt, out_dir, num_outputs=1, seed=None, aspect_ratio="2:3",
             lora_scale=1.0, guidance=3.5, stencil_style=True):
    """Run SAMHART and save the images into out_dir. Returns their paths."""
    if not os.environ.get("REPLICATE_API_TOKEN"):
        raise SystemExit(
            "REPLICATE_API_TOKEN is not set. See 'Set your API token' in README.md."
        )
    import replicate  # imported here so 'convert' works without it installed

    inputs = {
        "prompt": build_prompt(prompt, stencil_style),
        "num_outputs": num_outputs,
        "aspect_ratio": aspect_ratio,
        "output_format": "png",
        "lora_scale": lora_scale,
        "guidance_scale": guidance,
    }
    if seed is not None:
        inputs["seed"] = seed

    print(f"Asking SAMHART for {num_outputs} image(s)...")
    print(f"  prompt: {inputs['prompt']}")
    prediction = replicate.predictions.create(version=MODEL_VERSION, input=inputs)
    prediction.wait()
    if prediction.status != "succeeded":
        raise SystemExit(f"Replicate prediction {prediction.id} {prediction.status}: {prediction.error}")

    outputs = prediction.output if isinstance(prediction.output, list) else [prediction.output]
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Replicate's output URLs expire, so download the images straight away.
    paths = []
    for i, url in enumerate(outputs, start=1):
        path = out_dir / f"generated_{i:02d}.png"
        with urllib.request.urlopen(str(url)) as response:
            path.write_bytes(response.read())
        paths.append(path)
        print(f"  saved {path}")

    # Keep a record so you can recreate or look up any image later.
    (out_dir / "generation.json").write_text(json.dumps({
        "prediction_id": prediction.id,
        "model_version": MODEL_VERSION,
        "input": inputs,
        "images": [p.name for p in paths],
    }, indent=2))
    return paths
