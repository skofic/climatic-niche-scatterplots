# Handoff: terms for the climate of a unit's area and its flag (2026-11-24)

**From:** the `climatic-niche-scatterplots` session. **To:** `metadata-store`. Carried by Milko.
Written after reading `../shared/Terms and User Interface/Guidelines - terms for the user interface.md`
(no rule of the guidelines changes in this round).
**Status: ready to carry. §4 decided by Milko on 2026-11-24: the climate flag replaces the distance flag.**

## 1. Why

A unit's climate is read at its **reference point**, which the unit's manager chooses: after a study,
or where the surveyors park; for Austria's restricted units it is the nearest village. The unit's
polygon is the area of the conservation activity. Measured on 2026-11-24
([`2026-11-24-units-area-climate-vs-reference-point.md`](2026-11-24-units-area-climate-vs-reference-point.md)):
for nine units in ten the point stands well for the area, but 312 units differ by more than 0.5 °C of
annual temperature on a 1 km source, and the existing 5 km distance flag catches 23 of the 208 that
differ on WorldClim. The cause is elevation, not distance on the map.

Milko's decisions of the same day:

1. the climate of the area is **stored with each unit**, beside the point's;
2. the unit **stays at its reference point** in the scatterplot;
3. a unit is **flagged by climate difference**, with the thresholds chosen from popup menus;
4. a flagged unit gets a **thin line** from its point's position to its area's position, and its hover
   window states both climates.

## 2. Data terms (no control role)

### gcu_loc_climate_area                      (new)
```
Kind:        data term; also the namespace of nothing else for now
Where:       ScatterUnits, every unit that has a polygon and grid values (3 648 – 3 669 of 3 669 by source)
_title:      Climate of the unit's area
_definition: The climate indicators averaged over the area of the unit's polygon.
_description:The same indicators, sources, periods and scenarios as the unit's climate at its
             [climate reference point](gcu_loc_climate.md), computed over the unit's polygon instead of at
             one point. The reference point is chosen by the unit's manager and may lie outside the
             area or at another elevation; this value says what the climate of the area itself is. The
             panes keep the unit at its reference point and use this value to flag the units where
             the two differ, and to draw a line to the area's position. Climate values reveal no
             location, so restricted units carry them too.
_methods:    Each grid cell the polygon intersects contributes in proportion to the share of the
             polygon's area that falls in it (WorldClim 2.1 and CHELSA 2.1: 30 arc-second cells;
             EU-Trees4F: 5 arc-minute cells). Derived indicators are derived per cell, then averaged.
             Cells without a value (sea, outside the grid) are left out.
_issues:     The polygon is the border of the area in which the conservation activities are
             performed; it does not say where in it the target species grow. In a large mountain
             unit the climate ranges widely inside the polygon (annual temperature over more than
             1 °C in 641 units), and the mean stands for none of its places exactly.
_data:       an object of the same shape as the unit's `properties`:
             <source> → <period> → [<model> → <ssp> | <rcp>] → { indicator gid: number }
             (sources `eutrees4f`, `worldclim`, `chelsa`; leaves are the existing env_climate_* terms).
             Please declare it the way `properties` is handled today; our loader validates the leaves.
_notes:      Decided by Milko on 2026-11-24. Computed by sources/units/area_cells.py and
             sources/units/area.js of climatic-niche-scatterplots.
```

### gcu_loc_climate_elevation                 (new)
```
Kind:        data term
Where:       ScatterUnits, every unit whose reference point falls on a WorldClim cell
_title:      Reference point elevation
_definition: Elevation of the 1 km cell that holds the unit's climate reference point.
_description:The elevation at which the unit's climate is read. Compared with the mean elevation of
             the unit's polygon ([elevation](geo_shape_elevation.md)) it explains most differences between
             the climate at the [reference point](gcu_loc_climate.md) and the
             [climate of the area](gcu_loc_climate_area.md): about 0.5 to 0.65 °C for every 100 m. An
             elevation reveals no location, so restricted units carry it too.
_methods:    Read from the WorldClim 2.1 elevation layer at the containing 30 arc-second cell.
_data:       _scalar._number_integer, unit metres (as geo_shape_elevation), may be negative
```

### Existing terms: texts to change

