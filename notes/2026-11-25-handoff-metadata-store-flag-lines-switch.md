# Handoff: a switch for the flag's lines (2026-11-25)

**From:** the `climatic-niche-scatterplots` session. **To:** `metadata-store`. Carried by Milko.
Follows [`2026-11-25-handoff-metadata-store-flag-second-round.md`](2026-11-25-handoff-metadata-store-flag-second-round.md).
Written under the shared guidelines; no rule changes. **Status: ready to carry (Milko, 2026-11-25).**

## 1. Why

A flagged unit draws a line on both panes: in the scatterplot from the unit, at its reference
point, to the mean climate of its area; on the map (built today, no term needed then) from the
chosen unit's polygon to its reference point, when the unit is flagged for distance and the point
falls outside the framed view. Milko asks for a switch that turns these lines off, like *Shift
arrows* in the scatterplot. One switch for both panes, in the flag group, on by default. The
marks of a flagged unit (warning mark, dashed ring, dashed outline) do not depend on it.

## 2. The term

### ui_layout_units_flag-lines                 (new)
```
Kind:        control
Where:       host bar and both panes › flag group, after the three thresholds; a check box with its title as label
_title:      Lines
_definition: Draws the lines of the flagged units: to the mean climate of the area in the scatterplot, to the reference point on the map.
_description:A flagged unit (see [reference point flag](gcu_loc_climate_flag.md)) is drawn with a line on
             each pane. In the scatterplot the line runs from the unit, drawn at its
             [reference point](gcu_loc_climate.md), to the
             [mean climate of its area](gcu_loc_climate_area.md): the far end is where the unit would sit if
             it were read over its whole polygon. On the map, when the chosen unit is flagged for
             [distance](gcu_loc_climate_flag_distance.md) and its reference point falls outside the framed
             view, the line runs from the polygon to the reference point, so that the point can be
             found. Switching the lines off leaves the warning marks. On by default. A form field,
             set with a check box.
_uses:       To clear the drawing when many units are flagged, or to compare the plot with and without
             the areas' positions.
_data:       _scalar._boolean; default true (constant on ui_layout_state)
Binds:       new key (state, shared by the host with both panes, remembered in the browser)
```

We place it under `ui_layout_units` (beside `ui_layout_units_mode` and `_selection`, the controls
both panes share) and not under `gcu_loc_climate_flag`, whose elements are the criteria of the set.
If you prefer another place or name, we follow.

### ui_layout_state                            (exists: change)
Add the field (main group, after the three thresholds) with the constant `true`.

### Texts that mention the lines
- `ui_layout_label_flag-climate`, `_description`, paragraph *What a flagged unit shows*: add the
  map's line (from the polygon of the chosen unit to its reference point, when flagged for distance
  and out of view) and that [Lines](ui_layout_units_flag-lines.md) switches both off.
- `ui_layout_scatterplot_label_area-line`, `_description`: one closing sentence linking the switch.
- Manual page `using/map-and-scatterplot`, *The reference point and the area*: the map's line and
  the switch.
