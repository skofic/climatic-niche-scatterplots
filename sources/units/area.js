// Area climate of the units, part 3: the climate of each unit's AREA on the two 1 km grids, every period, in the
// shape the loader stores (properties.<source>.<period>[.<model>.<ssp>] keyed by the dictionary terms).
// The area value of an indicator is the mean over the 30″ cells the unit's polygon intersects, weighted by the share
// of the polygon in each (sources/units/area_cells.py); derived indicators are derived per cell, then averaged.
// Cells without a value (sea, outside the grid) are left out of the mean. Also the elevation at the reference point's
// cell and over the area (WorldClim elevation layer).
// READS ONLY: nothing is written to the database. Output: work/units-area.jsonl
//   { key, n, properties: { worldclim: {...}, chelsa: {...} }, elevation: { point, area } }
// Usage: node sources/units/area.js     (after area_cells.py; sources/units/load.js reads the output)
import { readFileSync, writeFileSync } from 'node:fs'
import { connect, loadCredentials, explain } from '../../lib/db.js'
import { cellPolygon, geometryHash, RADIUS_30S } from '../../lib/geometry.js'
import { nestFuture, toGids } from '../../lib/records.js'
import { SOURCES } from '../../config/indicators.js'
import { fetchCells } from '../climate/geoservice/lookup.js'

const lines = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
const STEP = 2 * RADIUS_30S
const keyOf = (i, j) => geometryHash(cellPolygon(Number((-180 + (i + 0.5) * STEP).toFixed(6)), Number((-90 + (j + 0.5) * STEP).toFixed(6)), RADIUS_30S))
try {
  const { db, collections } = connect(loadCredentials())
  const units = lines('work/units-area-cells.jsonl')
  const keys = new Map()
  for (const u of units) for (const [i, j] of [u.point_cell, ...u.cells]) if (!keys.has(`${i},${j}`)) keys.set(`${i},${j}`, keyOf(i, j))
  const all = [...new Set(keys.values())]
  console.log(`${units.length} units, ${all.length} distinct 30″ cells`)
  const mean = (u, get) => {
    let s = 0, w = 0
    for (const [i, j, wt] of u.cells) { const v = get(keys.get(`${i},${j}`)); if (typeof v === 'number' && Number.isFinite(v)) { s += v * wt; w += wt } }
    return w > 0 ? Number((s / w).toFixed(4)) : null
  }
  const out = new Map(units.map((u) => [u.key, { key: u.key, n: u.cells.length, properties: {} }]))
  for (const src of ['worldclim', 'chelsa']) {
    const S = SOURCES[src]
    for (const period of [S.period, ...(S.future?.periods ?? [])]) {
      const got = await fetchCells(db, collections[S.collection], S, all, { period })
      const inds = new Set(); for (const v of got.values()) for (const [k, x] of Object.entries(v)) if (typeof x === 'number') inds.add(k)
      let filled = 0
      for (const u of units) {
        const values = {}
        for (const ind of inds) { const m = mean(u, (k) => got.get(k)?.[ind]); if (m != null) values[ind] = m }
        if (!Object.keys(values).length) continue
        const g = toGids(src, period === S.period ? values : nestFuture(src, period, values))
        if (Object.keys(g).length) { (out.get(u.key).properties[src] ??= {})[period] = g; filled++ }
      }
      console.log(`  ${src} ${period}: ${got.size} cells, ${inds.size} indicators, ${filled} units`)
    }
  }
  const elev = new Map()
  for (let i = 0; i < all.length; i += 5000) for (const r of await db.query('FOR k IN @keys LET d = DOCUMENT(@@c, k) FILTER d != null RETURN [k, d.properties.topography.geo_shape_elevation]', { '@c': collections[SOURCES.worldclim.collection], keys: all.slice(i, i + 5000) }).then((c) => c.all())) if (typeof r[1] === 'number') elev.set(r[0], r[1])
  for (const u of units) out.get(u.key).elevation = { point: elev.get(keys.get(u.point_cell.join(','))) ?? null, area: mean(u, (k) => elev.get(k)) }
  writeFileSync('work/units-area.jsonl', [...out.values()].map((r) => JSON.stringify(r)).join('\n') + '\n')
  console.log(`work/units-area.jsonl: ${out.size} units`)
} catch (e) { console.error(explain(e)); process.exit(1) }
