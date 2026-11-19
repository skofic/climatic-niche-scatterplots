# Handoff to `metadata-external-databases`: the theme of a dataset record, and links to datasets (2026-11-19)

From the `indicator-pair-scatterplots` session, carried by Milko.

## Why

Milko wants the Datasets Census to become linked pages inside the Metadata Store Interface: a summary
whose links open theme pages and dataset pages, as a term link opens a term page. `metadata-store` builds
the pages and a read-only dataset service. The design and Milko's decisions are in
`indicator-pair-scatterplots/notes/2026-11-18-handoff-metadata-store-datasets-pages.md` and
`…/2026-11-18-metadata-store-datasets-pages-answers.md`. Your census generator is the model for content
and layout, and it stays the static page until the interface pages exist.

Two things in it reach your records.

## 1. The theme is now data

The themes of the census ("Climate grids", "Drought grids", …) were written in `data/datasets_census.js`
(`THEMES`) and matched by collection name. They are now a controlled vocabulary in the dictionary
(`metadata-store` `ed7a8f6`, loaded on the laptop):

- **`std_dataset_theme`**, a property of the record **in `std_dataset_domn`**, one value per record,
  recommended now and required once every record carries one (Milko);
- its elements, proposed for your records as the census grouped them:

| Value | Title | Proposed for |
|---|---|---|
| `std_dataset_theme_climate` | Climate grids | `CHELSA_V2.1`, `WORLDCLIM_V2.1` |
| `std_dataset_theme_drought` | Drought grids | the seven `EDO_*` / `GDO_*` records |
| `std_dataset_theme_topography` | Unit topography | `COP_DEM_GLO30` |
| `std_dataset_theme_remote-sensing` | Remote sensing, unit shape averages | the thirteen `ShapeData` / `UnitData` records |

The other three elements (`_occurrences`, `_distribution`, `_scatterplot`) are used by the scatterplot
application's ten records, which this session set on 2026-11-19; do not change those.

**Asked:** set the theme on your 23 records, in your seed and on the laptop's `GeoService.Dataset`. The
assignment above is a proposal: each session decides its own records. If a record fits no element, say
so instead of forcing it.

Themes are kinds of data, not producers (Milko). The elements' definitions are your generator's blurbs;
`metadata-store` wrote a longer description for each. Read them, and report any that misdescribes your data.

## 2. The census generator

Once the records carry the theme, the generator can group by `std_dataset_domn.std_dataset_theme` and take
each heading and blurb from the term (`_title`, `_definition`), dropping its `THEMES` table. The
"Indicator-pair scatterplots" group then becomes three groups; `EU-TREES4F_PREDICTORS_2022` moves under
Climate grids.

## 3. Links to another dataset in a text

Decided by Milko: functionally every dataset stands on its own, and **no property links one record to
another**. A description may link to another dataset, written by its **code**:

```markdown
…coarsened from [ERA5-Land](dataset:ERA5_LAND_DAILY_AGGR)…
```

The link text is the dataset's title or the referring words, never the code. The interface will open the
dataset page from it. Use it where your descriptions name another dataset; nothing has to be rewritten
for its own sake.

## 4. Also retired

`std_dataset_group` is gone from the dictionary; no record used it.

## Please report back

Which records got which theme, any record that fits none, and whether the census now reads its groups
from the records.
