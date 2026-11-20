# Reply to `metadata-external-databases`: short titles and a definition on our ten records (2026-11-20)

Answers `metadata-external-databases/notes/2026-11-20-handoff-indicator-pair-scatterplots-dataset-titles.md`.
Written to the laptop's `GeoService.Dataset` from `sources/datasets/records.js`; all ten validate against
`std_dataset`. **The texts are this session's proposal and await Milko's review.**

| Record | Title | Definition |
|---|---|---|
| `EU-FOREST_2017` | EU-Forest tree occurrences | Presence records of tree species in European forest plots, harmonised from national forest inventories and two European surveys; they describe the forests of around 2005. |
| `EU-TREES4F_PREDICTORS_2022` | EU-Trees4F climate predictors | The climate variables with which the EU-Trees4F species distribution models were calibrated and projected, for a historical baseline and for future periods under two emission scenarios. |
| `EU-TREES4F_MAPS_2022` | EU-Trees4F species distribution maps | Modelled climatic suitability of European tree species, for the present and for future periods under two emission scenarios. |
| `ATLAS_CHOROLOGY_2017` | Chorological maps for the main European woody species *(unchanged)* | Native and introduced ranges of the main European tree and shrub species, drawn by experts. |
| `ATLAS_RPP_2016` | European Atlas: relative probability of presence | Modelled relative probability of presence of tree taxa, from the European Atlas of Forest Tree Species. |
| `ATLAS_MHS_2016` | European Atlas: maximum habitat suitability | Modelled maximum habitat suitability of tree taxa, from the European Atlas of Forest Tree Species. |
| `SCATTER_OCCURRENCES` | EU-Forest cells in present and future climate | The cells surveyed in EU-Forest, each with the species observed there and its climate, present and future, from three climate sources. |
| `SCATTER_UNITS` | Conservation units in present and future climate | The EUFGIS gene conservation units, each with its target species and its climate, present and future, from three climate sources. |
| `SCATTER_SPECIES` | Species of the scatterplots and maps | The taxa named by the sources of the scatterplots and the maps, each with what exists for it. |
| `SCATTER_MAPS` | Map layer manifest | The map files the application serves, one entry per file. |

## How the rules fitted

- **Rule 1 (about 40 characters):** broken once, on purpose: the chorology record keeps the title of its
  publication (53 characters), which is how the dataset is known and cited.
- **Rule 2 (version):** none of ours has a version; the year of publication is in the code and the citation.
- **Rule 5 (no property repeated):** "1 km" and "5 arc-minutes" left the titles.
- **Definitions kept general (Milko, same day):** the detail of a study (how many species, how many
  models, which periods) belongs to `_description`, not to `_definition`. The descriptions of the two
  EU-Trees4F records gained a paragraph **"What is taken from the study"**, checked against the published
  files and the manifest: predictors, all seven variables, the future as the mean of the eleven models,
  the single-model layers not kept; maps, all 67 species, all periods and both scenarios, the SDM ensemble
  as probability and binary presence (2 211 files), without its standard deviation, the climatic ensemble
  and the single-model maps.
- **The prefix "Indicator pair scatterplots:"** is dropped from the four compilation records; their theme
  carries it.
- **Rule 4 (one sentence)** fits all ten.

## In the map and scatterplot application

The Source selector shows the record's title, so its options are now the short titles. The Source card
shows the definition of the unchosen sources, where it showed the first sentence of the description.
