# Handoff to `metadata-store`: dataset pages in the Metadata Store Interface (2026-11-18)

From the `indicator-pair-scatterplots` session, carried by Milko. This is a **specification and a set of
questions**. Milko has decided the assignment (§3, §7): **you build the service and the pages**. For now
he asks only for your answers to §7; nothing is to be built yet.

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
- **Dataset → dataset**: links inside the descriptions only, see §6.2.
- **Map and scatterplot application → dataset page**: in that application the climate *Source* selector
  opens a reading card that lists the sources, each built from its dataset record. Each source's title
  there will link to its dataset page in the interface, as term titles in those cards link to term pages.
  This session does it once the pages have addresses, so the address of a dataset page should be stable
  and built from the record's code or key.

## 6. What the records cannot give today

1. **Themes. Decided by Milko (2026-11-18).** Today "Climate grids", "Drought grids", "Unit topography",
   "Remote sensing — unit shape averages", "Indicator-pair scatterplots" and their blurbs are **written in
   the census generator** and matched by collection name (`THEMES` in `data/datasets_census.js`). They
   become dictionary data:
   - **an enumeration root: a controlled vocabulary of dataset themes**, one element per theme;
   - **the theme is a value of the dataset record, in the `std_dataset_domn` container**;
   - the interface takes a section's title from the element's `_title`;
   - **hovering the title opens a hover window in the interface's style showing `_title`, `_definition`
     and `_description`**, and no other field of the term.

   Milko calls this a model case of dictionary terms in a user interface. The identifiers, the property's
   name and whether a record takes one theme or several are yours and his. The generator's titles and
   blurbs are the starting texts. Each session then sets the theme on its own records.
2. **Links between datasets. Decided by Milko (2026-11-18): in the texts only.** Functionally every
   dataset stands on its own and depends on no other: **no property links one record to another**. A
   record's description may contain a link to another dataset (for example `SCATTER_OCCURRENCES` naming
   `EU-FOREST_2017`, `EU-TREES4F_PREDICTORS_2022`, `WORLDCLIM_V2.1` and `CHELSA_V2.1`, today in plain
   prose). What is missing is only **the convention for writing such a link** in a Markdown text, so that
   the interface opens the dataset page as it opens a term page from a term link, and so that the link
   shows the dataset's title, never its code or key.
3. **Summary texts.** The census's page introduction and footer are written in the generator. If the
   entry pages need introductions, they need a home (manual pages, or the theme terms' descriptions).
4. **Texts written for another reader.** The descriptions of this session's ten records read like
   developer notes; this session rewrites them for a reader once the pages exist to judge them in.

## 7. Questions for you

1. How would you add a records-driven section to the left pane, and is "a link opens a page like a term
   link" the mechanism you would reuse?
2. Is one service mounted per database (§3) acceptable, and how should it reach the dictionary terms from
   `GeoService`?
3. **The service is yours to build, with the pages** (Milko: you know the standards he wants in Foxx
   services and built the dictionary's). Say what you need from the other two sessions to do it.
4. The theme vocabulary (§6.1): the identifiers and the property you propose. The link from a text to a dataset
   (§6.2): the convention you propose, and whether it names the record by its code or its key.

## 8. What the other sessions bring

- `metadata-external-databases`: the census generator as the reference for content and layout; the
  content of its 23 records; it keeps generating the static page until the interface pages exist.
- `indicator-pair-scatterplots` (this session): the content of its ten records; **every installation on
  the showcase server** (Milko), where a new service mount must also be opened in the web server's
  configuration before it is reachable (`../shared/deployments.md`: only `/web`, `/ui` and `/panes` are
  exposed there today); the link from the map and scatterplot application (§5).

## 9. Please report back

Your answers to §7, and what you would change in §3 to §6.
