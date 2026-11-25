# Handoff: the reference point flag, second round (2026-11-25)

**From:** the `climatic-niche-scatterplots` session. **To:** `metadata-store`. Carried by Milko.
Follows [`2026-11-24-handoff-metadata-store-area-climate-terms.md`](2026-11-24-handoff-metadata-store-area-climate-terms.md)
and its reply. Written after reading the shared guidelines; §7 proposes one addition to them.
**Status: ready to carry. Decided by Milko on 2026-11-25.**

## 1. Why a second round

Milko's review of the first build (2026-11-24, night) and one unit, ITA00183, showed what the first
rule got wrong. That unit covers 2 430 one-kilometre cells from 699 m to 3 606 m; its reference point
lies in the middle of the polygon at 2 619 m. The point's annual temperature is −2.7 °C, the area's
mean −0.6 °C, and the area itself runs from −8.1 °C to +9.4 °C. The first rule compared the point
with the **mean** of the area and flagged the unit at every setting. The warning was false: the
point is not misplaced, the unit spans many climates and no point can stand for its mean.

Counted on WorldClim at the first defaults (0.5 °C or 5 %), 259 units were flagged: in 179 the
point's climate lies within the range found inside the polygon (varied units), in 80 it lies outside
it (a point whose climate occurs nowhere in the unit).

Decisions (Milko, 2026-11-25):

1. **The climate criteria compare the reference point with the minimum and maximum of the area, not
   with its mean.** A unit is flagged when the climate at its point lies outside the range of the
   area by more than the threshold.
2. **The distance returns as a third criterion.** A point 180 km from its unit must be flagged
   whatever its climate.
3. **Each criterion can be switched off** in its own popup, so a user flags by distance only, by
   climate only, or by all three.
4. **The variability of a unit is a stated fact, not a warning:** mean, minimum and maximum of the
   climate over the unit are stored and shown in the hover window.
5. **The thin line stays:** it runs from the unit, drawn at its reference point, to the mean
   climate of its area. Milko found it revealing and could not find it explained; the texts below
   say it in three places.

Units flagged under the new rule, all 3 669 units, defaults of §3:

| Source | Temperature > 0.5 °C | Precipitation > 5 % | Distance > 5 km | Any of the three |
|---|---|---|---|---|
| WorldClim 2.1 | 51 | 50 | 46 | 84 |
| CHELSA 2.1 | 55 | 45 | 46 | 86 |

## 2. Data terms

