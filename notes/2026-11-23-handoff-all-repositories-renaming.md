# Handoff: two repositories and the product renamed (2026-11-23)

**From:** the `climatic-niche-scatterplots` session, 2026-11-23. **To:** `metadata-store` (items 1–3),
`metadata-external-databases` (end of item 2, item 3) and `metadata-store-interface` (item 3 only). Carried by Milko.

Milko renamed two repositories the same day, on GitHub and on the laptop:

| Old name | New name |
|---|---|
| `indicator-pair-scatterplots` | **`climatic-niche-scatterplots`** |
| `indicator-pair-scatterplots-service` | **`climatic-niche-service`** |

GitHub redirects the old addresses. The Foxx service keeps its mount, `GeoService` `/panes`; only its
manifest name changed. The collections (`Scatter*`, `Panes*`) and the dataset codes (`SCATTER_*`) are
unchanged. Already done by this session: `../shared/deployments.md`, `../shared/README.md`, every file of
`skofic.io` that named the old folders, our ten dataset records (their GitHub link).

## 1. Manual page `using/map-and-scatterplot` (`metadata-store`)

`data/manual/using/map-and-scatterplot.eng.md`, line 50, says the panes "are being built in the
`indicator-pair-scatterplots` project". Please change the name to `climatic-niche-scatterplots`; nothing
else on the page depends on it.

## 2. The product is renamed too (`metadata-store`)

Milko's decision of the same day: the product takes the new name as well. *Indicator pair scatterplots*
becomes **climatic niche scatterplots** (title case: *Climatic niche scatterplots*; singular in "the
climatic niche scatterplot pane"). The axes are still pairs of indicators; where a text speaks of the
axes, "indicator pair" stays. Places found on 2026-11-23 (please check for others):

- `data/EUFGIS/std/terms.enumerations.json`, `std_dataset_theme_scatterplot`: `_title`
  *Indicator-pair scatterplots* → *Climatic niche scatterplots*; `_definition` and `_description`
  ("the indicator-pair scatterplots", "the indicator-pair scatterplot panes").
- `data/EUFGIS/std/terms.properties.json`, `std_dataset_theme` description: the line on
  `std_dataset_theme_scatterplot` ("indicator-pair scatterplots: the compilations …").
- `data/ui/terms.namespaces.json`: the `ui_layout` text ("the indicator pair scatterplot and the page
  that hosts them") and the `ui_layout_scatterplot` text ("The settings of the indicator pair
  scatterplot pane").
- `data/ui/terms.datasets.json`: the section heading **Indicator-pair scatterplots.** of the external
  datasets text.
- `data/EUFGIS/env/terms.properties.json`: the seven derived indicators
  (`env_climate_tas_summer`, `_tas_coldest`, `_pr_summer`, `_pr_winter`, `_continentality`,
  `_srad_spring-summer`, `_pr_seasonality-ratio`), "derived at load time by the indicator-pair
  scatterplot project" → "by the climatic niche scatterplot project".
- `data/manual/using/map-and-scatterplot.eng.md`: the `definition` ("an indicator pair scatterplot")
  as well as line 50 of item 1.
- `data/manual/datasets/dataset-record.eng.md`, line 28: the theme list ("indicator-pair scatterplots").
- The generated `docs/` follow.

Our ten dataset records already use the new name in their descriptions (reloaded on the laptop and the
showcase server). After the dictionary is reloaded, Milko copies it to the showcase server
(`ONLY=metadata node slim.mjs export && ./import-on-server.sh …` in `skofic.io`).

For `metadata-external-databases`: `CLAUDE.md` line 107 ("the indicator-pair scatterplots'") and the
fixture `lib/fixtures/dataset.snapshot.json` (a copy of the `std_dataset_theme` text, regenerated from
the dictionary once it changes).

## 3. One dated line in `CLAUDE.md` (all three)

Please add one dated line saying the two repositories and the product were renamed, with the table above. Entries that
point to our notes as `indicator-pair-scatterplots/notes/…` stay as written (they are history); the
files are now under `climatic-niche-scatterplots/notes/`, same file names.
