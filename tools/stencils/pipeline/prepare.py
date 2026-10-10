"""Stage 2: turn an image into a clean black/white paint mask.

From here on the stencil is a grid of True/False values called `paint`:
True means paint goes through (the hole you cut out), False means the
stencil sheet stays. Everything is measured in millimetres and converted
to pixels with `px_per_mm`.
"""

import cv2
import numpy as np
from PIL import Image, ImageOps


def load_on_sheet(path, sheet_w_mm, sheet_h_mm, margin_mm, px_per_mm):
    """Load an image as greyscale and fit it inside the sheet's margins.

    Returns the greyscale sheet and the (x, y, w, h) box the image sits in.
    """
    w = round(sheet_w_mm * px_per_mm)
    h = round(sheet_h_mm * px_per_mm)
    m = round(margin_mm * px_per_mm)

    image = Image.open(path).convert("L")
    fitted = ImageOps.contain(image, (w - 2 * m, h - 2 * m), Image.LANCZOS)
    sheet = Image.new("L", (w, h), 255)
    x = (w - fitted.width) // 2
    y = (h - fitted.height) // 2
    sheet.paste(fitted, (x, y))
    return np.array(sheet), (x, y, fitted.width, fitted.height)


def threshold(grey, box, px_per_mm, level=None, invert=False, blur_mm=0.3):
    """Split the image into paint (dark) and sheet (light).

    A small blur first smooths jagged edges. With no `level`, Otsu's method
    picks the split point by looking at the image's brightness histogram.
    """
    sigma = blur_mm * px_per_mm
    if sigma > 0:
        grey = cv2.GaussianBlur(grey, (0, 0), sigma)
    if level is None:
        x, y, w, h = box
        level, _ = cv2.threshold(grey[y:y + h, x:x + w], 0, 255,
                                 cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    paint = grey < level
    if invert:
        x, y, w, h = box
        paint[y:y + h, x:x + w] = ~paint[y:y + h, x:x + w]
    return paint


def clean(paint, px_per_mm, margin_mm, min_feature_mm=1.0, min_hole_mm2=2.0):
    """Remove detail that can't be cut or sprayed cleanly.

    - Paint lines thinner than `min_feature_mm` disappear (morphological opening).
    - Sheet strips thinner than `min_feature_mm` disappear too (closing), since
      they would tear.
    - Holes smaller than `min_hole_mm2` are filled in.
    - The margin around the edge is always kept as solid sheet.
    """
    k = max(1, round(min_feature_mm * px_per_mm))
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
    mask = paint.astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    paint = mask > 0

    count, labels, stats, _ = cv2.connectedComponentsWithStats(paint.astype(np.uint8), connectivity=8)
    too_small = stats[:, cv2.CC_STAT_AREA] < min_hole_mm2 * px_per_mm ** 2
    too_small[0] = False  # label 0 is the background, not a hole
    paint[too_small[labels]] = False

    m = round(margin_mm * px_per_mm)
    paint[:m, :] = paint[-m:, :] = paint[:, :m] = paint[:, -m:] = False
    return paint
