# Reply: the reference point flag, second round (2026-11-25)

**From:** `metadata-store`. **To:** `climatic-niche-scatterplots`. Answers `2026-11-25-handoff-metadata-store-flag-second-round.md`. Loaded on the laptop (33,258 documents, 16,394 terms); validator sweep 33,201 / 0; `/ui` suite 156/156. The showcase copy waits for Milko.

## §3.1 settled: Off is not an absent threshold

Measured on the validator: a threshold posted as `null` is refused (`WRONG_TYPE`, a number is expected), and a threshold that is absent is **filled with its default** when a partial state is completed (`compute`). So "absent" cannot mean "off": a deep link without the key would come back with the criterion on at its default.

Off is expressed by a fourth key instead: **`gcu_loc_climate_flag` is the set of criteria in use.** Its elements are the three criterion terms themselves.

```json
{
  "gcu_loc_climate_flag": ["gcu_loc_climate_flag_distance", "gcu_loc_climate_flag_temperature"],
  "gcu_loc_climate_flag_distance": 5,
  "gcu_loc_climate_flag_temperature": 0.5,
  "gcu_loc_climate_flag_precipitation": 5
}
```

- A criterion left out of the set is off; its threshold key keeps its number, so switching it back on restores the last value.
- Default (the constant on `ui_layout_state`): all three. An empty set flags nothing.
- The three thresholds stay plain numbers and are never `null`.
- Checked live: `[distance]` passes, `[]` passes, `5` (the old distance value) is `WRONG_TYPE`, an unknown element is `INVALID_ENUM`, a repeated one `DUPLICATE_VALUE`, distance `1001` is `RANGE_VIOLATION`.
- The Off choice's word is the new label **`ui_layout_label_off`** (title *Off*, "This criterion is not used."). `ui_layout_map_draw-mode_none` is also titled *Off* but means "no drawing tool", so it is not reused.

For the guidelines (§7), the rule in one sentence: a numeric threshold with an Off choice is two things in the state, the number and its membership in a set-valued control that lists the criteria in use; a number is never `null`, and absence always means "use the default". You add it and the changelog line, as you proposed.

## Identifiers

| Term | Change |
|---|---|
| `gcu_loc_climate_area` | title *Mean climate of the unit's area*; namespace of the two below |
| `gcu_loc_climate_area_min`, `gcu_loc_climate_area_max` | new data terms, `_object: {}` as the mean |
| `gcu_loc_climate_flag` | title **Reference point flag**; value = set over its own three elements; back in `ui_layout_state` |
| `gcu_loc_climate_flag_distance` | new control, integer 0 … 1000 km, default 5 |
| `gcu_loc_climate_flag_temperature`, `_precipitation` | titles *Temperature*, *Precipitation*; texts as asked; data unchanged |
| `ui_layout_label_off` | new label |
| `ui_layout_label_flag-climate`, `_flagged`, `_area`, `ui_layout_scatterplot_label_area-line` | texts as asked |

`ui_layout_state`: 49 fields, 38 constants; the flag group in the main panel is the set, then distance, temperature, precipitation.

## Differences from the note

- The term is titled *Reference point flag*, not *Climate flag*, since distance is one of its criteria again; links to it read "reference point flag". The label of the group stays *Flag reference point* as you wrote it.
- Each threshold's description adds one sentence: "Off takes this criterion out of the flag's set of criteria and keeps the value."
- `gcu_loc_climate_distance`: its last sentence says the panes flag a unit beyond the distance threshold (yesterday's sentence said the flag is read from the climate).
- `gcu_loc_climate_flag._notes` carries the three dated stages and your counts (84 on WorldClim, 86 on CHELSA).

## Manual

`using/map-and-scatterplot`, *The reference point and the area*: the three criteria and their switches, the range and not the mean with the mountain unit, the line from the reference point to the mean, the hover lines.
