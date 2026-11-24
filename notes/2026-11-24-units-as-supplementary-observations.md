# Conservation units as a supplement to the observations (2026-11-24)

Milko's question: do the conservation unit polygons correspond to the observation coordinates, and
could the units add data to the observation grid of the application? Measured on the laptop's
`GeoService` (`UnitPolygons` 3 669 polygons, `ScatterUnits`, `ScatterOccurrences` 250 569 cells).
**Status: measurement done, proposal awaiting Milko's decision; nothing built.**

A point of wording: the observations are **EU-Forest** (inventory plots at 1 km cell centres);
EU-Trees4F supplies the climate and the modelled maps.

## 1. What was measured

Each polygon was projected to EPSG:3035 and laid over the EU-Forest 1 km cells (a cell is touched when
the polygon intersects its square). Distances are from the polygon to the nearest cell centre.

**Same place.** 809 units (22 %) touch a surveyed cell; in 534 of them (66 %) a touched cell records
at least one target species of the unit. A unit is small: median 2 cells, 90 % under 8, the largest 2 086.

**By unit and target species** (4 869 pairs), distance to the nearest EU-Forest observation of that species:

| Nearest observation | Pairs | Share |
|---|---|---|
| in a touched cell | 646 | 13 % |
| within 1 km | 895 | 18 % |
| 1–5 km | 1 585 | 33 % |
| 5–10 km | 618 | 13 % |
| 10–50 km | 893 | 18 % |
| over 50 km | 767 | 16 % |
| species not in EU-Forest | 111 | 2 % |

(The first row is contained in the second.) The low overlap in place is expected: EU-Forest is a sample
of plots, not a full cover. Two thirds of the pairs have the species observed within 10 km.

**The gaps.**

- *Territory.* 440 units lie more than 50 km from any surveyed cell: Turkey 265 of 272, Bosnia and
  Herzegovina 88 of 112, Ukraine 72 of 79, Serbia 8 of 9, Greece 4, Iceland, Malta and Italy 1 each.
- *Species far from their observations.* The 767 pairs over 50 km concern 86 species; 379 are units
  outside the surveyed territory, 388 are inside it (thin national samples: Romania 57, Denmark 54,
  Poland 40, Sweden 30, the Netherlands 26). Most frequent: *Pinus nigra* 64, *Pinus brutia* 59,
  *Quercus robur* 45, *Quercus petraea* 43, *Pinus sylvestris* 39, *Fagus sylvatica* 39,
  *Taxus baccata* 38, *Cedrus libani* 21.
- *Species with no observation at all.* 26 target species, 110 units: *Fagus orientalis* 28 (Turkey),
  *Quercus pedunculiflora* 16 (Romania), *Juniperus excelsa* 12, *Abies cilicica* 7, *Pinus uncinata* 7
  (Spain), *Alnus viridis* 4, *Abies borisii-regis* 4, then 19 species with 1–3 units. None has an
  EU-Trees4F map; three have Atlas chorology (*Abies cilicica*, *Alnus viridis*, *Abies nebrodensis*).
- *Species with a thin sample.* 24 target species have fewer than 200 cells; for some the units
  outnumber the observations: *Pinus brutia* 18 cells / 59 units, *Cedrus libani* 10 / 21,
  *Pinus heldreichii* 1 / 4, *Tilia tomentosa* 190 / 21.

Together, 836 units carry at least one target species that is absent from EU-Forest or observed
more than 50 km away.

**Climate is there.** Every unit has the EU-Trees4F and CHELSA values at its reference point, in all
periods, Turkey included; 37 units lack WorldClim.

**What is not there.** `Units` holds the target species only; the "other species" list of EUFGIS was
never loaded.

## 2. Why the units are not merged into the EU-Forest layers

1. **Circularity.** The application reads a unit against the climate of its species. A unit that helps
   define that climate can no longer be at its edge.
2. **The base layer is a sample.** "All surveyed plots" is a roughly even sample of forest climate; units
   are placed by choice.
3. **A polygon is not an observation.** The shape is an area of conservation, not a statement that the
   species grows everywhere in it (Milko: nothing forbids a shape from holding a supermarket). The
   **climate reference point** is the unit's place for this purpose, as it already is in the
   scatterplot; its distance from the polygon is already checked (`gcu_loc_climate_distance`).
4. **"Other species"** carry no qualification and are left out, even if loaded later.

## 3. A finding about the application as it is

The units are already drawn at their reference points. So the supplement adds no new dots; what it
adds is **the statement of what a dot means**. Today:

- a Turkish unit of *Fagus sylvatica* or *Pinus brutia* appears far outside the species cloud and
  reads as "at the edge of its climate", when it is in fact **outside the surveyed area**: the cloud
  ends there because the inventories end there;
- a species without observations (`scatterplot: false` in the service's catalogue) has units and no
  species layer, with no word of explanation;
- a species with 18 cells gets an envelope like one with 35 000.

## 4. Proposal: a marked addition, three parts

**(a) Two facts per unit and target species, stored in `ScatterUnits`.** The distance from the unit's
reference point to the nearest surveyed cell (any species), and to the nearest observation of each
target species; from them a flag "outside the observations" above a threshold. Computed by a script
like `sources/units/distance.js`. Restricted units keep the flag only, never a distance that could
help locate them.

**(b) In the scatterplot, a supplementary species layer.** For the chosen species, the flagged units
are drawn a second time as presence points with their own mark and legend entry, worded as an
addition: *"Conservation units outside the EU-Forest observations (EUFGIS, added by this
application)"*. Rules: never part of the base layer, never part of the envelope, switched like any
layer. For the 26 species without observations it is the only species evidence, and makes them
choosable for the scatterplot. No envelope is drawn from units (28 points do not make a
highest-density region; and it would be circular).

**(c) Caveats where the sample cannot carry the reading.** The existing warning mark on the species:
"no EU-Forest observations", "fewer than N cells", and on a unit's hover window "outside the surveyed
area: its position against the species cloud says nothing about marginality".

On the map nothing changes: the units are already there, and restricted units stay off it.

**Work.** A loader script and its figures; three or four dictionary terms (two distances, the flag,
the layer's label and caveat texts) requested from `metadata-store` after reading the shared
guidelines; the service's catalogue and units answers; the layer, legend row and caveats in the
panes; one paragraph in the `SCATTER_UNITS` record. About the size of the reference-point distance
round of 2026-11-09.

## 5. To decide (Milko)

1. **Go or no go** on the proposal, whole or in parts; (c) alone already removes the misreading of §3.
2. **The threshold** of "outside the observations". 50 km is the figure used above (five EU-Trees4F
   cells; 16 % of the pairs). 10 km would flag 34 %.
3. **Thin samples:** the number of cells under which the envelope gets a caveat (or is not drawn).
4. **Later, a separate question:** vetted observation sources for the missing territories and species
   (national inventories outside EU-Forest, GBIF, the chorology ranges). That is a scientific
   extension of the base data, not this addition, and needs its own study.

Scripts of the measurement are not kept (scratch); the method is §1 and can be rerun from the three
collections.
