import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './Writing.module.css'

const forEveryone = [
  {
    id: 1,
    title: "I'm a painter who uses AI. Let me explain before you close this tab.",
    images: [
      'https://res.cloudinary.com/fcwtlbmz/image/upload/v1783096345/out-0_s9qvxc.webp',
      'https://res.cloudinary.com/fcwtlbmz/image/upload/v1783096631/out-0_fv7zad.webp',
      'https://res.cloudinary.com/fcwtlbmz/image/upload/v1783096725/out-0_dfwp1z.webp',
    ],
    content: [
      { type: 'p', text: 'I know. Stay with me.' },
      { type: 'p', text: "The arguments against AI art are real and I'm not going to pretend they aren't. Training large image models consumes enormous amounts of energy. The carbon cost is not nothing, and it's not fully understood yet. There are also legitimate questions about whether those models were trained on artists' work without consent — and if you feel strongly about that, I think that's a reasonable position to hold." },
      { type: 'p', text: "Then there's the other argument: that AI can't make real art because it has no soul. No lived experience. No grief, no obsession. It statistically predicts what pixels should follow other pixels. It has never felt anything about anything." },
      { type: 'p', text: 'I actually agree with this one.' },
      { type: 'p', text: 'Which is why I use it.' },
      { type: 'divider' },
      { type: 'p', text: "I'm a painter. Oils, abstract work, a style I've developed over time." },
      { type: 'p', text: "And I get blocked." },
      { type: 'p', text: "Not creatively blocked in the romantic sense — I don't sit staring at a canvas waiting for inspiration. I mean specifically blocked on decisions. Colour combinations. Whether a composition that works in my head will actually work at scale. Whether a palette I've never tried is worth buying three tubes of paint to test. Whether the thing I'm imagining is interesting or whether I'm just attached to it because I thought of it." },
      { type: 'p', text: "These are real problems and they have a real cost. Paint is expensive. Canvas is expensive. Time spent mixing a colour you end up hating and painting over is time you don't get back." },
      { type: 'divider' },
      { type: 'p', text: "So I started using AI image generation as a workshop tool. Not to make art. To ask questions cheaply." },
      { type: 'p', text: "I can describe a compositional idea in words — dark gold ground, a large enso circle, a band of heavy green across the bottom — and generate twenty variations of that idea in about ninety seconds. I can test five different colour palettes against the same structure. I can see whether something I've been thinking about for weeks is actually worth the canvas it would take to find out." },
      { type: 'images' },
      { type: 'p', text: "The images it produces are not my paintings. They're not even close. They're useful in the same way a rough thumbnail sketch is useful — not as an end point but as a thinking tool." },
      { type: 'p', text: "The AI has no opinion about whether the gold or the magenta is better. It doesn't get attached to an idea. It doesn't have good days and bad days. It just generates, and I look, and I decide. The human judgment is still entirely mine. That's the part that matters." },
      { type: 'divider' },
      { type: 'p', text: "On the environmental point: I hold that concern and I use the tool anyway. I think that's an honest position rather than a hypocritical one. I also eat meat occasionally and take flights. Most of us are navigating real tradeoffs imperfectly. I try to be conscious about when I'm reaching for AI generation and whether it's actually useful, rather than generating hundreds of images I'll never look at. That's not absolution. It's just the reality of trying to use a tool thoughtfully in a world where no tool is clean." },
      { type: 'divider' },
      { type: 'p', text: "AI can't want things. It can't be unsettled by something and need to work out what that means on a canvas. The images it generates are a prompt, not an answer." },
      { type: 'p', text: "But it can help me spend less time stuck on whether magenta or violet is the right ground, and more time actually painting." },
      { type: 'p', text: "That trade works for me." },
    ],
  },
]

