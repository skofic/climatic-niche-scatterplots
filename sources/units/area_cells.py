"""Area climate of the units, part 1: which grid cells each unit's polygon covers, and the EU-Trees4F values there.

A unit's climate is read today at its reference point, which the unit's manager chose (a studied place, or where
the surveyors park; for restricted units often the nearest village). The polygon is the area of the conservation
activity. This script lists, per unit, the 30-arc-second cells (WorldClim 2.1 / CHELSA 2.1 grid) its polygon
intersects with the share of the polygon's area in each, and computes the same area-weighted mean on the 5'
EU-Trees4F historical rasters next to the value at the reference point.

Input:  work/units-geometry.jsonl (sources/units/distance.js: key, point, geometry, restricted; never leaves this machine)
Also written, in the shape of the point samplers so that the units loader reads them the same way:
        work/climate-units-area-eutrees4f.jsonl {key, values} and work/climate-units-area-eutrees4f-future.jsonl
        {key, values: {period: {rcp: {...}}}} (area-weighted means, raster units).
Output: work/units-area-cells.jsonl  {key, point_cell: [i, j], cells: [[i, j, weight], ...]}   (i, j = 30" grid indices
        from (-180, -90), the convention of lib/geometry.js) and work/units-area-eutrees4f.jsonl {key, point: {...}, area: {...}, n}
Usage:  .venv/bin/python -I sources/units/area_cells.py
"""
import json, math, sys
import numpy as np
import rasterio
from shapely.geometry import shape, box
from shapely import make_valid, clip_by_rect, prepared

STEP = 1 / 120
DIR = '/Users/milko/Local/Development/Workshop/EU-Trees4F/Reproducibility_scripts/datasets/climate/historical'
RASTERS = {'bio1.tif': 'bio01', 'bio12.tif': 'bio12', 'bio15.tif': 'bio15', 'temp10_summer.tif': 'tas_summer',
           'prec_summer.tif': 'pr_summer', 'prec_winter.tif': 'pr_winter', 'continentality.tif': 'continentality'}

def cover(g, x0, y0, step):
    """Cells of the grid (origin x0, y0, size step) intersecting g: [(i, j, share of g's area)]."""
    minx, miny, maxx, maxy = g.bounds
    out = []
    prep = prepared.prep(g)   # cells wholly inside need no clipping; the others are clipped by rectangle (fast on large polygons)
    for i in range(math.floor((minx - x0) / step), math.floor((maxx - x0) / step) + 1):
        for j in range(math.floor((miny - y0) / step), math.floor((maxy - y0) / step) + 1):
            r = (x0 + i * step, y0 + j * step, x0 + (i + 1) * step, y0 + (j + 1) * step); b = box(*r)
            if not prep.intersects(b): continue
            a = b.area if prep.contains(b) else clip_by_rect(g, *r).area
            if a > 0: out.append((i, j, a))
    tot = sum(a for _, _, a in out)
    return [(i, j, a / tot) for i, j, a in out] if tot > 0 else []

layers, tf = {}, None
for fn, ind in RASTERS.items():
    with rasterio.open(f'{DIR}/{fn}') as ds:
        tf = ds.transform; arr = ds.read(1).astype('float64')
        if ds.nodata is not None: arr = np.where(arr == ds.nodata, np.nan, arr)
        layers[ind] = arr
H, W = next(iter(layers.values())).shape
# EU-Trees4F stores temperatures x 10 and seasonal precipitation as three-month totals (config/indicators.js applies the
# scaling at load); here point and area are compared in the raster's own units and scaled by the reader of the output.
FDIR = DIR.replace('/historical', '/future/ensemble')
FVARS = {'bio1': 'bio01', 'bio12': 'bio12', 'bio15': 'bio15', 'ci': 'continentality', 'ps': 'pr_summer', 'pw': 'pr_winter', 'ts': 'tas_summer'}
future = {}   # (period, rcp, indicator) -> (transform, array); the future rasters are cropped by a row and a column, so each keeps its own transform
for period in ['1991-2020', '2021-2050', '2051-2080']:
    for rcp in ['rcp45', 'rcp85']:
        for var, ind in FVARS.items():
            with rasterio.open(f'{FDIR}/{var}_ensemble_mean_{rcp}_{period}.tif') as ds:
                arr = ds.read(1).astype('float64'); arr[arr == ds.nodata] = np.nan
                future[(period, rcp, ind)] = (ds.transform, arr)
