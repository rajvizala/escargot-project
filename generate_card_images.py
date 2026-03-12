"""
generate_card_images.py
-----------------------
Generates real greeting card artwork for the Escargot web app
using Vertex AI Gemini (the same setup as your notebook).

Run from your local machine where gcloud is authenticated:
    python generate_card_images.py

Output:
    public/cards/card-01.png  through  card-10.png
    public/examples/before-01.png, after-01.png  (×3 pairs)

Prerequisites:
    pip install google-genai pillow
    gcloud auth application-default login
    gcloud auth application-default set-quota-project imagetestproject-489621
"""

import os
import base64
import time
from pathlib import Path
from google import genai
from google.genai import types

# ── Auth (same as your notebook) ──────────────────────────────────────────
os.environ["GOOGLE_CLOUD_PROJECT"]   = "imagetestproject-489621"
os.environ["GOOGLE_CLOUD_LOCATION"]  = "global"
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "True"

client = genai.Client()
MODEL  = "gemini-2.5-flash-image"   # change to gemini-2.5-flash-image if available

# ── Output directories ─────────────────────────────────────────────────────
Path("public/cards").mkdir(parents=True, exist_ok=True)
Path("public/examples").mkdir(parents=True, exist_ok=True)

# ── Style prompt shared by all cards ──────────────────────────────────────
# This is the same style guidance used in lib/vertexai.ts for remixing.
# Keeping it consistent means the before/after pairs look cohesive.
STYLE = """
Flat vector illustration style.
Warm, muted pastel colour palette — cream backgrounds, sage greens, dusty roses, warm ochres.
Clean linework, no gradients, no photorealism.
Serif typography if text is included.
Feels handcrafted but polished — like an independent artist's greeting card.
Square format, 800×800px composition.
White or cream border/margin around the illustration.
NO watermarks. NO text unless specified.
"""

# ── Card definitions ──────────────────────────────────────────────────────
# (output_filename, illustration_prompt)
CARDS = [
    (
        "card-01",
        f"""A greeting card illustration: a single-tier birthday cake with lit candles,
        surrounded by small floating confetti dots and a simple ribbon banner at the top.
        Artist style: Ben Lenovitz. {STYLE}"""
    ),
    (
        "card-02",
        f"""A greeting card illustration: a cluster of pastel balloons tied with a bow,
        drifting upward against a cream background. Simple, joyful, minimal.
        Artist style: War and Peas. {STYLE}"""
    ),
    (
        "card-03",
        f"""A greeting card illustration: a single small plant in a terracotta pot,
        with delicate leaves and a soft warm glow around it. Quiet, comforting.
        Artist style: Sad Ghost Club. {STYLE}"""
    ),
    (
        "card-04",
        f"""A greeting card illustration: a gold star with radiating lines, surrounded by
        small sparkle dots. Clean, celebratory, minimal.
        Artist style: Odd Daughter. {STYLE}"""
    ),
    (
        "card-05",
        f"""A greeting card illustration: a pair of hands holding a small wrapped gift
        with a bow on top. Warm colours, friendly, celebratory.
        Artist style: Toasted by Eli. {STYLE}"""
    ),
    (
        "card-06",
        f"""A greeting card illustration: two cups of coffee or tea side by side,
        steam rising, cosy and warm. A friendship card feeling.
        Artist style: Ben Lenovitz. {STYLE}"""
    ),
    (
        "card-07",
        f"""A humorous greeting card illustration: a calendar with many pages flipped,
        a small embarrassed snail in the corner looking sheepish.
        Funny, self-aware, warm. Artist style: War and Peas. {STYLE}"""
    ),
    (
        "card-08",
        f"""A greeting card illustration: a simple white dove in flight carrying
        a small olive branch. Gentle, peaceful, soft.
        Artist style: Sad Ghost Club. {STYLE}"""
    ),
    (
        "card-09",
        f"""A greeting card illustration: a simple red heart with small radiating lines,
        a classic love/miss you card but with a flat modern illustration style.
        Artist style: Odd Daughter. {STYLE}"""
    ),
    (
        "card-10",
        f"""A greeting card illustration: a single cherry blossom branch with
        pink blooms, minimal, elegant, spring feeling.
        Artist style: Toasted by Eli. {STYLE}"""
    ),
]

