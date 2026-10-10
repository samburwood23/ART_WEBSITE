"""Stage 4: trace the paint mask into SVG files measured in millimetres.

Every boundary between paint and sheet becomes a cut line. The cut file
uses red hairlines, which is what laser services and Cricut Design Space
expect. A filled preview shows what the sprayed result will look like.
"""

import cv2
import numpy as np
from PIL import Image


def trace(paint, px_per_mm, tolerance_mm=0.15):
    """Return the outlines as lists of (x, y) points in millimetres.

    `tolerance_mm` controls smoothing: the traced line may wander this far
    from the pixel edge in exchange for fewer, cleaner points.
    """
    contours, _ = cv2.findContours(paint.astype(np.uint8), cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    outlines = []
    for contour in contours:
        simplified = cv2.approxPolyDP(contour, tolerance_mm * px_per_mm, True).reshape(-1, 2)
        if len(simplified) >= 3:
            outlines.append((simplified + 0.5) / px_per_mm)
    return outlines


def _path_data(outlines):
    return " ".join(
        "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in outline) + " Z"
        for outline in outlines
    )


def write_cut_svg(path, outlines, sheet_w_mm, sheet_h_mm, sheet_outline=True):
    outline_rect = (
        f'  <rect x="0" y="0" width="{sheet_w_mm}" height="{sheet_h_mm}" '
        f'fill="none" stroke="#ff0000" stroke-width="0.1"/>\n' if sheet_outline else ""
    )
    path.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{sheet_w_mm}mm" height="{sheet_h_mm}mm" '
        f'viewBox="0 0 {sheet_w_mm} {sheet_h_mm}">\n'
        f"{outline_rect}"
        f'  <path d="{_path_data(outlines)}" fill="none" stroke="#ff0000" stroke-width="0.1"/>\n'
        "</svg>\n"
    )


def write_preview_svg(path, outlines, sheet_w_mm, sheet_h_mm):
    path.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{sheet_w_mm}mm" height="{sheet_h_mm}mm" '
        f'viewBox="0 0 {sheet_w_mm} {sheet_h_mm}">\n'
        f'  <rect width="{sheet_w_mm}" height="{sheet_h_mm}" fill="#ffffff"/>\n'
        f'  <path d="{_path_data(outlines)}" fill="#000000" fill-rule="evenodd"/>\n'
        "</svg>\n"
    )


def save_mask_png(path, paint):
    """Black where paint goes through, white where the sheet stays."""
    Image.fromarray(np.where(paint, 0, 255).astype(np.uint8)).save(path)


def save_islands_png(path, paint_before, paint_after, bridges):
    """Debug view: islands in red, removed islands in orange, bridges in blue."""
    from .islands import find_islands
    labels, main, _ = find_islands(paint_before)
    rgb = np.full(paint_before.shape + (3,), 255, dtype=np.uint8)
    rgb[paint_before] = (0, 0, 0)
    island = (labels != main) & ~paint_before
    rgb[island & ~paint_after] = (220, 30, 30)
    rgb[island & paint_after] = (255, 150, 0)
    rgb[bridges & paint_before] = (30, 90, 230)
    Image.fromarray(rgb).save(path)
