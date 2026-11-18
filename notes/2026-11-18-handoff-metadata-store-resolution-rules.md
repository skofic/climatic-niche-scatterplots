# Handoff to `metadata-store`: the two resolution terms after Milko's rules (2026-11-18)

From the `indicator-pair-scatterplots` session, carried by Milko. It amends the texts of the terms you
created today (`637d5d2`, your reply `2026-11-18-metadata-store-dataset-resolution-done.md` in
`metadata-external-databases/notes/`). No identifier, type, unit or range changes. Wording is yours and
Milko's; nothing here was written into the dictionary by this session.

The rules came out of fitting the terms to the ten dataset records of the scatterplot application. A
companion note goes to `metadata-external-databases`, which owns the other records
(`2026-11-18-handoff-metadata-external-databases-resolution-rules.md`, same folder).

## A. The rules (Milko, 2026-11-18)

1. **Every dataset we hold has a source resolution.** We did not generate the data: the record states
   how fine the source was. `std_dataset_resolution_source` is therefore expected on every geographic
   dataset record, grid or shape averages.
2. **A grid has two values.** `std_dataset_resolution_source` for the source and
   `std_dataset_resolution_grid` for the grid as stored in `GeoService`. They say different things even
   when the grid was stored as published.
3. **Shape averages have one value**, `std_dataset_resolution_source`.
4. **One dataset record, one resolution.** A record never states a resolution that holds for only part
   of its data. Indicators of one source that come at different resolutions are **different datasets**,
   one record per resolution. "The coarsest input" is not a resolution of the dataset: it makes the
   reader believe all the data had it.
5. **`std_dataset_resolution_grid` applies only when every cell has the same size**, and it stays in
   decimal degrees (Milko prefers degrees: a cell's size in metres and its area change with latitude).

## B. Texts to amend

| Term | What it says now | What it should say |
|---|---|---|
| `std_dataset_resolution_source`, `_definition` | "…the raster from which the dataset's shape averages were computed" | the pixel size of the **source data** the dataset was built from, whatever the dataset's scope |
| the same, `_description` | the sentence starting "Where the source combines bands or sensors of different pixel sizes, the value is that of the **coarsest input used**…" | removed. In its place rule 4: data of different resolutions are different datasets, each with its record |
| the same, `_description` | "It applies to datasets whose scope is shape averages…; a gridded dataset carries `std_dataset_resolution_grid` instead" | it applies to every geographic dataset; a gridded dataset carries **both** |
| the same, `_description` | the opening and the "how far an average can be trusted" paragraph speak of shape averages only | keep the paragraph as the case of shape averages; open with the general meaning |
| `std_dataset_resolution_grid`, `_description` | "a dataset of shape averages carries `std_dataset_resolution_source` instead" | a gridded dataset carries the source resolution **as well**; shape averages carry only the source resolution |
| the same | "a grid in a projected coordinate system, whose cells are measured in metres, has no value to give" | Milko finds the wording unclear and may revise it himself. The meaning to keep: the property is angular; a grid whose cells are not a constant size in degrees does not carry it (see §C) |
| the same | nothing on uniformity | rule 5: only when all cells have the same size |
| `std_dataset_resolution` (namespace), `_definition` and `_description` | "Which one applies follows the record's scope: … grid carries …; … shape carries …" | rules 1 to 4 |
| `std_dataset_prop`, `std_dataset` descriptions; the manual page `datasets.dataset-record` | the two bullets and sentences written today | brought in line; the split rule (4) belongs in the manual page as a rule of the dataset record |

The ERA5-Land sentence (an angular source recorded by the ground distance its provider states, `9000`)
stays: under rule 1 it becomes the general case for every latitude/longitude source.

## C. Two readings by this session, confirmed with Milko before this note was carried

1. **Grids in a projected system** (EU-Forest and the two Atlas layers: 1 km cells in ETRS89-LAEA).
   They carry `std_dataset_resolution_source` = `1000` and no `std_dataset_resolution_grid`, because a
   1 km cell is not a constant angle. No companion term in metres is asked for.
2. **Records with nothing to state** stay without both properties, and the texts should say so in
   plain words: datasets that are not geographic (a species table, a file manifest), outlines (the
   chorology polygons), and **compilation records**, which assemble several source datasets of
   different resolutions and name them (`SCATTER_OCCURRENCES`, `SCATTER_UNITS`). For those the reader
   goes to the source records.

## D. One thing to decide on your side

"Expected on every geographic dataset" (rule 1) is stronger than today's `_recommended`. Your reply
explains why a requirement across `std_dataset_domn` and `std_dataset_prop` cannot be expressed as a
rule edge. Unless you see a clean way, it stays optional in the schema and the rule lives in the texts
and the manual page.

## E. Please report back

The commit, and any text of §B you changed in substance. Two different roundings of the same value are
in the records today (`0.0833333333` and full precision `0.08333333333333333`); if the dictionary wants
one convention, say which.
