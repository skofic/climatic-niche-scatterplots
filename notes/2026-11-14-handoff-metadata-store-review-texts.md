# Handoff to `metadata-store`: texts and terms after Milko's review of the panes (2026-11-14)

From the `indicator-pair-scatterplots` session, carried by Milko. Milko reviewed the panes with the term
cards on 2026-11-14 and decided the changes below. Identifiers of new terms, final wording and grammar are
yours and Milko's; nothing here was written into the dictionary by this session.

Vocabulary used below (Milko's): a **clear hover** is the panes' reading card (it can be pinned, it carries
links; it shows a term's definition, description, uses, methods and issues); a **dark hover** is the
browser's plain tooltip (a hint; it shows the definition only).

---

## A. Titles to change

| Term | Title now | Title wanted | Why |
|---|---|---|---|
| `gcu_loc_coordinates-restriction_level` | Coordinates restriction level | **Restriction level** | the section caption already says what is restricted |
| `ui_layout_scatterplot_layer` | Layer drawing | **Plot layers** | the counterpart of "Map layers" |
| `ui_layout_scatterplot_X` | X axis indicator | **X indicator** | it sits in a section captioned "Axes" (§C) |
| `ui_layout_scatterplot_Y` | Y axis indicator | **Y indicator** | the same |
| `ui_layout_mode` | Pane layout | **Panes** | it sits in a section captioned "Layout" (§C) |
| `ui_layout_map_placement` | Map placement | **Map** | the same |

Texts that quote the old titles (descriptions, the manual page) follow.

## B. One text to change

`ui_layout_label_search`, `_definition` (shown as a dark hover on the search box). Milko's text, **grammar
to be polished by you**:

> Provide scientific name, country code or name, or conservation unit number: as you type, matching
> entries will be available for selection.

## C. New caption terms

Captions of sections of the panes: labels, not controls (no `_term_role_control`). Each needs a title, a
definition and, where said, a description, because the caption opens a clear hover.

| Proposed place | Title | Content |
|---|---|---|
| a label for the restriction section (today the caption is the data descriptor `gcu_loc_coordinates-restriction`, whose text speaks of a `Yes` value and confuses) | **Coordinates privacy** | Definition and description, Milko's content: some conservation units provide no location data, for various reasons: the unit lies on private land, or it hosts rare and delicate specimens, so that it is better that people do not visit it. Add what the panes do with it: such units are placed in the scatterplot by their climate, which reveals no location, and never appear on the map below the manage level. Link to `gcu_loc_coordinates-restriction` and to the restriction level |
| a label for the layout section of the common bar | **Layout** | Definition: how the map and the scatterplot panes are arranged on the screen. It captions `ui_layout_mode` and `ui_layout_map_placement` |
| a label for the axes section of the scatterplot (today a hard-coded "X · Y") | **Axes** | Definition: the two climate indicators the scatterplot is drawn on. It captions `ui_layout_scatterplot_X` and `_Y` |
| a label for the Atlas row of the map layers (today hard-coded "Atlas") | **Atlas** | A **thorough** description with links and the reference, see C.1 |
| a label for the EU-Trees4F row of the map layers (today hard-coded "EU-Trees4F") | **EU-Trees4F** | A **thorough** description with links and the reference, see C.2 |

### C.1 Atlas: facts for the description (to be worded by you)

- The European Atlas of Forest Tree Species (San-Miguel-Ayanz et al. 2016, Joint Research Centre) is built
  from the same harmonised forest plot data as EU-Forest.
- The row holds two layers per species, both at 1 km (ETRS89-LAEA): **relative probability of presence**
  (`ui_layout_map_layer_rpp`; the C-SMFA model: how likely the species is found in a cell, from the plots
  around it) and **maximum habitat suitability** (`ui_layout_map_layer_mhs`; the RDS-MHS model: how
  suitable the cell's environment is, wherever the species grows today or not).
- Presence says where the species **is**; suitability says where it **could** be. Available for the
  species the Atlas mapped (43 of ours have at least one of the two).
- Modelled surfaces, not interpolated observations; published rasters served as they are.
- Licence: European Commission reuse notice (Decision 2011/833/EU), that is CC BY 4.0.
- `_references._citation`: de Rigo, Caudullo, Houston Durrant, San-Miguel-Ayanz (2016), the citation
  string already on `ui_layout_map_layer_rpp`; `_url`: the Atlas data page as there.

### C.2 EU-Trees4F: facts for the description (to be worded by you)

- EU-Trees4F (Mauri et al. 2022) models the climatic suitability of 67 European tree species with an
  ensemble of species distribution models, at 5 arc-minutes (about 10 km), for the present (centred on
  2005) and three future periods (2035, 2065, 2095) under RCP 4.5 and RCP 8.5.
- The row holds the **current** layer (`ui_layout_map_layer_t4-current`) and the **future** layer
  (`ui_layout_map_layer_t4-future`) with its scenario, period and variant selectors.
- Two variants: **potential** (everywhere the climate suits) and **natural dispersal** (where the species
  can arrive unaided). The scatterplot's classes view is computed from the same binary maps.
- Each future is the mean of eleven regional climate projections.
- Licence CC0.
- `_references._citation`: Mauri et al. 2022, the string already on `ui_layout_map_layer_t4-current`.

## D. Scenario options: fuller texts with references

The scenario selector is a fundamental choice of the data; its options will be listed in a clear hover.
Today `env_climate_scenario_rcp85` has a description of 84 characters. Wanted on each of
`env_climate_scenario_historical`, `_rcp45`, `_rcp85`, `_ssp370`: a description a unit manager can read
(what the scenario assumes, how warm it gets, which of our sources use it) and `_references`.

Facts, from this session's memory, **each reference to be verified by its DOI before it is stored**:

| Option | Facts | Reference |
|---|---|---|
| historical | not a scenario: the observed climate of each source's reference period (1961–1990 EU-Trees4F, 1970–2000 WorldClim 2.1, 1981–2010 CHELSA 2.1) | the sources' own |
| RCP 4.5 | intermediate pathway of the IPCC Fifth Assessment: emissions peak around 2040, radiative forcing stabilises at 4.5 W m⁻² by 2100. Used by EU-Trees4F | Thomson et al. 2011, *Climatic Change* 109:77–94; overview van Vuuren et al. 2011, *Climatic Change* 109:5–31 |
| RCP 8.5 | highest pathway of the Fifth Assessment: emissions keep rising, 8.5 W m⁻² in 2100. Used by EU-Trees4F | Riahi et al. 2011, *Climatic Change* 109:33–57 |
| SSP3-7.0 | a pathway of the Sixth Assessment (CMIP6): regional rivalry, high emissions, 7.0 W m⁻² in 2100; between RCP 4.5 and RCP 8.5, nearer the latter. Used by our WorldClim 2.1 and CHELSA 2.1 futures, one climate model (MPI-ESM1-2-HR) | O'Neill et al. 2016, *Geoscientific Model Development* 9:3461–3482 |

One sentence worth having on the selector itself (`env_climate_scenario`): the sources do not share
scenarios, so the scenario list follows the chosen source.

## E. Links must not show identifiers (a general rule, Milko)

Users of the panes will mostly never open the dictionary: a term's global identifier in a text only
confuses them. In every text the panes show, a link to a term must show the **referred term's title**, or
the referring words themselves become the link. Milko's example:

- before: `the species ([`species`](species.md)), the country ([`gcu_id_country`](gcu_id_country.md), a member of [`eufgis_countries`](eufgis_countries.md))`
- after: `the [species](species.md), the [country](gcu_id_country.md), a member of [EUFGIS countries](eufgis_countries.md)`

Scope:

1. every `_info` text of the **36 `_term_role_control` terms**;
2. the other terms the panes show in a clear hover: the remaining `ui_layout` terms with a description
   (captions, options, layer groups), the sections of `env_climate_period`, `env_climate_scenario` and its
   options, the new caption terms of §C, and the indicator descriptors offered on the X and Y selectors
   (the descriptors of the `SCATTER_OCCURRENCES` record's `std_terms`), at least in their `_definition` and
   the opening of their `_description`;
3. the **manual pages that cover the map and scatterplot application** (`using.map-and-scatterplot` and
   any page under it).

The panes will also replace, on their side, a link whose visible text is a bare identifier by the term's
title, as a safety net; prose built around an identifier in brackets still needs your rewrite to read well.

## F. Not to change

- The legend label terms (`ui_layout_map_label_presence` and its siblings, "Legend of …"): the panes will
  show, on a legend label, the clear hover of the **layer** it switches (the same term as the check box),
  so these definitions fall out of use. Leave them.

## G. What this session does

Pages: the clear hover of a selector lists every option with its definition; legend labels show their
layer's card; the Source options get a clear hover from the dataset records (our service); layout A (a gear
mark in the legend row opens "Map layers" / "Plot layers"; same order of rows on both panes; the common bar
gains the Layout section). The pages will use the new caption terms as soon as their identifiers are known:
until then the three hard-coded captions stay.

## H. Please report back

The commit, the identifiers of the five new caption terms, and any text of §C or §D you changed in
substance.