const technicalContent = `## TL;DR

Replicate is a cloud API that lets you run open-source machine learning models — including image generation models like Flux, Stable Diffusion, and SDXL — with a single HTTP call and no GPU required. Its killer feature is access to hundreds of community-trained models, including fine-tuned ones trained on specific art styles, without any infrastructure setup.

**Who should read this:** Artists who code, engineers with a creative practice, or anyone who wants to use AI image generation as a rapid-prototyping tool rather than as an endpoint. This post walks through how to use Replicate's Python client to generate images that help you explore composition, colour palette, and visual direction before committing paint to canvas.

---

## Why Replicate Matters

### The problem it solves

If you've tried to run Stable Diffusion locally you know the setup tax. Drivers, VRAM constraints, model weight downloads, scheduler configs — it's a lot of friction before you see a single image. Cloud alternatives like Midjourney and DALL·E are polished but closed: you can't swap in a community fine-tune, you can't call them programmatically in a tight loop, and you have limited control over inference parameters.

Replicate sits in the gap. It exposes ML models as versioned REST endpoints. You pass in a prompt and some parameters, you get back a URL to your generated image. That's it. You can do this from a Python script, a Jupyter notebook, or a curl command.

For using AI generation as a **painting ideation tool** specifically — generating 20 compositional variations in a few minutes, testing how a colour palette reads before mixing paint, exploring whether a motif works at different scales — Replicate's programmatic access and model variety make it genuinely the right tool.

### When it's *not* a good fit

- **You need sub-second latency.** Cold starts on Replicate can be 10–30 seconds for larger models. It's not suitable for real-time interactive applications.
- **You're generating at high volume on a budget.** Replicate bills per second of GPU time. Running thousands of generations daily adds up fast — at that scale, self-hosting on a rented GPU is more economical.
- **You need guaranteed output consistency for production.** Model versions are pinned, but outputs are non-deterministic unless you fix your seed. Don't build a user-facing product on top of Replicate without accounting for this.
- **You want fine-grained training control.** Replicate has a fine-tuning API (Trainings), but if you're doing serious LoRA or Dreambooth work with custom datasets, you'll have more control running Kohya locally or on a cloud VM.

---

## Getting Started

### Prerequisites

- Python 3.8+
- A Replicate account: [replicate.com](https://replicate.com)
- Your API token from [replicate.com/account](https://replicate.com/account)

### Installation

\`\`\`bash
pip install replicate
export REPLICATE_API_TOKEN=your_token_here
\`\`\`

### Minimal working example

This is self-contained and runnable. It calls Flux Schnell — currently one of the fastest and most capable open models on the platform — and saves the output image locally.

\`\`\`python
import replicate
import httpx
import pathlib

output = replicate.run(
    "black-forest-labs/flux-schnell",
    input={
        "prompt": "abstract painting, deep magenta ground, white circuit-board linework, gestural oil paint texture",
        "num_outputs": 1,
        "aspect_ratio": "3:4",
        "output_format": "jpg",
    }
)

# output is a list of FileOutput objects; index 0 is the first image
image_bytes = output[0].read()
pathlib.Path("output.jpg").write_bytes(image_bytes)
print("Saved to output.jpg")
\`\`\`

Run it. You should have a generated image in under 30 seconds.

---

## Core Concepts

### 1. Models and Versions

Every model on Replicate has a unique identifier in the format \`owner/model-name\` and optionally a pinned version hash: \`owner/model-name:sha256hash\`.

\`\`\`python
# Unpinned — always runs the latest published version
replicate.run("black-forest-labs/flux-schnell", input={...})

# Pinned — production-safe, result won't change if the author pushes an update
# This is the non-obvious line: version hashes are long SHA256 strings,
# find them on the model's "Versions" tab on replicate.com
replicate.run(
    "black-forest-labs/flux-schnell:f2ab8a5bfe79f02f0789a146cf5e73d2a4ff2684a98c2b303d1e1ff3814271db",
    input={...}
)
\`\`\`

> **Gotcha:** If you're using unpinned model references in anything you run repeatedly, a model author pushing a new version can silently change your outputs. Pin your versions for any workflow you care about reproducing.

---

### 2. Async vs Sync Runs

\`replicate.run()\` is synchronous — it blocks until the prediction is complete. For generating a single image this is fine. For generating batches, you want async.

\`\`\`python
import asyncio
import replicate

async def generate(prompt: str, index: int):
    output = await replicate.async_run(
        "black-forest-labs/flux-schnell",
        input={"prompt": prompt, "num_outputs": 1, "aspect_ratio": "3:4"}
    )
    image_bytes = output[0].read()
    # Write each result to a numbered file — useful for comparing variations side by side
    pathlib.Path(f"variation_{index:02d}.jpg").write_bytes(image_bytes)
    print(f"Done: variation_{index:02d}.jpg")

prompts = [
    "abstract, magenta ground, enso circle, circuit linework, oil paint",
    "abstract, ochre ground, teal enso circle, dark horizontal band, oil paint",
    "abstract, deep navy ground, gold luminous cloud form, concentric spiral, oil paint",
]

asyncio.run(asyncio.gather(*[generate(p, i) for i, p in enumerate(prompts)]))
\`\`\`

> **Gotcha:** Replicate's free tier has a concurrency limit. If you fire off 20 simultaneous async requests you may hit rate limits. Wrap your gather with a semaphore (\`asyncio.Semaphore(5)\`) to throttle concurrent requests.

---

### 3. Controlling Outputs with Seeds

By default, every run produces a different image even with an identical prompt. Seeds let you lock in a composition and iterate on just one variable at a time — essential when you're using generation to genuinely workshop an idea rather than generate random variations.

\`\`\`python
BASE_SEED = 42

# Establish a composition you like, then vary only the colour palette
for palette_prompt in [
    "deep magenta and black",
    "electric violet and charcoal",
    "gold ochre and navy blue",
]:
    output = replicate.run(
        "black-forest-labs/flux-schnell",
        input={
            "prompt": f"abstract painting, {palette_prompt} palette, circuit-board linework, gestural oil paint texture, enso circle",
            "seed": BASE_SEED,  # same seed = same underlying composition structure
            "num_outputs": 1,
            "aspect_ratio": "3:4",
        }
    )
    # ... save output
\`\`\`

> **Gotcha:** Seeds are not portable across model versions. A seed that gives you a composition you love on version X may produce something completely different on version Y. When you find a good seed, note the model version hash alongside it.

---

### 4. Fine-Tuned Models and the Trainings API

The most powerful feature for artists is Replicate's hosted fine-tuning. You can upload a dataset of your own paintings and train a LoRA adapter that encodes your visual style as a trigger word — then run it exactly like any other model.

\`\`\`python
# After training completes, your fine-tuned model runs identically to any other
# The trigger word (here: SAMHART) activates your learned style
output = replicate.run(
    "your-username/your-finetuned-model",  # created by the Trainings API
    input={
        # Trigger word must appear in the prompt — without it the model ignores your style
        "prompt": "SAMHART style abstract painting, deep violet ground, white circuit-board panel, enso circle",
        "num_outputs": 4,
        "aspect_ratio": "3:4",
    }
)
\`\`\`

> **Gotcha:** The Trainings API requires your dataset images and captions to be in a \`.zip\` file uploaded to a publicly accessible URL (an S3 bucket, GitHub release, or similar). Replicate cannot fetch from a local path or a private URL. If your dataset contains personal work you're not ready to make public, use a pre-signed S3 URL with a short expiry window — it only needs to be accessible during the training job.

---

## Real-World Project: The Painting Idea Workshop Script

This is the actual pattern used to generate compositional references before starting new canvases. The script takes a set of base compositional ideas and generates a grid of variations, saving them in an organised directory structure so you can flip through them as references.

\`\`\`python
import asyncio
import pathlib
import replicate
import httpx

# ── Config ──────────────────────────────────────────────────────────────────
MODEL    = "black-forest-labs/flux-schnell"
SEED     = 1984          # change this to explore a different composition family
OUTDIR   = pathlib.Path("workshop_output")
OUTDIR.mkdir(exist_ok=True)

# Define your ideation axes: fix one, vary the other
GROUNDS = [
    "deep magenta and dark plum ground",
    "dark gold and ochre ground",
    "deep ultramarine and navy blue ground",
    "near-black charcoal ground",
]

MOTIFS = [
    "enso circle and circuit-board linework panels",
    "gestural horizontal impasto bars and vertical stripe",
    "concentric spiral and nested rectangle forms",
]

# ── Generation ───────────────────────────────────────────────────────────────
async def generate_one(ground: str, motif: str, index: int, sem: asyncio.Semaphore):
    prompt = (
        f"abstract oil painting, {ground}, {motif}, "
        "gestural brushwork, palette knife texture, "
        "no text, no figures, purely abstract"
    )
    async with sem:  # throttle to 4 concurrent requests
        output = await replicate.async_run(
            MODEL,
            input={
                "prompt": prompt,
                "seed": SEED,
                "num_outputs": 1,
                "aspect_ratio": "3:4",
                "output_format": "jpg",
            }
        )
    image_bytes = output[0].read()
    filename = OUTDIR / f"idea_{index:03d}_g{GROUNDS.index(ground)}_m{MOTIFS.index(motif)}.jpg"
    filename.write_bytes(image_bytes)
    print(f"✓ {filename.name}")

async def main():
    sem = asyncio.Semaphore(4)
    tasks = [
        generate_one(g, m, i, sem)
        for i, (g, m) in enumerate(
            (g, m) for g in GROUNDS for m in MOTIFS
        )
    ]
    await asyncio.gather(*tasks)
    print(f"\\nDone. {len(tasks)} images saved to ./{OUTDIR}/")

asyncio.run(main())
\`\`\`

Running this generates a 4×3 matrix of ideas (12 images) in roughly 60–90 seconds. The filename encodes which ground/motif combination produced each result, so you can quickly identify which pairings are worth developing further.

---

## Common Pitfalls

| Pitfall | Why it happens | Fix |
|---|---|---|
| \`ReplicateError: You have exceeded your free tier limit\` | Free accounts have strict rate and spend limits | Add a payment method; set a monthly spend cap in account settings |
| Output URL returns 404 after 24 hours | Replicate output URLs expire by default | Download and save the bytes immediately in your script; don't store the URL |
| Identical prompt, wildly different images | No seed set; generation is stochastic by default | Set \`"seed": <integer>\` in your input dict |
| Fine-tune trigger word has no effect | Trigger word missing from prompt, or model not loaded correctly | Ensure the exact token from training appears verbatim in the prompt string |
| Async requests all time out simultaneously | Too many concurrent predictions hitting rate limits | Use \`asyncio.Semaphore(4)\` to cap concurrency |
| \`model_version\` not found error | Pinned version hash is stale or incorrectly copied | Copy the full hash from the model's Versions tab; hashes are case-sensitive |
| Output looks nothing like your fine-tune style | Training dataset too small or captions too generic | Aim for 15–30 images minimum; use consistent, specific vocabulary in captions |

---

## Best Practices

**Prompt structure matters more than length.** Replicate models respond better to noun-phrase prompts than sentence descriptions. Lead with the subject, follow with style and medium, end with negative constraints. \`"abstract oil painting, deep magenta ground, white circuit linework, no text, no figures"\` outperforms \`"please generate an abstract painting that has a deep magenta background with circuit board style lines drawn on it"\`.

**Store your prediction IDs.** Every \`replicate.run()\` call creates a Prediction object. Log the prediction ID alongside your output file. If something goes wrong or you want to inspect the exact parameters used, you can retrieve the full prediction via \`replicate.predictions.get(id)\`.

**Use environment variables for your token, always.** Never hardcode \`REPLICATE_API_TOKEN\` in source code. If this ends up in a repo — even a private one — rotate it immediately at replicate.com/account.

**Set spend caps.** Replicate's account settings let you set a monthly spend limit. Set one before you start running batch jobs. An asyncio bug that removes your semaphore and fires 500 concurrent requests is a bad morning.

**Output format choice affects cost and quality.** \`webp\` is smaller and faster to transfer. \`jpg\` has the broadest compatibility. \`png\` is lossless but large. For ideation workflows where you're generating many images to compare, \`jpg\` at quality 80 is a sensible default.

**When fine-tuning: caption for separation, not description.** The goal of captions is to teach the model which visual elements belong to *your style* (and should activate on the trigger word) versus which elements are content it should accept as instruction. Describe structure, colour, and motif vocabulary explicitly. Vague captions like \`"an abstract painting"\` teach the model nothing useful.

---

## When to Use Replicate vs. Alternatives

| Scenario | Replicate | Midjourney | DALL·E 3 (OpenAI) | Local (ComfyUI / A1111) |
|---|---|---|---|---|
| Programmatic batch generation | ✅ First choice | ❌ No API (Discord only) | ✅ Good | ✅ Good |
| Fine-tune on your own art style | ✅ Trainings API | ❌ Not possible | ❌ Not possible | ✅ Best control |
| Fastest time to first image | ⚠️ Cold starts | ✅ Fast | ✅ Fast | ⚠️ Setup cost |
| No GPU / no local setup | ✅ | ✅ | ✅ | ❌ Requires hardware |
| Widest model selection | ✅ Hundreds of models | ❌ Single model | ❌ Single model | ✅ Any HuggingFace model |
| Cost at scale (1000s of images/day) | ⚠️ Gets expensive | ⚠️ Subscription caps | ⚠️ Per-image pricing | ✅ Cheapest |
| Prompt-to-image quality (OOTB) | ✅ Flux is excellent | ✅ Excellent | ✅ Excellent | ✅ Depends on model |
| Suitable for production app | ⚠️ Check SLA | ❌ | ✅ | ⚠️ You own the ops |

**The honest summary:** Replicate is the right tool when you want programmatic access to a wide range of models without managing infrastructure, especially when fine-tuned models are part of your workflow. If you just want great images fast and don't need to code, Midjourney is still the better creative experience. If you're generating at industrial scale, the economics eventually favour self-hosting.`