### gcu_loc_climate_area                       (exists: change)
It now holds the **mean** and is the namespace of the two terms below. Please say "mean" in its
`_title` (*Mean climate of the unit's area*) and `_definition`, and add to the `_description` that
the [minimum](gcu_loc_climate_area_min.md) and [maximum](gcu_loc_climate_area_max.md) are stored
beside it, and that the panes flag a unit from those two, not from the mean (see
[climate flag](gcu_loc_climate_flag.md)). Its `_issues` paragraph on wide ranges stays.

### gcu_loc_climate_area_min, gcu_loc_climate_area_max      (new)
```
Kind:        data terms
Where:       ScatterUnits, the units that carry gcu_loc_climate_area
_title:      Minimum climate of the unit's area  /  Maximum climate of the unit's area
_definition: The lowest value of each climate indicator found over the area of the unit's polygon.  /
             The highest value …
_description:For every indicator, source, period and scenario of the
             [mean climate of the unit's area](gcu_loc_climate_area.md), the lowest (highest) value among
             the grid cells the polygon intersects. With the mean they state the climate variability
             of the unit: a unit on a mountain side may span ten degrees of annual temperature, a
             unit on a plain a tenth of a degree. The panes compare the climate at the
             [reference point](gcu_loc_climate.md) with this range to decide the
             [climate flag](gcu_loc_climate_flag.md). Climate values reveal no location, so restricted
             units carry them too.
_methods:    Taken over the same cells as the mean, each cell counting whatever share of the polygon
             falls in it. Each indicator has its own minimum and maximum: the values of one block do
             not describe one place.
_issues:     On the EU-Trees4F grid (5 arc-minute cells) most units fall in one or two cells, so
             minimum, mean and maximum are equal or nearly so.
_data:       an object of the same shape as gcu_loc_climate_area (declared as that term is)
_notes:      Decided by Milko on 2026-11-25.
```

## 3. Controls

The rule, to be stated once on `gcu_loc_climate_flag` (exists: change): a unit is flagged when **any
criterion that is switched on** is met.

- **Distance:** the [reference point distance](gcu_loc_climate_distance.md) exceeds the threshold.
- **Temperature:** on the selected climate source and its reference period, the annual mean
  temperature (`env_climate_bio01`) at the reference point lies below the area's minimum or above its
  maximum by more than the threshold.
- **Precipitation:** the same for annual precipitation (`env_climate_bio12`), the excess taken as a
  percentage of the value at the reference point.

The climate criteria do not depend on the axes or the period shown. A unit whose point's climate
lies inside the range of its area is never flagged by climate, however wide that range.

### gcu_loc_climate_flag_distance              (new)
```
Kind:        control
Where:       host bar and both panes › flag group, first selector
_title:      Distance
_definition: Units whose reference point lies farther than this from their polygon are flagged.
_description:The first criterion of the [climate flag](gcu_loc_climate_flag.md): a unit is flagged when its
             [reference point distance](gcu_loc_climate_distance.md) exceeds this value, whatever the
             climate. A point far from its unit describes another place, even where the two climates
             happen to agree. Offered values 1, 2, 5, 10, 20, 50 km, and Off; default 5 km. A form
             field, set with a selector of a number.
_data:       _scalar._number_integer, _range_valid 0 – 1000, unit kilometres; default 5; "off": see §3.1
Binds:       new key (state, remembered in the browser)
```

### gcu_loc_climate_flag_temperature           (exists: change)
```
_title:      Temperature          (was: Flag temperature difference)
_definition: Units whose reference point is warmer or colder than every part of their area by more than this are flagged.
_description:The second criterion of the [climate flag](gcu_loc_climate_flag.md). On the selected climate
             source and its reference period, the annual mean temperature at the
             [reference point](gcu_loc_climate.md) is compared with the
             [minimum](gcu_loc_climate_area_min.md) and [maximum](gcu_loc_climate_area_max.md) found over the
             unit's area: the unit is flagged when the point lies below the minimum or above the
             maximum by more than this value. A point inside the range is never flagged, however
             varied the unit. Offered values 0.25, 0.5, 1, 2, 3, 5 °C, and Off; default 0.5 °C. A form
             field, set with a selector of a number.
_uses, _issues: as they are (the EU-Trees4F remark stays).
_data:       unchanged (float, 2 decimals, 0 – 10 °C); "off": see §3.1
```

### gcu_loc_climate_flag_precipitation         (exists: change)
```
_title:      Precipitation        (was: Flag precipitation difference)
_definition: Units whose reference point is wetter or drier than every part of their area by more than this share are flagged.
_description:The third criterion, as the [temperature criterion](gcu_loc_climate_flag_temperature.md), on
             annual precipitation; the excess beyond the area's minimum or maximum is taken as a
             percentage of the value at the reference point. Offered values 2, 5, 10, 20, 30, 50 %,
             and Off; default 5 %. A form field, set with a selector of a number.
_data:       unchanged (integer, 0 – 100 %); "off": see §3.1
```

### 3.1 "Off"
Each of the three selectors has an **Off** choice that removes its criterion. We propose that off is
the **absence of a value**: the key is `null` in the page's state and left out of a deep link, and
the default constants of `ui_layout_state` (5, 0.5, 5) apply only when the key is absent from a
partial state that asks for defaults. If the validator cannot tell "absent" from "null" with
`compute`, please say how you prefer off to be expressed (we will follow), and whether the option's
word comes from the label below or from an existing term.

### ui_layout_label_off                        (new, unless one exists)
```
Kind:        label; the Off choice of the three flag selectors
_title:      Off
_definition: This criterion is not used.
```

### ui_layout_state                            (exists: change)
Add `gcu_loc_climate_flag_distance` beside the two thresholds (main group), constant 5.

## 4. Labels

### ui_layout_label_flag-climate               (exists: change — the extensive text Milko asked for)
```
Where:       the flag group's label on the three bars:
             "Flag reference point  Distance > [5] km  Temperature > [0.5] °C  Precipitation > [5] %"
_title:      Flag reference point          (was: Area differs by)
_definition: Flags the units whose reference point does not stand for their area.
_description:**What it is for.** A conservation unit is drawn in the scatterplot at the climate of one
             place, its [reference point](gcu_loc_climate.md). Everything read from the plot (whether the
             unit sits at the edge of the climate of its species, where a coming period moves it,
             which units share a climate) rests on that point describing the unit. The point is
             chosen by the manager of the unit: sometimes after a study, sometimes where the
             surveyors leave their car, and for units with restricted coordinates it may be the
             nearest village. This warning finds the units where the point cannot be trusted to
             describe the area, before a conclusion is drawn from their position.

             **What it checks.** Three criteria, each with its own threshold, each of which can be
             switched off:

             - [Distance](gcu_loc_climate_flag_distance.md): the point lies far from the polygon of the
               unit. Such a point describes another place, even where the climates happen to agree.
             - [Temperature](gcu_loc_climate_flag_temperature.md) and
               [precipitation](gcu_loc_climate_flag_precipitation.md): the climate at the point occurs
               nowhere in the unit. The point is compared with the lowest and the highest value found
               over the area, not with its mean, on the selected climate source.

             **Why the range and not the mean.** A large unit on a mountain side spans many climates,
             and no single point can equal its mean; comparing with the mean would flag every such
             unit, wrongly. A point whose climate lies between the minimum and the maximum of the area is
             one of the climates of the unit, and is not flagged. A point outside that range is
             warmer, colder, wetter or drier than every part of the unit: it is typically at another
             elevation, in the valley below or on the ridge above, and this is what distance on the
             map does not show. Most flagged units have their point within a few kilometres.

             **What a flagged unit shows.** A warning mark in the lists, a dashed ring in the
             scatterplot and a dashed outline on the map. In the scatterplot a thin line runs from
             the unit, drawn at its reference point, to the [mean climate of its area](gcu_loc_climate_area.md):
             the far end of the line is where the unit would sit if it were read over its whole area,
             and the length of the line is the size of the doubt. The hover window states both
             climates, with the minimum and maximum of the area and the elevations.

             **How to use it.** Read a flagged unit at the far end of its line, and check the
             reference point with the data manager of the unit. To review the reference points of a
             country, start with all three criteria on; to look only for points entered in the wrong
             place, switch the two climate criteria off; to study the effect of elevation, switch the
             distance off. A unit that is not flagged may still span a wide range of climates: its
             hover window states the minimum and maximum.
_uses:       To know which units' positions in the scatterplot can be trusted, and to give the
             managers of the others a precise reason to review their reference point.
_issues:     The polygon is the border of the area in which the conservation activities are
             performed; it does not say where in it the target species grow. On EU-Trees4F (10 km
             cells) point and area mostly share one cell and the climate criteria find little: use a
             1 km source to review reference points.
```

### ui_layout_label_flagged                    (exists: change)
```
_title:      reference point flagged
_definition: A unit whose reference point lies far from its area, or has a climate found nowhere in it, beyond the flag thresholds.
```

### ui_layout_scatterplot_label_area-line      (exists: change)
```
_title:      Mean climate of the unit's area
_definition: The line from a flagged unit, drawn at its reference point, to the mean climate of its area.
_description:The dot is the unit at its [reference point](gcu_loc_climate.md). The line ends, with a small
             open mark, at the [mean climate of the unit's area](gcu_loc_climate_area.md) on the same axes,
             period and scenario: where the unit would sit if it were read over its whole polygon.
             Drawn for flagged units only. A long line means the position of the dot says little
             about the unit.
```

### ui_layout_label_area                       (exists: change)
`_definition`: "The climate over the unit's polygon: its mean, where the line ends, with the minimum
and maximum of the area."

## 5. Manual page `using/map-and-scatterplot`

The paragraph *The reference point and the area*: the three criteria and their switches; the range
and not the mean, with the mountain unit as the example; the line explained as in §4 (start at the
reference point, end at the mean of the area); the hover window's lines.

## 6. What we do after the reply

Compute and load the minimum and maximum (every source and period), the service's flag answer
(distance, and the excess beyond the range per source), the three selectors with Off, the hover
window with mean and range. On the laptop only; the showcase server waits for Milko's review.

## 7. Proposed addition to the shared guidelines

§4.2 (the widget implied by `_data`): a numeric threshold offered as a short list of values, with an
**Off** choice that removes the criterion, and how off is expressed in the state (§3.1). We add the
rule and a changelog line once you have settled §3.1.
