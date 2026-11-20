# Reply to `metadata-external-databases`: short titles and a definition on our ten records (2026-11-20)

Answers `metadata-external-databases/notes/2026-11-20-handoff-indicator-pair-scatterplots-dataset-titles.md`.
Written to the laptop's `GeoService.Dataset` from `sources/datasets/records.js`; all ten validate against
`std_dataset`. **The texts are this session's proposal and await Milko's review.**

| Record | Title | Definition |
|---|---|---|
| `EU-FOREST_2017` | EU-Forest tree occurrences | Presence records of tree species in the plots of 21 National Forest Inventories and of the Forest Focus and BioSoil surveys, harmonised by the Joint Research Centre to the cells of the INSPIRE grid; they describe the forests of around 2005. |
| `EU-TREES4F_PREDICTORS_2022` | EU-Trees4F climate predictors | The seven temperature and precipitation variables with which the EU-Trees4F species distribution models were calibrated and projected: WorldClim 1.4 for the 1961–1990 baseline, and the mean of eleven EURO-CORDEX regional climate models for three periods to 2080 under RCP 4.5 and RCP 8.5. |
| `EU-TREES4F_MAPS_2022` | EU-Trees4F species distribution maps | Climatic suitability of 67 European tree species, modelled by an ensemble of species distribution models for the period centred on 2005 and for three future periods to 2095 under RCP 4.5 and RCP 8.5. |
| `ATLAS_CHOROLOGY_2017` | Chorological maps for the main European woody species *(unchanged)* | Native and introduced ranges of the main European tree and shrub species, drawn by experts from the botanical literature for the European Atlas of Forest Tree Species. |
| `ATLAS_RPP_2016` | European Atlas: relative probability of presence | Relative probability of presence of tree taxa, modelled from harmonised forest plot data by constrained spatial multi-frequency analysis (C-SMFA); European Atlas of Forest Tree Species, Joint Research Centre, 2016. |
| `ATLAS_MHS_2016` | European Atlas: maximum habitat suitability | Maximum habitat suitability of tree taxa, modelled as the similarity of the bioclimate of each place to that of the plots where the taxon occurs (RDS-MHS); European Atlas of Forest Tree Species, Joint Research Centre, 2016. |
| `SCATTER_OCCURRENCES` | EU-Forest cells in present and future climate | The cells surveyed in EU-Forest, each with the species observed there and its climate indicators from EU-Trees4F, WorldClim 2.1 and CHELSA 2.1, for the reference periods and for modelled future periods to 2100. |
| `SCATTER_UNITS` | Conservation units in present and future climate | The EUFGIS gene conservation units, each read at its climate reference point, with its target species and its climate indicators from EU-Trees4F, WorldClim 2.1 and CHELSA 2.1, for the reference periods and for modelled future periods to 2100. |
| `SCATTER_SPECIES` | Species of the scatterplots and maps | The taxa named by any source of the scatterplots and the maps, by accepted scientific name, each with what exists for it: occurrences, distribution maps and conservation units. |
| `SCATTER_MAPS` | Map layer manifest | The map files the application serves, one entry per file, stating the species, the source, the period, the scenario and the variant of the map, with the projection, the licence and the citation of the file. |

## How the rules fitted

- **Rule 1 (about 40 characters):** broken once, on purpose: the chorology record keeps the title of its
  publication (53 characters), which is how the dataset is known and cited.
- **Rule 2 (version):** none of ours has a version; the year of publication is in the code and the citation.
- **Rule 5 (no property repeated):** "1 km" and "5 arc-minutes" left the titles. Two definitions state a
  number of species or of models (67 species; eleven models): these are facts of the published study, not
  counts of stored records.
- **The prefix "Indicator pair scatterplots:"** is dropped from the four compilation records; their theme
  carries it.
- **Rule 4 (one sentence)** fits all ten.

## In the map and scatterplot application

The Source selector shows the record's title, so its options are now the short titles. The Source card
shows the definition of the unchosen sources, where it showed the first sentence of the description.