const technical = [
  {
    id: 1,
    title: 'Using Replicate to Workshop Painting Ideas with AI Image Generation',
    markdown: technicalContent,
  },
]

export default function Writing() {
  const [tab, setTab] = useState('everyone')

  const posts = tab === 'everyone' ? forEveryone : technical

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <span className={styles.title}>Writing</span>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'everyone' ? styles.tabActive : ''}`}
              onClick={() => setTab('everyone')}
            >
              For Everyone
            </button>
            <button
              className={`${styles.tab} ${tab === 'technical' ? styles.tabActive : ''}`}
              onClick={() => setTab('technical')}
            >
              Technical
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className={styles.empty}>Coming soon.</p>
        ) : tab === 'everyone' ? (
          forEveryone.map(post => (
            <article key={post.id} className={styles.postWrap}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <div className={styles.body}>
                {post.content.map((block, i) => {
                  if (block.type === 'p') return <p key={i}>{block.text}</p>
                  if (block.type === 'divider') return <hr key={i} className={styles.divider} />
                  if (block.type === 'images') return (
                    <div key={i} className={styles.imageRow}>
                      {post.images.map((src, j) => (
                        <img key={j} src={src} alt="" loading="lazy" />
                      ))}
                    </div>
                  )
                  return null
                })}
              </div>
            </article>
          ))
        ) : (
          technical.map(post => (
            <article key={post.id} className={styles.postWrap}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <div className={`${styles.body} ${styles.markdown}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.markdown}
                </ReactMarkdown>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  )
}
