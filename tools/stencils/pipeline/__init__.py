"""SAMHART stencil pipeline.

Each stage lives in its own module and does one job:

    generate   - ask the SAMHART model on Replicate for an image
    prepare    - turn any image into a clean black/white "paint" mask
    islands    - find pieces that would fall out, and add bridges
    vectorize  - trace the mask into SVG cut paths, in millimetres
"""
