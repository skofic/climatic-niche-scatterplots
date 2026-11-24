// Area climate of the units, part 2: the climate over each unit's polygon against the climate at its reference point,
// on the two 1 km grids (WorldClim 2.1, CHELSA 2.1; reference periods) and with the WorldClim elevation layer.
// The area value is the mean over the 30″ cells the polygon intersects, weighted by the share of the polygon in each
// (sources/units/area_cells.py); the point value is the containing cell's, as ScatterUnits stores it.
// READS ONLY: nothing is written to the database. Output: work/units-area-climate.jsonl
//   { key, restricted, km, n, <source>: { point: {...}, area: {...}, min: {...}, max: {...} }, elevation: { point, area, min, max } }
// Usage: node sources/units/area-climate.js
import { readFileSync, writeFileSync } from 'node:fs'
import { connect, loadCredentials, explain } from '../../lib/db.js'
import { cellPolygon, geometryHash, RADIUS_30S } from '../../lib/geometry.js'
import { SOURCES } from '../../config/indicators.js'
import { fetchCells } from '../climate/geoservice/lookup.js'

const lines = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
const STEP = 2 * RADIUS_30S
const keyOf = (i, j) => geometryHash(cellPolygon(Number((-180 + (i + 0.5) * STEP).toFixed(6)), Number((-90 + (j + 0.5) * STEP).toFixed(6)), RADIUS_30S))
try {
  const { db, collections } = connect(loadCredentials())
  const units = lines('work/units-area-cells.jsonl')
  const meta = new Map(lines('work/units-geometry.jsonl').map((u) => [u.key, u.restricted]))
  const km = new Map(lines('work/units-distance.jsonl').map((u) => [u.key, u.km]))
  const keys = new Map()   // "i,j" → cell key
  for (const u of units) for (const [i, j] of [u.point_cell, ...u.cells]) if (!keys.has(`${i},${j}`)) keys.set(`${i},${j}`, keyOf(i, j))
  const all = [...new Set(keys.values())]
  console.log(`${units.length} units, ${all.length} distinct 30″ cells`)
  const values = {}
  for (const src of ['worldclim', 'chelsa']) { values[src] = await fetchCells(db, collections[SOURCES[src].collection], SOURCES[src], all); console.log(`  ${src}: ${values[src].size} cells found`) }
  const elev = new Map()
  for (let i = 0; i < all.length; i += 5000) for (const r of await db.query('FOR k IN @keys LET d = DOCUMENT(@@c, k) FILTER d != null RETURN [k, d.properties.topography.geo_shape_elevation]', { '@c': collections[SOURCES.worldclim.collection], keys: all.slice(i, i + 5000) }).then((c) => c.all())) if (typeof r[1] === 'number') elev.set(r[0], r[1])
  console.log(`  elevation: ${elev.size} cells`)
  const INDS = ['bio01', 'bio12', 'tas_summer', 'pr_summer', 'pr_winter', 'continentality', 'tas_coldest']
  const agg = (u, get) => {   // weighted mean, min, max over the polygon's cells that have a value
    let s = 0, w = 0, mn = Infinity, mx = -Infinity
    for (const [i, j, wt] of u.cells) { const v = get(keys.get(`${i},${j}`)); if (typeof v === 'number') { s += v * wt; w += wt; if (v < mn) mn = v; if (v > mx) mx = v } }
    return w > 0 ? { area: Number((s / w).toFixed(4)), min: mn, max: mx, cover: Number(w.toFixed(3)) } : null
  }
  const out = []
  for (const u of units) {
    const pk = keys.get(u.point_cell.join(',')), row = { key: u.key, restricted: meta.get(u.key), km: km.get(u.key), n: u.cells.length }
    for (const src of ['worldclim', 'chelsa']) {
      const b = { point: {}, area: {}, min: {}, max: {} }
      for (const ind of INDS) { const a = agg(u, (k) => values[src].get(k)?.[ind]); const p = values[src].get(pk)?.[ind]; if (typeof p === 'number') b.point[ind] = p; if (a) { b.area[ind] = a.area; b.min[ind] = a.min; b.max[ind] = a.max } }
      row[src] = b
    }
    const a = agg(u, (k) => elev.get(k)); row.elevation = { point: elev.get(pk) ?? null, area: a?.area ?? null, min: a?.min ?? null, max: a?.max ?? null }
    out.push(row)
  }
  writeFileSync('work/units-area-climate.jsonl', out.map((r) => JSON.stringify(r)).join('\n') + '\n')
  console.log(`work/units-area-climate.jsonl: ${out.length} units`)
} catch (e) { console.error(explain(e)); process.exit(1) }
