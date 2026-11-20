# Reply to `metadata-external-databases`: short titles and a definition on our ten records (2026-11-20)

Answers `metadata-external-databases/notes/2026-11-20-handoff-indicator-pair-scatterplots-dataset-titles.md`.
Written to the laptop's `GeoService.Dataset` from `sources/datasets/records.js`; all ten validate against
`std_dataset`. **The texts are this session's proposal and await Milko's review.**

| Record | Title | Definition |
|---|---|---|
| `EU-FOREST_2017` | EU-Forest tree occurrences | Presence of tree species in forest plots across Europe, harmonised by the Joint Research Centre from national forest inventories and the Forest Focus and BioSoil surveys; forests of around 2005. |
| `EU-TREES4F_PREDICTORS_2022` | EU-Trees4F climate predictors | Temperature, precipitation and continentality variables behind the EU-Trees4F species distribution models: WorldClim 1.4 for the 1961–1990 baseline, and EURO-CORDEX regional climate projections for three periods to 2080 under RCP 4.5 and RCP 8.5. |
| `EU-TREES4F_MAPS_2022` | EU-Trees4F species distribution maps | Climatic suitability of European tree species from the EU-Trees4F ensemble of species distribution models, for the period centred on 2005 and for three future periods to 2095 under RCP 4.5 and RCP 8.5. |
| `ATLAS_CHOROLOGY_2017` | Chorological maps for the main European woody species *(unchanged)* | Native and introduced ranges of the main European tree and shrub species, drawn by experts from the botanical literature for the European Atlas of Forest Tree Species. |
| `ATLAS_RPP_2016` | European Atlas: relative probability of presence | Relative probability of presence of tree taxa, modelled from harmonised forest plot data (C-SMFA model); European Atlas of Forest Tree Species, Joint Research Centre, 2016. |
| `ATLAS_MHS_2016` | European Atlas: maximum habitat suitability | Maximum habitat suitability of tree taxa, modelled from the bioclimate of the plots where each taxon occurs (RDS-MHS model); European Atlas of Forest Tree Species, Joint Research Centre, 2016. |
| `SCATTER_OCCURRENCES` | EU-Forest cells in present and future climate | Species observed in each cell surveyed by EU-Forest, with the climate indicators of the cell from EU-Trees4F, WorldClim 2.1 and CHELSA 2.1, for the reference periods and for modelled future periods to 2100. |
| `SCATTER_UNITS` | Conservation units in present and future climate | Target species and climate indicators of each EUFGIS gene conservation unit at its climate reference point, from EU-Trees4F, WorldClim 2.1 and CHELSA 2.1, for the reference periods and for modelled future periods to 2100. |
| `SCATTER_SPECIES` | Species of the scatterplots and maps | Taxa named by the sources of the scatterplots and the maps, by accepted scientific name, with the occurrences, distribution maps and conservation units that exist for each. |
| `SCATTER_MAPS` | Map layer manifest | Map files served by the application, one entry per file: species, source, period, scenario and variant, with the projection, licence and citation of the file. |

## How the rules fitted

- **Rule 1 (about 40 characters):** broken once, on purpose: the chorology record keeps the title of its
  publication (53 characters), which is how the dataset is known and cited.
- **Rule 2 (version):** none of ours has a version; the year of publication is in the code and the citation.
- **Rule 5 (no property repeated):** "1 km" and "5 arc-minutes" left the titles.
- **Definitions aligned with your 23 (Milko, same day):** what is described, from what source, for which
  periods, in your wording style. Counts of a study (how many species, how many models) stay out of the
  definition and go to `_description`. The descriptions of the two
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
