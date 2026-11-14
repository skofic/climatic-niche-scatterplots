# Reply from `metadata-store`: the review texts are loaded (2026-11-14)

Answers the handoff `2026-11-14-handoff-metadata-store-review-texts.md`, §H. Commits: `metadata-store` `097d373` and the follow-up with the two corrections (terms, manual page, cards, records), `metadata-store-service` `871a238` (the pinned term total 16,340 → 16,345, not deployed). The laptop is reloaded: 33,196 documents, 16,345 terms; the sweep passes 33,140 / 0. The work server is set aside again (`../shared/deployments.md`, 2026-11-14), so nothing was loaded there; the showcase copy follows from the laptop through the `skofic.io` repository, at Milko's word.

## A. Titles

All six as asked: *Restriction level*, *Plot layers*, *X indicator*, *Y indicator*, *Panes*, *Map*. No text quoted the old titles by name (the manual page named the terms by identifier, and those links are now titles anyway). Left as it was: the namespace `ui_layout` is still titled *Pane layout* (it is the whole panes' settings, not the arrangement control); say if it should move too.

## B. The search box

`ui_layout_label_search._definition`: "Type a scientific name, a country name or code, or a conservation unit number: the matching entries appear as you type, ready to be selected."

## C. The five caption terms

| Caption | Identifier | Content |
|---|---|---|
| Coordinates privacy | `ui_layout_label_coordinates-privacy` | definition + description (Milko's content; links to the flag and the restriction level; the three levels spelled out) |
| Layout | `ui_layout_label_layout` | definition + description (links to Panes and Map) |
| Axes | `ui_layout_scatterplot_label_axes` | definition + description (links to the X and Y indicators; the pairing rule) |
| Atlas | `ui_layout_map_label_atlas` | definition + thorough description; `_references`: de Rigo et al. 2016, the Atlas data page |
| EU-Trees4F | `ui_layout_map_label_eu-trees4f` | definition + thorough description; `_references`: Mauri et al. 2022 |

Labels, no `_term_role_control`, no `_domn`. Wording choices worth a look: the Atlas licence line reads "Reuse is allowed under the European Commission's reuse policy (Decision 2011/833/EU), the equivalent of a CC BY 4.0 licence"; the Atlas count now reads, per your correction, "43 of the 271 species offered here have at least one of the two" (the version with numbers, as you recommended); the EU-Trees4F text says "the data are published under a CC0 licence".

## D. Scenario options

All four references verified at Crossref by DOI before storing (title, journal, volume, pages, authors): Thomson et al. 2011 `10.1007/s10584-011-0151-4`; van Vuuren et al. 2011 `10.1007/s10584-011-0148-z`; Riahi et al. 2011 `10.1007/s10584-011-0149-y`; O'Neill et al. 2016 `10.5194/gmd-9-3461-2016`. Each option now has a reader's description and `_references`:

- **Reference climate** — the three reference periods by source, and that the option applies to the first entry of each source's period list only; `_references._citation` = the three sources' own (Fick & Hijmans 2017, Karger et al. 2017, Mauri et al. 2022, the strings of the dataset records).
- **RCP 4.5** — what it assumes, 4.5 W m⁻² by 2100, about 2.4 °C by the end of the century relative to pre-industrial (the AR5 figure the `rcp45` descriptor already carried), EU-Trees4F only, the eleven EURO-CORDEX projections and the three periods; Thomson 2011 + van Vuuren 2011. Its `_definition` grew one clause ("emissions peak around 2040, radiative forcing stabilises at 4.5 W m⁻² by 2100").
- **RCP 8.5** — likewise, about 4.3 °C, "an upper bound to test against, not a forecast"; Riahi 2011 + van Vuuren 2011.
- **SSP3-7.0** — ScenarioMIP, "regional rivalry", 7.0 W m⁻², between the two RCPs and nearer 8.5, no warming figure (a 3.6 °C estimate I had added was removed: none of the cited papers states it, and Milko's rule is to state nothing a publication does not); WorldClim 2.1 and CHELSA 2.1 only, one model; O'Neill 2016.
- **The selector** (`env_climate_scenario`) carries the sentence: "The sources do not share scenarios, so the scenario list follows the chosen source", followed by which source follows which.

## E. Links show titles — done

Every bare-identifier link in the texts the panes show was rewritten: 123 links across 74 terms (the 36 controls, the other `ui_layout` terms with a description, the three period sections and the seven future periods, the scenario root and options, `rcp45` / `rcp85`, the four `gcu_loc_*` terms and the ten axis indicators), plus the manual page `using.map-and-scatterplot`. The rule applied: the referring words become the link where the sentence already named the thing ("the [species](species.md), the [country](gcu_id_country.md), a member of [EUFGIS countries](eufgis_countries.md)"); otherwise the link shows the referred term's title ("Default [Follows the window](ui_layout_mode_auto.md)."). The seven future periods now read "The [MPI-ESM1-2-HR](…) model under [SSP3-7.0](…)". The indicators' bold opening codes (**BIO1**, **pr_summer**, …) were left: they are the variables' names in the literature, not links. Code spans that are not links (`rcp45` as the data key, `cur2005 bin nat`) were left. No term text the panes show contains `[` + backtick any more; the pages' safety net should find nothing to do.

## F. Not changed

The legend labels, as asked. The manual chapter index still covers the roots only (captions and labels are uncovered by design).

## Verification

`assign-roles` 0 role changes (16,345 terms); `loader --clear` 33,196; sweep 33,140 / 0; term cards 84 written; `affected.py` named `using.map-and-scatterplot`, re-read and rewritten in the same round. Live on localhost: the five captions 200 with their titles and references, the six new titles served, `env_climate_scenario_rcp45` with two citations, the search definition, the manual page 200, `/search/facets` total 16,345 with `_term_role_control` 36, no bare-identifier link in the served pane state description. Service suite 156/156 after the re-pin, development mode off.
