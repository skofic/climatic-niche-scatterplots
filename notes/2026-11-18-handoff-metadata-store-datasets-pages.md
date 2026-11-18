# Handoff to `metadata-store`: dataset pages in the Metadata Store Interface (2026-11-18)

From the `indicator-pair-scatterplots` session, carried by Milko. This is a **specification and a set of
questions**, not yet an order to build: Milko decides the assignment once you have answered §7.

## 1. What Milko wants

`metadata-external-databases` generates a single long page, the *Datasets Census*
(`metadata-external-databases/notes/DatasetsCensus.html`, generator `data/datasets_census.js`; a copy is
public at `https://panes.skofic.io/open/DatasetsCensus.html`). Milko likes its structure and style very
much and wants **the same content inside the Metadata Store Interface**, in his words:

- an entry for datasets in the left pane;
- not one long document but **a summary whose links open pages, exactly like a link to another term in
  a term page**: a summary leads to another summary section, and so on;
- no search form;
- **summary views**, and many links: to external resources and from one dataset to other datasets;
- it replaces the earlier idea of a dataset form built like the term form.

It is **not** part of the idea document on terms in forms (`../shared/Terms and User Interface/`): that
process is about search and input forms.

## 2. Which records

Two collections share the `std_dataset` schema:

| Collection | Holds | Left-pane entry (Milko's suggestion) | When |
|---|---|---|---|
| `GeoService.Dataset` (33 records) | external databases | **External Databases** | now |
| `metadata.dataset` (29 records) | internal datasets | **Internal Databases** | later, same pages |

They are separate for size reasons. Two entries, one per collection, also settle where each is read from.

## 3. Proposed reading side: one small read-only service, mounted once per database

Milko: the dataset Foxx service comes forward with this work, and **the collection name is a setting of
the service**. This session's proposal on that base:

- one service, the same code, installed in `GeoService` (setting: `Dataset`) and later in `metadata`
  (setting: `dataset`); the interface reads the first for *External Databases*, the second for *Internal
  Databases*;
- read-only, anonymous like `/ui`, answering in the requested language with English as fallback;
- it reads the indicator terms (`std_terms`) from the dictionary; from inside `GeoService` that is
  another database, which is your call to solve (a setting with the dictionary's address, or the
  interface joining the two answers itself, since it already holds the terms).

Routes the pages need, to be shaped by whoever builds the pages:

| Need | Answer |
|---|---|
| the overview | every record's code, title, scope, extent, the two resolutions, dates, count, number of indicators, collections, theme |
| one dataset | the whole record |
| the datasets of a collection, of a theme, of a provider | the overview rows, filtered |
| the datasets that hold a given term | for the term page's back-link (§5) |

The panes' service already reads these records for its Source selector
(`indicator-pair-scatterplots-service`, `lib/state.js` `datasetByCode()`, `lib/queries.js` catalogue): the
`_info` texts in the configured language plus `_references`. It can serve as a reference, not as the base.

## 4. The pages, mapped from the census

| Census part | Becomes | Built from |
|---|---|---|
| *At a glance*: one row per dataset, grouped by theme (dataset, type, resolution, time series, records, indicators) | the **entry page** of the left-pane item; each row opens its dataset page, each theme heading its theme page | overview route |
| *Collections*: collection, its datasets, its record count | a **collections summary**; a collection opens the list of its datasets | `std_dataset_prop._collection_list`, `count` |
| a theme heading with its blurb and its datasets | a **theme page**: the blurb, then the overview rows of the theme | see §6.1 |
| a dataset section: code, title, facts (data type and extent, resolution, time series, records, collections), description, publication, the indicator table (title, identifier, definition, unit) | a **dataset page**; every indicator links to its term page, every collection to the collections summary, the theme to its page | the record; `std_terms` resolved in the dictionary |

A dataset page should also show what the record holds beyond the census: `_uses`, `_methods`, `_issues`,
`_references` (`_citation`, `_provider`, `_url`), as the term page does for a term.

Resolution is shown from the two properties (`std_dataset_resolution_source`, metres;
`std_dataset_resolution_grid`, degrees to ten decimals), never from the description. The census's
readable forms ("30″ (1/120°, ≈ 0.9 km)") are computed by its generator; the same forms are wanted.

## 5. Links

- **Dataset → term**: each indicator of `std_terms` and each key term of `std_terms_key`.
- **Term → datasets**: on a term page, the datasets that hold the term. This is the link Milko describes
  for the manual ("a section in the term page that links to…"), applied to datasets.
- **Dataset → external resources**: `_references._url`, `_citation` (the DOIs), `_provider`.
- **Dataset → dataset**: see §6.2.
- **Panes → dataset page**: the Source card of the map and scatterplot application will link to the
  dataset page once it has an address (this session).

## 6. What the records cannot give today

1. **Themes.** "Climate grids", "Drought grids", "Unit topography", "Remote sensing — unit shape
   averages", "Indicator-pair scatterplots" and their blurbs are **written in the census generator** and
   matched by collection name (`THEMES` in `data/datasets_census.js`). Pages need them as data: an
   enumeration with titles and descriptions, and a property on the record, or a rule on collections.
   Yours and Milko's to design.
2. **Links between datasets.** No property says that one dataset is derived from, compiled from or
   supersedes another. Our own records are the clearest case: `SCATTER_OCCURRENCES` compiles `EU-FOREST_2017`,
   `EU-TREES4F_PREDICTORS_2022`, `WORLDCLIM_V2.1` and `CHELSA_V2.1`, and says so only in prose. A list of
   record codes with a stated relation would carry it.
3. **Summary texts.** The census's page introduction and footer are written in the generator. If the
   entry pages need introductions, they need a home (manual pages, or the theme terms' descriptions).
4. **Texts written for another reader.** The descriptions of this session's ten records read like
   developer notes; this session rewrites them for a reader once the pages exist to judge them in.

## 7. Questions for you

1. How would you add a records-driven section to the left pane, and is "a link opens a page like a term
   link" the mechanism you would reuse?
2. Is one service mounted per database (§3) acceptable, and how should it reach the dictionary terms from
   `GeoService`?
3. **Who builds the service?** This session's recommendation is that the session that builds the pages
   builds the service too, so that the two are shaped together and no missing field costs a round trip
   through Milko. That is you. The alternatives are this session (it built the panes' service) or
   `metadata-external-databases` (it owns `GeoService` and the census). Say what you prefer.
4. Which new terms do §6.1 and §6.2 need, in your view?

## 8. What the other sessions bring

- `metadata-external-databases`: the census generator as the reference for content and layout; the
  content of its 23 records; it keeps generating the static page until the interface pages exist.
- `indicator-pair-scatterplots` (this session): the content of its ten records; the showcase server, where
  a new service mount must be opened in the web server's configuration before it is reachable
  (`../shared/deployments.md`: only `/web`, `/ui` and `/panes` are exposed there today); the link from the
  panes.

## 9. Please report back

Your answers to §7, and what you would change in §3 to §6.