range_out = open('work/climate-units-area-eutrees4f-range.jsonl', 'w')   # minimum and maximum over the polygon's cells: {key, min, max, min_future, max_future}
hist_out = open('work/climate-units-area-eutrees4f.jsonl', 'w'); fut_out = open('work/climate-units-area-eutrees4f-future.jsonl', 'w')
cells_out = open('work/units-area-cells.jsonl', 'w'); t4_out = open('work/units-area-eutrees4f.jsonl', 'w')
n = 0
for line in open('work/units-geometry.jsonl'):
    u = json.loads(line); g = shape(u['geometry']); fcover = {}
    if not g.is_valid: g = make_valid(g)
    lon, lat = u['point']['coordinates']
    c30 = cover(g, -180, -90, STEP)
    cells_out.write(json.dumps({'key': u['key'], 'point_cell': [math.floor((lon + 180) / STEP), math.floor((lat + 90) / STEP)],
                                'cells': [[i, j, round(w, 6)] for i, j, w in c30]}) + '\n')
    # 5' grid: column i from the left edge, row index from the top
    x0, ytop, s = tf.c, tf.f, tf.a
    c5 = cover(g, x0, ytop - H * s, s)
    def at(col, rowb, ind):
        r = H - 1 - rowb
        return layers[ind][r, col] if 0 <= r < H and 0 <= col < W else float('nan')
    area, pt = {}, {}
    pc, pr = math.floor((lon - x0) / s), math.floor((lat - (ytop - H * s)) / s)
    for ind in layers:
        vals = [(at(i, j, ind), w) for i, j, w in c5]; vals = [(v, w) for v, w in vals if not math.isnan(v)]
        area[ind] = round(sum(v * w for v, w in vals) / sum(w for _, w in vals), 4) if vals else None
        v = at(pc, pr, ind); pt[ind] = None if math.isnan(v) else round(float(v), 4)
    t4_out.write(json.dumps({'key': u['key'], 'point': pt, 'area': area, 'n': len(c5), 'same_cell': len(c5) == 1 and c5[0][:2] == (pc, pr)}) + '\n')
    # the same area means in the shape of the point samplers (sources/climate/eutrees4f/sample*.py), for the loader
    hist_out.write(json.dumps({'key': u['key'], 'values': {k: v for k, v in area.items() if v is not None}}) + '\n')
    lo, hi = {}, {}
    for ind in layers:
        vals = [at(i, j, ind) for i, j, w in c5]; vals = [float(v) for v in vals if not math.isnan(v)]
        if vals: lo[ind] = round(min(vals), 4); hi[ind] = round(max(vals), 4)
    fut, flo, fhi = {}, {}, {}
    for (period, rcp, ind), (ftf, farr) in future.items():
        fh, fw = farr.shape; ck = (ftf.c, ftf.f, ftf.a, fh)
        if ck not in fcover: fcover[ck] = cover(g, ftf.c, ftf.f - fh * ftf.a, ftf.a)
        vals = []
        for i, j, w in fcover[ck]:
            r = fh - 1 - j
            if 0 <= r < fh and 0 <= i < fw and not math.isnan(farr[r, i]): vals.append((farr[r, i], w))
        if vals:
            fut.setdefault(period, {}).setdefault(rcp, {})[ind] = round(sum(v * w for v, w in vals) / sum(w for _, w in vals), 4)
            flo.setdefault(period, {}).setdefault(rcp, {})[ind] = round(float(min(v for v, _ in vals)), 4)
            fhi.setdefault(period, {}).setdefault(rcp, {})[ind] = round(float(max(v for v, _ in vals)), 4)
    fut_out.write(json.dumps({'key': u['key'], 'values': fut}) + '\n')
    range_out.write(json.dumps({'key': u['key'], 'min': lo, 'max': hi, 'min_future': flo, 'max_future': fhi}) + '\n')
    n += 1
print(f'{n} units', file=sys.stderr)