- `gcu_loc_climate`, `_issues`: add that the point is chosen by the unit's manager and that the
  [climate of the unit's area](gcu_loc_climate_area.md) is stored beside it; the panes flag the units
  where the two differ.
- `gcu_loc_climate_distance`, `_description`: see §4.

## 3. Controls: the two thresholds

A unit is flagged when, **on the selected climate source and its reference period**, the area differs
from the reference point by more than the temperature threshold in annual mean temperature
(`env_climate_bio01`) **or** by more than the precipitation threshold in annual precipitation
(`env_climate_bio12`, as a percentage of the point's value). The flag does not depend on the axes
shown or on the period: it says the reference point does not stand for the area. The thin line shows
what the difference does on the axes and period shown.

### gcu_loc_climate_flag_temperature          (new; `gcu_loc_climate_flag` becomes a namespace too)
```
Kind:        control
Where:       host bar and scatterplot bar › flag group; shown as a selector after the group's label
_title:      Flag temperature difference
_definition: Units whose area differs from their reference point by more than this in annual mean temperature are flagged.
_description:One of the two thresholds of the climate flag shown in the map and scatterplot panes. A unit
             is flagged when the [climate of its area](gcu_loc_climate_area.md) differs from the climate at
             its [reference point](gcu_loc_climate.md) by more than this in annual mean temperature, or by more
             than the [precipitation threshold](gcu_loc_climate_flag_precipitation.md) in annual
             precipitation, on the selected climate source and its reference period. A flagged unit gets
             a warning mark in the unit lists, a dashed ring in the scatterplot with a line to the
             position of its area, and a dashed outline on the map; its hover window states both
             climates. Offered values 0.25, 0.5, 1, 2 °C; default 0.5 °C. A form field, set with a
             selector of a number.
_uses:       To find the units whose position in the scatterplot may not be the climate of the place
             under conservation: read them at the end of their line, and check the reference point
             with the unit's data manager.
_issues:     On EU-Trees4F (10 km cells) most units have point and area in one cell, so few are
             flagged; the same unit may be flagged on a 1 km source.
_data:       _scalar._number_float, _decimals 2, _range_valid 0 – 10, unit degrees Celsius; default 0.5
Binds:       new key (state, remembered in the browser)
```

### gcu_loc_climate_flag_precipitation        (new)
```
Kind:        control
Where:       same group, second selector
_title:      Flag precipitation difference
_definition: Units whose area differs from their reference point by more than this share of annual precipitation are flagged.
_description:The second threshold of the climate flag, see the
             [temperature threshold](gcu_loc_climate_flag_temperature.md). The difference is taken as a
             percentage of the value at the reference point. Offered values 2, 5, 10, 20 %; default 5 %.
             A form field, set with a selector of a number.
_data:       _scalar._number_integer, _range_valid 0 – 100, unit per cent; default 5
Binds:       new key (state, remembered in the browser)
```

### ui_layout_state                           (exists: change)
Add the two controls as `_fields` (main group, in the place of `gcu_loc_climate_flag`, which leaves: §4)
with the constants 0.5 and 5. Examples that carry `gcu_loc_climate_flag` follow.

## 4. The distance flag is replaced (Milko, 2026-11-24)

**The climate flag replaces the distance flag on the bars.** One warning, with one meaning: the
reference point's climate is not the area's. The distance stays a stored fact
(`gcu_loc_climate_distance`) and is stated in the unit's hover window. Of the 46 units beyond 5 km,
38 are flagged by climate as well; the other 8 have a distant point with the same climate.

- `gcu_loc_climate_flag` (exists: change): it is no longer a control of the panes. Please keep the
  term as the namespace of the two thresholds, reword it accordingly (title e.g. *Climate flag*; the
  flag and its two thresholds; no form-field sentence), and decide whether it keeps a `_data` section
  and the control role. It **leaves `ui_layout_state`** (field and constant 5).
- `gcu_loc_climate_distance`, `_description`: the last sentence becomes "The panes state it in the
  unit's hover window; the flag is read from the climate, see the
  [climate of the unit's area](gcu_loc_climate_area.md)." Its `_notes` count stays.

## 5. Labels

### ui_layout_label_flag-climate               (new)
```
Kind:        label; the flag group's label on both bars: "Area differs by > [0.5] °C or [5] %"
_title:      Area differs by
_definition: Flags the units whose area has another climate than their reference point.
_description:Why the group is there: a unit is drawn at the climate of its
             [reference point](gcu_loc_climate.md), which its manager chose and which may lie outside the
             area or at another elevation. The two thresholds
             ([temperature](gcu_loc_climate_flag_temperature.md),
             [precipitation](gcu_loc_climate_flag_precipitation.md)) decide from what difference a unit is
             flagged.
```

### ui_layout_label_reference-point, ui_layout_label_area      (new)
```
Kind:        labels; the two lines of a flagged unit's hover window, each followed by the two axis values
             and the elevation
_title:      Reference point  /  Area
_definition: The climate at the unit's reference point, where the unit is drawn.  /
             The climate averaged over the unit's polygon, where its line ends.
```

### ui_layout_scatterplot_label_area-line      (new)
```
Kind:        label; legend entry of the scatterplot, shown when a flagged unit is drawn
_title:      Climate of the unit's area
_definition: A line from a flagged unit to the climate of its area.
_description:The dot is the unit at its [reference point](gcu_loc_climate.md); the line ends at the
             [climate of the unit's area](gcu_loc_climate_area.md) on the same axes, period and scenario.
             Drawn for flagged units only.
```

### ui_layout_label_flagged                    (exists: change)
Its texts speak of the climate difference, not of the distance (§4).

## 6. Manual page `using/map-and-scatterplot`

The passage on the flag: the unit stays at its reference point; the flag is a difference of climate
between point and area on the selected source; the line and the two-line hover; the caution of
`gcu_loc_climate_area._issues`.

## 7. What we do after the reply

Load `gcu_loc_climate_area` and `gcu_loc_climate_elevation` into `ScatterUnits` (work files ready:
3 669 units, 36 973 cells read, all periods), the service's units answers, the flag, line, hover and
legend in the panes, the `SCATTER_UNITS` record's text and term list, then the showcase server on
Milko's word.
