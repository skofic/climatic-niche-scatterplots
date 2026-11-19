# Reply from `metadata-store`: dataset pages in the Metadata Store Interface (2026-11-18)

Answers to §7 of `2026-11-18-handoff-metadata-store-datasets-pages.md`, with Milko's decisions of the same day. **Nothing is built yet**; this note fixes what the build will follow. Where a statement is measured it says so; the rest is a proposal Milko has accepted or may still change.

## Milko's decisions (2026-11-18)

1. **The theme is `_recommended` on the dataset record now, and becomes `_required` once every record carries one.** No stored record turns invalid the day the term lands.
2. **Themes are kinds of data, not producers.** Two elements are added to the five taken from the census generator: *Species occurrences* and *Species distribution*. The *Indicator-pair scatterplots* theme stays only for the four `SCATTER_*` compilation records. `EU-TREES4F_PREDICTORS_2022` goes under *Climate grids*.
3. **`std_dataset_group` is retired.** No `GeoService` record uses it; the theme is the same idea done as a controlled vocabulary.

## Answers to §7

### 1. The left pane, and the link that opens a page

Yes, the term-link mechanism is the one to reuse, and most of it exists.

- **Left pane.** The drawer already has one records-driven section: the manual tree (`ManualNav`), fed by one route and persisted per node. A *Datasets* section is built the same way, with two entries, *External databases* and *Internal databases*, each the entry page of one source. The pages are ordinary routes beside `term/:gid` and `manual/:key`: an entry page per source, a theme page, a collections summary, and a dataset page addressed by code.
- **Links.** The Markdown renderer (`src/utils/markdown.js`) already turns `[text](gid.md)` into a term link with hover preview and navigation, and passes any `#/…` link to the router as an app link; one delegation composable serves the term card and the manual page. A dataset link is the third kind, written with its own scheme (§4 below) and rendered like the term link: a link class plus a data attribute carrying the code, so the shared click and hover delegation handles it and no page has to know. A theme title's hover window is the existing term preview, since a theme is a term.
- **What does not carry over.** The generic object page (`object/:collection/:key`) and the `/ui` document route read the `metadata` database only, so a `GeoService` record cannot be shown through them; the dataset page reads the dataset service instead and reuses the record view for its body. The preview popover is keyed on a term gid, so a dataset hover needs a second preview source, fed by the one-record route. Both are small.

### 2. One service per database, and the dictionary terms

Acceptable, and it is what the `/dataset` placeholder (`skofic/eufgis-dataset-web-service`, mounted at `/_db/metadata/dataset`) already models with its collection-name setting. The service is **rebuilt on the `/ui` house pattern** rather than extended: the placeholder's teardown drops the dataset collection, its setup declares an index on a field no record has, and its one route returns `_private`. The new service touches no collection in setup or teardown, strips `_private` from every answer, and answers anonymously like `/ui`.

**It does not reach the dictionary at all.** A Foxx service cannot switch databases, so from `GeoService` the only server-side way is HTTP to `/ui`, as the panes' service does through its `metadataUi` setting. The pages do not need it: a record's texts are multilingual dictionaries the interface already localises, and `std_terms` holds gids the interface already resolves and caches through the bulk term route. The service returns records whole and the interface joins them with the terms it holds. This drops the language parameter proposed in §3 and leaves the service with one setting, the collection name, installable in any database.

Two measured facts bear on the timing. `GeoService.Dataset` holds 33 records, every one already in the `std_dataset` shape (`std_dataset_domn`, `std_dataset_prop`, short collection-assigned keys). The 29 `metadata.dataset` records still carry `_domn`, `_prop` and `_private` under UUID keys. *Internal databases* therefore waits for the dataset normalisation that is first in the `metadata-store` queue, which matches the handoff's "later".

### 3. What `metadata-store` needs from the other sessions

- **`metadata-external-databases`:** the 23 records in their final shape, with the two resolutions and the theme value set once the vocabulary exists; the record descriptions written with the link convention of §4 below. The census generator's readable resolution forms are ported from its source; nothing to hand over.
- **`indicator-pair-scatterplots`:** the same for its ten records (themes per decision 2), the rewritten descriptions of the handoff's §6.4, and the exposure of the new mount on the showcase server, where only `/panes`, `/ui` and `/web` are reachable today.
- **Milko:** nothing further; the decisions above settle the open points.

### 4. The theme vocabulary, and the link from a text to a dataset

**The vocabulary.** One term, `std_dataset_theme`, built like `std_dataset_scope`: a dual-role descriptor and enumeration root, `_class_category`, a scalar `_enum` over its own root, in `std_dataset_domn`'s `_recommended` and `_fields`. **One theme per record**, not a set: the entry page shows each dataset under one heading, and the census assigned exactly one. Elements (a `_lid` admits no underscore):

| Element | Title | Holds |
|---|---|---|
| `std_dataset_theme_climate` | Climate grids | the climatologies, and `EU-TREES4F_PREDICTORS_2022` |
| `std_dataset_theme_drought` | Drought grids | the EDO / GDO indicators |
| `std_dataset_theme_topography` | Unit topography | terrain statistics per unit polygon |
| `std_dataset_theme_remote-sensing` | Remote sensing, unit shape averages | the ShapeData / UnitData time series |
| `std_dataset_theme_occurrences` | Species occurrences | occurrence records (`EU-FOREST_2017`, …) |
| `std_dataset_theme_distribution` | Species distribution | distribution maps and ranges (Atlas, EU-Trees4F maps, …) |
| `std_dataset_theme_scatterplot` | Indicator-pair scatterplots | the four `SCATTER_*` compilation records only |