# ── Before/After example pairs ─────────────────────────────────────────────
# Each pair shows the same card before and after an AI remix.
# The "after" versions demonstrate the inclusion use cases from the Medium article.
EXAMPLES = [
    (
        "before-01",
        f"""A greeting card illustration: two people (man and woman) dancing together,
        simple silhouettes, anniversary card. Warm ochre and cream tones.
        {STYLE}"""
    ),
    (
        "after-01",  # Remix: "Make it two grooms"
        f"""A greeting card illustration: two men in suits dancing together,
        simple silhouettes, anniversary card. Same warm ochre and cream tones
        as the original. Identical composition, only the figures changed.
        {STYLE}"""
    ),
    (
        "before-02",
        f"""A greeting card illustration: a fluffy golden retriever dog sitting,
        looking happy, birthday card style. Sage green background.
        {STYLE}"""
    ),
    (
        "after-02",  # Remix: "Swap the dog for a cat"
        f"""A greeting card illustration: an orange tabby cat sitting,
        looking happy, birthday card style. Same sage green background.
        Identical composition and framing, only the animal changed.
        {STYLE}"""
    ),
    (
        "before-03",
        f"""A greeting card illustration: a person in army green military uniform
        standing proudly. Thank you / appreciation card. Muted blue background.
        {STYLE}"""
    ),
    (
        "after-03",  # Remix: "Change to a Navy uniform"
        f"""A greeting card illustration: a person in navy blue naval uniform
        standing proudly. Same appreciation card. Same muted blue background.
        Identical composition, only the uniform changed to navy.
        {STYLE}"""
    ),
]

# ── Generation function ────────────────────────────────────────────────────
def generate_image(prompt: str, output_path: str) -> bool:
    """Generate a single image and save it. Returns True on success."""
    print(f"  Generating {output_path}...")
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            )
        )

        for part in response.candidates[0].content.parts:
            if part.inline_data:
                with open(output_path, "wb") as f:
                    f.write(part.inline_data.data)
                print(f"  ✓ Saved {output_path}")
                return True

        print(f"  ✗ No image in response for {output_path}")
        return False

    except Exception as e:
        print(f"  ✗ Error generating {output_path}: {e}")
        return False


# ── Main ────────────────────────────────────────────────────────────────────
def main():
    print("=== Generating Escargot card images via Vertex AI ===\n")

    # Cards
    print(f"Generating {len(CARDS)} card images...\n")
    card_failures = []
    for filename, prompt in CARDS:
        output = f"public/cards/{filename}.png"
        if os.path.exists(output):
            print(f"  ↷ Skipping {output} (already exists)")
            continue
        success = generate_image(prompt, output)
        if not success:
            card_failures.append(filename)
        time.sleep(2)  # Avoid rate limits

    # Examples
    print(f"\nGenerating {len(EXAMPLES)} before/after examples...\n")
    example_failures = []
    for filename, prompt in EXAMPLES:
        output = f"public/examples/{filename}.png"
        if os.path.exists(output):
            print(f"  ↷ Skipping {output} (already exists)")
            continue
        success = generate_image(prompt, output)
        if not success:
            example_failures.append(filename)
        time.sleep(2)

    # Summary
    print("\n=== Summary ===")
    total   = len(CARDS) + len(EXAMPLES)
    failed  = len(card_failures) + len(example_failures)
    success = total - failed
    print(f"Generated: {success}/{total}")

    if card_failures:
        print(f"Failed cards:    {card_failures}")
        print("  → Run again to retry failed images (existing files are skipped)")
    if example_failures:
        print(f"Failed examples: {example_failures}")

    print("\nNext: git add public/cards public/examples && git commit -m 'Add card images'")


if __name__ == "__main__":
    main()
