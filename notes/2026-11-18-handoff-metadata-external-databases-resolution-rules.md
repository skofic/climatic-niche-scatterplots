# Handoff to `metadata-external-databases`: the resolution rules for dataset records (2026-11-18)

From the `indicator-pair-scatterplots` session, carried by Milko. You filled
`std_dataset_resolution_grid` and `std_dataset_resolution_source` on your records today. While fitting
them to the scatterplot application's ten records, Milko set rules that reach your records too. The
term texts are being amended by `metadata-store` from a companion note
(`2026-11-18-handoff-metadata-store-resolution-rules.md`, in this repository's `notes/`); the
identifiers, types and units do not change.

## The rules (Milko, 2026-11-18)

1. **Every geographic dataset record states its source resolution**, grid or shape averages: we did
   not generate the data, so the record says how fine the source was
   (`std_dataset_resolution_source`, metres; for a latitude/longitude source the ground distance its
   provider states, as you did for ERA5-Land).
2. **A grid carries two values**: the source resolution and `std_dataset_resolution_grid`, the grid as
   stored in `GeoService`, in decimal degrees.
3. **Shape averages carry one value**, the source resolution.
4. **One dataset record, one resolution.** If the indicators of one source come at different
   resolutions, they are different datasets: one record per resolution. A record never states "the
   coarsest input": that makes the reader believe all its data had that resolution.
5. `std_dataset_resolution_grid` applies only when every cell of the grid has the same size.

## What this asks of your records

Read from the laptop's `GeoService.Dataset` on 2026-11-18. Check each against your own sources; this
session did not open them.

| Records | Today | Under the rules |
|---|---|---|
| `CHELSA_V2.1`, `WORLDCLIM_V2.1` | grid value only | add the source resolution (rule 2) |
| `EDO_CDI`, `EDO_FAPAR`, `EDO_HCWI`, `EDO_SMI`, `EDO_TWS`, `GDO_SMA`, `GDO_SPI3` (`DroughtObservatory`) | grid value only, one record per product | add the source resolution; confirm that no record holds indicators of different resolutions (`EDO_FAPAR` and `EDO_HCWI` each list two) and that each grid is stored as one cell size |
| the fourteen shape-average records (`ShapeData` / `UnitData`, `Shapes` / `UnitPolygons`) | source value only | nothing to add. **Review every value that was set by the coarsest-input rule**: where a record mixes inputs of different pixel sizes, split it, one record per resolution (rule 4) |
| `LANDSAT_C2_L2_ST` | `100`; `metadata-store` left you the choice between 30 (delivered) and 100 (coarsest input) | rule 4 decides the principle, the figure is yours: state the one resolution the record's data really has, or split |

Records with more than one indicator are the ones to look at first: `ERA5_LAND_DAILY_AGGR` (14),
`COP_DEM_GLO30` (7), `EFDA_v2_1_1` (2), `LANDSAT_C2_L2_ST` (2).

## What a split means

A new record per resolution, each with its own `std_terms`, and the data documents pointing to the
right record through `std_dataset_ids`. This session does not know how your loaders assign
`std_dataset_ids`; if a split touches many documents, say so to Milko before doing it.

## The census

`notes/DatasetsCensus.html` should take both resolutions from the records, as Milko asked, so that a
replaced source cannot leave the page and the data in disagreement. A copy is published without a
login at `https://panes.skofic.io/open/DatasetsCensus.html` (see `../shared/deployments.md`); it is
copied by hand, so tell Milko when a new version is ready.

## The scatterplot application's own records

For your information, since they sit in the same collection: `EU-TREES4F_PREDICTORS_2022` carries the
grid value (5 arc-minutes); `EU-FOREST_2017`, `ATLAS_RPP_2016` and `ATLAS_MHS_2016` (1 km cells in a
projected system) will carry the source resolution only; the compilation records
(`SCATTER_OCCURRENCES`, `SCATTER_UNITS`), the chorology outlines, the species table and the map
manifest carry neither, and `EU-TREES4F_MAPS_2022` (map files on two grids) stays one record without a
resolution, on Milko's decision. This session fills the others once the texts are amended.

## Please report back

Which records gained a value, which were split, and any record where the rules do not fit.
