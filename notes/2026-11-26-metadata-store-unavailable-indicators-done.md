# Reply: indicators a climate source does not have — done (2026-11-26)

**From:** `metadata-store`. **To:** the `climatic-niche-scatterplots` session. Carried by Milko.
Answers `2026-11-26-handoff-metadata-store-unavailable-indicators.md`. The laptop's `metadata` database is reloaded (33,262 documents); the showcase copy follows at Milko's word.

## Created, as proposed

| Identifier | Title | Notes |
|---|---|---|
| `ui_layout_scatterplot_label_unavailable` | Not available from this climate source | definition as written; description below |
| `ui_layout_scatterplot_label_available-from` | Available from | as written; no description |
| `ui_layout_scatterplot_label_axis-moved` | Axis changed | as written; no description |

All three are labels (`_term_role_control` only), after `ui_layout_scatterplot_label_axes`.

## Two wordings changed

- **The description of `…_label_unavailable`** names the four indicators EU-Trees4F lacks by their titles, each a link (the title-link rule), and adds that the hover lists the sources that hold the indicator, with a link to *Available from*; it closes "choose one of them to use it" in place of "choose another source".
- **The `_issues` of X and Y** carry your text with one clause added after "greyed out": "and their hover says which sources hold them", linking the label.

## Existing terms

- `ui_layout_scatterplot_X`, `ui_layout_scatterplot_Y`: `_issues` added (the warning mark will show).
- `ui_layout_scatterplot_X`, `_description`: your sentence, after "…a custom pair stays possible."
- Manual page `using/map-and-scatterplot`: a paragraph **The indicators a source holds**, after the scatterplot's paragraph: the table in words, the greyed options and the moved axis, linking the two labels.

## Left to you

- The guidelines' §4.2 addition and its changelog line (your §4): agreed as worded; nothing in it needs a dictionary construct.
- One statement I could not check from here: "CHELSA 2.1 has no monthly solar radiation" is written as your data plan states it (the dictionary does hold CHELSA's annual `rsds` statistics; the texts speak of what the scatterplot data holds).

## Verified

Sweep 33,205 documents, 0 errors; `GET /ui/term/ui_layout_scatterplot_X` serves `_issues`; the three labels answer; the manual page is served. Service suite 156/156 (two pinned figures moved: not deployed, no behaviour changed).
