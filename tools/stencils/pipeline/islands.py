"""Stage 3: find islands and hold them in place with bridges.

An island is a piece of stencil sheet that isn't connected to the outer
edge, like the middle of an O. Cut it as-is and it falls out. We find them
by labelling every connected region of sheet; the region that touches the
corner is the main sheet, and every other region is an island.
"""

import cv2
import numpy as np
from scipy import ndimage

# Sheet pieces only hold together if they share an edge, not just a corner,
# so count neighbours up/down/left/right only.
EDGE_NEIGHBOURS = ndimage.generate_binary_structure(2, 1)

LARGE_ISLAND_MM2 = 150  # islands bigger than this get extra bridges


def find_islands(paint):
    """Label sheet regions. Returns (labels, main_label, island_labels)."""
    labels, count = ndimage.label(~paint, structure=EDGE_NEIGHBOURS)
    main = labels[0, 0]  # the margin guarantees the corner is main sheet
    return labels, main, [n for n in range(1, count + 1) if n != main]


def _bridge_anchors(island_ys, island_xs, dist, how_many, slack_px):
    """Pick where bridges start: short bridges, spread as far apart as possible.

    The first bridge starts at the island's closest point to the main sheet.
    Each extra bridge starts at the point farthest from the bridges so far,
    among points that are nearly as close (within `slack_px`), so a ring
    gets bridges on opposite sides rather than bunched together.
    """
    d = dist[island_ys, island_xs]
    first = int(np.argmin(d))
    anchors = [first]
    candidates = np.nonzero(d <= d[first] + slack_px)[0]
    min_gap = 0.3 * max(np.ptp(island_ys), np.ptp(island_xs))
    gap = np.full(len(candidates), np.inf)
    while len(anchors) < how_many:
        a = anchors[-1]
        gap = np.minimum(gap, np.hypot(island_ys[candidates] - island_ys[a],
                                       island_xs[candidates] - island_xs[a]))
        best = int(np.argmax(gap))
        if gap[best] < min_gap:
            break
        anchors.append(candidates[best])
    return [(island_ys[i], island_xs[i]) for i in anchors]


def add_bridges(paint, px_per_mm, bridge_mm=1.5, min_island_mm2=4.0, bridges_per_large_island=2):
    """Connect every island to the main sheet.

    Each bridge is a straight strip of sheet from the island's nearest point
    to the main sheet. Islands smaller than `min_island_mm2` are too small to
    bridge neatly, so they're cut away instead (they become paint).

    Returns (new_paint, bridge_mask, report).
    """
    paint = paint.copy()
    bridges = np.zeros(paint.shape, dtype=np.uint8)
    width = max(1, round(bridge_mm * px_per_mm))
    min_px = min_island_mm2 * px_per_mm ** 2
    large_px = LARGE_ISLAND_MM2 * px_per_mm ** 2
    report = {"islands_found": 0, "islands_removed": 0, "bridges_added": 0}

    labels, main, islands = find_islands(paint)
    report["islands_found"] = len(islands)
    if not islands:
        return paint, bridges > 0, report

    # For every pixel: how far is the main sheet, and which main pixel is nearest?
    dist, (near_y, near_x) = ndimage.distance_transform_edt(labels != main, return_indices=True)
    slices = ndimage.find_objects(labels)

    for n in islands:
        sl = slices[n - 1]
        ys, xs = np.nonzero(labels[sl] == n)
        ys, xs = ys + sl[0].start, xs + sl[1].start
        if len(ys) < min_px:
            paint[ys, xs] = True
            report["islands_removed"] += 1
            continue
        how_many = bridges_per_large_island if len(ys) >= large_px else 1
        for y, x in _bridge_anchors(ys, xs, dist, how_many, slack_px=3 * px_per_mm):
            cv2.line(bridges, (int(x), int(y)), (int(near_x[y, x]), int(near_y[y, x])), 255, width)
            report["bridges_added"] += 1

    paint[bridges > 0] = False

    # Check our work: there should be nothing left that falls out.
    _, _, remaining = find_islands(paint)
    report["islands_remaining"] = len(remaining)
    return paint, bridges > 0, report
