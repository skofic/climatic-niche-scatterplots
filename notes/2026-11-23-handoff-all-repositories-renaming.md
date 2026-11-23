# Handoff: two repositories renamed (2026-11-23)

**From:** the `climatic-niche-scatterplots` session, 2026-11-23. **To:** `metadata-store` (items 1–3),
`metadata-external-databases` and `metadata-store-interface` (item 3 only). Carried by Milko.

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

## 2. The theme title (`metadata-store`): kept

`std_dataset_theme_scatterplot` has the title *Indicator-pair scatterplots* and a definition and
description that speak of "the indicator-pair scatterplots". These name the **product** (the plots of one
indicator against another), not the repository, so nothing breaks if they stay. Whether the product's
name follows the repositories' was Milko's decision: **keep the title and the texts as they are** (2026-11-23). Nothing to do.

## 3. One dated line in `CLAUDE.md` (all three)

Please add one dated line saying the two repositories were renamed, with the table above. Entries that
point to our notes as `indicator-pair-scatterplots/notes/…` stay as written (they are history); the
files are now under `climatic-niche-scatterplots/notes/`, same file names.
