# Reply: the area-climate terms exist (2026-11-24)

**From:** `metadata-store`. **To:** `climatic-niche-scatterplots`. Answers `2026-11-24-handoff-metadata-store-area-climate-terms.md`. Loaded on the laptop (33,251 documents, 16,390 terms); validator sweep 33,194 / 0; `/ui` suite 156/156. The showcase copy follows on Milko's word.

## Identifiers

| Term | Kind | `_data` |
|---|---|---|
| `gcu_loc_climate_area` | data | `_object: {}` (as `properties`: the nesting is not in the schema, your loader validates the leaves) |
| `gcu_loc_climate_elevation` | data | integer, `unit_Length_m`, valid −420 … 8848 (the bounds of `geo_shape_elevation`) |
| `gcu_loc_climate_flag_temperature` | control | float, 2 decimals, valid 0 … 10, `unit_Temperature_deg-C` |
| `gcu_loc_climate_flag_precipitation` | control | integer, valid 0 … 100, `unit_Percent_pct` |
| `ui_layout_label_flag-climate` | label | title *Area differs by* |
| `ui_layout_label_reference-point` | label | title *Reference point* |
| `ui_layout_label_area` | label | title *Area* |
| `ui_layout_scatterplot_label_area-line` | label | title *Climate of the unit's area* |

Texts are the handoff's, with two additions: the two thresholds and the area term link the *climate flag* (`gcu_loc_climate_flag`), and `gcu_loc_climate_area`'s description ends with a paragraph on the shape of the value (source, period, model and scenario, indicator).

## Decisions taken here

- **`gcu_loc_climate_flag`** is now *Climate flag*: the mark itself, and the namespace of the two thresholds. It has **no `_data` section** (the panes compute the flag, nothing stores it) and **keeps the control role**, so a list of data terms leaves it out. Its description states the rule once (BIO1 or BIO12, selected source, reference period, independent of axes and period); its `_notes` keep the history of the distance flag.
- **`ui_layout_state`**: `gcu_loc_climate_flag` left `_recommended`, `_fields` and `_computed`; the two thresholds took its place in the main group, with the constants `0.5` and `5`. 47 fields, 36 constants. A partial state posted with `compute` comes back with both defaults.
- **A state that still carries `gcu_loc_climate_flag: 5` is not refused**: the schema is open and the key is still a dictionary term, now without a type. The pages should stop sending it.
- **`ui_layout_label_flagged`**: title *area climate differs from the reference point*, definition "A unit whose area has another climate than its reference point, beyond the flag thresholds."
- **`gcu_loc_climate`** `_issues` and **`gcu_loc_climate_distance`** `_description` as asked.
- Checked live: temperature `11` is `RANGE_VIOLATION`, precipitation `2.5` is `WRONG_TYPE`, `0.25` / `10` pass.

## Manual

`using/map-and-scatterplot`: the paragraph is now *The reference point and the area* (the unit stays at its point, the flag as a climate difference on the selected source, the line, the two hover lines, the caution on the polygon); the building-blocks list and the chapter index name the two data terms.
