# The climate of a unit's area against its reference point (2026-11-24)

Step 1 of the plan agreed with Milko on 2026-11-24 (see
[`2026-11-24-units-as-supplementary-observations.md`](2026-11-24-units-as-supplementary-observations.md)).
**Status: measured; nothing written to the database; decisions of §4 awaiting Milko.**

## 1. Why

The scatterplot places a unit by the climate at its **reference point**. Milko: that point is chosen by
the unit's manager, after a study or simply where the surveyors park; for Austria's restricted units it
is the nearest village. The **polygon** is the border of the area of conservation activity (and says
nothing about where in it a species grows). The question: how far is the climate at the point from the
climate of the area?

## 2. Method

For each of the 3 669 units: the 30″ cells (WorldClim 2.1, CHELSA 2.1) its polygon intersects, each
weighted by the share of the polygon in it (`sources/units/area_cells.py`; 37 886 cells, median 4 per
unit, 90 % under 11, largest 3 126); the weighted mean of every indicator over them, next to the value
of the cell holding the reference point (`sources/units/area-climate.js`, reference periods; elevation
from the WorldClim layer). The same on the 5′ EU-Trees4F rasters. Difference = area − point.
Outputs in `work/` (`units-area-cells.jsonl`, `units-area-eutrees4f.jsonl`, `units-area-climate.jsonl`).

## 3. Results

**All units**, share whose difference exceeds the threshold (number of units):

| | median | > 0.5 °C / 5 % / 100 m | > 1 °C / 10 % / 200 m | largest |
|---|---|---|---|---|
| Elevation | 6 m | 6.4 % (233) | 2.5 % (91) | 1 156 m |
| Annual temperature, WorldClim | 0.02 °C | 5.7 % (208) | 2.2 % (79) | 6.8 °C |
| Annual temperature, CHELSA | 0.04 °C | 8.5 % (309) | 3.4 % (124) | 7.5 °C |
| Annual temperature, EU-Trees4F (10 km) | 0.00 °C | 3.1 % (114) | 1.5 % (54) | 3.9 °C |
| Annual precipitation, WorldClim | 0.2 % | 4.6 % (167) | 1.7 % (60) | 88 % |
| Annual precipitation, CHELSA | 0.2 % | 3.2 % (117) | 1.3 % (49) | 94 % |
| Annual precipitation, EU-Trees4F | 0.0 % | 1.8 % (67) | 0.9 % (32) | 60 % |

For nine units in ten the point stands well for the area. 312 units differ by more than 0.5 °C on at
least one 1 km source (103 of them restricted), 125 by more than 1 °C. At EU-Trees4F's 10 km, the
default climate of the panes, 2 768 units have point and polygon in the same single cell.

**By where the point lies** (annual temperature, WorldClim, share over 0.5 °C / over 1 °C):

| Reference point | Units | > 0.5 °C | > 1 °C | Elevation > 100 m |
|---|---|---|---|---|
| inside the polygon | 3 176 | 3.0 % | 1.0 % | 3.7 % |
| outside, up to 1 km | 378 | 18.7 % | 5.3 % | 20.3 % |
| outside, over 1 km | 115 | 37.7 % | 24.6 % | 36.0 % |
| **Austria, restricted** | 281 | **28.1 %** | 11.4 % | 30.6 % |

Austria's restricted units on CHELSA: 36 % over 0.5 °C, 20 % over 1 °C; median elevation difference
53 m, up to 1 156 m (AUT00228: point at 2 317 m, area at 1 161 m, 6.8 °C apart). On EU-Trees4F only 7 %
exceed 0.5 °C. Units over 0.5 °C by country: Austria 79, Spain 29, Italy 27, Switzerland 17, France 15.

**The present flag misses most of them.** Of the 208 units over 0.5 °C (WorldClim), 95 have the point
*inside* the polygon (large mountain units: median 10 cells; ITA00249, 45 cells, 4.7 °C), 113 outside,
and only 23 are beyond the 5 km of today's distance flag (which marks 46 units, half of them under
0.5 °C). Distance on the map is a poor measure of distance in climate; elevation is the cause.

**A unit is not one climate.** Within the polygon, annual temperature ranges over more than 1 °C in 641
units and more than 2 °C in 206; elevation over more than 200 m in 718, more than 1 000 m in 40.

**A gain on the side.** 37 units have no WorldClim value at the point (sea or mask); 16 of them have
values over their area.

## 4. What it means, and what is to decide

It is an issue of a minority, concentrated and predictable: mountain units, points outside the
polygon, Austria's restricted units; larger on the 1 km sources than on EU-Trees4F. Milko's rule
(2026-11-24): **the reference point's coordinates are respected**; the area's climate is additional
information, and the difference is the occasion for a warning.

Proposed, for Milko's decision:

1. **Store the area's climate with each unit**, next to the point's (same sources and periods), and the
   elevation difference. Climate values reveal no coordinates, so restricted units carry them too.
2. **A warning by climate, not by kilometres**: a unit is flagged when its area differs from its point
   by more than a threshold (proposal: 0.5 °C in annual temperature or 5 % in annual precipitation on
   the selected source; or 100 m in elevation, which is independent of the source). It complements the
   distance flag.
3. **In the scatterplot the unit stays at its reference point.** A flagged unit shows the warning mark;
   its hover window states both climates; optionally a thin line from the point's position to the
   area's position, so the reader sees which way and how far.
4. **Later, with the supplement:** the layer "climate of the areas where the species is under
   conservation" is drawn from the area values, since it is the area EUFGIS states, not the point.

New dictionary terms would be needed (the area climate block, the elevation difference, the flag and
its texts): a handoff to `metadata-store` after Milko's decision, following the shared guidelines.