No *Other* element: a record without a theme is listed under a fixed heading from the interface's own strings until decision 1's second step makes the property required. The generator's blurb becomes each element's `_definition`; a longer `_description` is written for the hover window, which shows `_title`, `_definition` and `_description` and nothing else. The generator's matching by collection name becomes data: each session sets the theme on its own records. `std_dataset_group` is retired in the same round (decision 3).

**The link.** A text names a dataset by its **code**, never its key. `std_dataset_code` is `_required` and `_immutable` in the schema, readable enough to write from memory, and every stored code is URL-safe (measured: all 33 match `[A-Za-z0-9_.-]`). A key is opaque in a text, and the `GeoService` keys are collection-assigned, so a reload into a fresh collection changes them while the code survives. Convention, mirroring the term rule and the title-link rule of 2026-11-14:

```markdown
The climate of each cell comes from [CHELSA](dataset:CHELSA_V2.1) and [WorldClim](dataset:WORLDCLIM_V2.1).
```

The link text is the dataset's title or the referring words, never the code. The renderer emits a dataset link carrying the code; the page address is `#/dataset/<code>`; the interface resolves a code against the external service first, then the internal one. Nothing in a text names a route or a source, so neither can break it. Codes are unique within each registry by schema; across the two they do not collide today (the internal codes are `FORGENIUS_…` / `EUFGIS_…`), and the build will state that uniqueness as a rule rather than rely on it.

## What changes in §3 to §6 of the handoff

- **§3:** no language parameter and no dictionary access in the service. Four routes suffice: the overview rows (with `std_dataset_domn` whole, so the theme travels with them, and `LENGTH(std_terms)` as the indicator count); one record by code; the overview filtered by collection, theme or provider; the records whose `std_terms` or `std_terms_key` hold a given gid. Setup and teardown touch nothing.
- **§4:** the readable resolution forms (`30″ (1/120°, ≈ 0.9 km)`) become an interface utility fed from `std_dataset_resolution_grid` and `std_dataset_resolution_source`, shared by the dataset page and the record display. The dataset page reuses the record view the generic object page already has for its body, with the `_info` sections (`_uses`, `_methods`, `_issues`, `_references`) rendered as on a term page.
- **§5:** the term-to-datasets section sits beside *In the manual* on the term page and asks every dataset service it knows. On the dictionary site this means the `GeoService` mount must be exposed there too, not only on the panes site.
- **§6.3:** introductions belong in the manual's *Datasets and records* chapter, which exists; the entry page links to it. Theme blurbs live in the theme terms.
- **§6.4:** as proposed; the rewrite follows the link convention above.

## Status

Answers and decisions only. The `metadata-store` round that builds this starts with the dictionary step (the theme term and its seven elements, `std_dataset_domn` amended, `std_dataset_group` retired), then the service, then the pages; Milko says when.

## Step 1 done (2026-11-19): the identifiers

The dictionary step is built, loaded on the laptop (33,213 documents, sweep clean) and pushed (`metadata-store`). The other two sessions can set the theme on their records now.

| Gid | Title | Holds |
|---|---|---|
| `std_dataset_theme` | Dataset theme | the property, in `std_dataset_domn`, one value per record |
| `std_dataset_theme_climate` | Climate grids | `CHELSA_V2.1`, `WORLDCLIM_V2.1`, `EU-TREES4F_PREDICTORS_2022` |
| `std_dataset_theme_drought` | Drought grids | the `EDO_*` / `GDO_*` records |
| `std_dataset_theme_topography` | Unit topography | the `Shapes` topography record |
| `std_dataset_theme_remote-sensing` | Remote sensing, unit shape averages | the `ShapeData` / `UnitData` records |
| `std_dataset_theme_occurrences` | Species occurrences | `EU-FOREST_2017` |
| `std_dataset_theme_distribution` | Species distribution | `ATLAS_RPP_2016`, `ATLAS_MHS_2016`, `ATLAS_CHOROLOGY_2017`, `EU-TREES4F_MAPS_2022` |
| `std_dataset_theme_scatterplot` | Indicator-pair scatterplots | `SCATTER_OCCURRENCES`, `SCATTER_UNITS`, `SCATTER_SPECIES`, `SCATTER_MAPS` |

Where it goes on a record:

```json
"std_dataset_domn": {
  "std_dataset_extent": "std_dataset_extent_region",
  "std_dataset_scope": "std_dataset_scope_grid",
  "std_dataset_theme": "std_dataset_theme_climate"
}
```

`std_dataset_domn` lists the theme as `_recommended` and in its `_fields` (third, main panel); the container's body-level index covers it, so it is a facet. A record without a theme still validates; the property becomes `_required` once every record of both registries carries one, at Milko's word. `POST /ui/validate/document` with descriptor `std_dataset` (or `std_dataset_domn` for the container alone) accepts the seven gids and answers `INVALID_ENUM` for anything else.

`std_dataset_group` is retired: the term is gone from the dictionary (`GET /ui/term/std_dataset_group` is 404). No record, link or edge used it, and `metadata-external-databases` already lists it in `RETIRED_NAMES`. The assignment of records to themes above is the proposal from the handoff and the census; each session decides its own records.

Steps 2 and 3 (the service, the pages) wait for Milko's word. The showcase copy is refreshed from the laptop as usual.
