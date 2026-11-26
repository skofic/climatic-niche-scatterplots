# Handoff: indicators a climate source does not have (2026-11-26)

**From:** the `climatic-niche-scatterplots` session. **To:** `metadata-store`. Carried by Milko.
Written under the shared guidelines; §4 proposes one addition to them.
**Status: ready to carry (Milko, 2026-11-26).**

## 1. Why

Milko found that some combinations of X and Y indicators draw nothing. The cause is the data, not
the drawing: the X and Y selectors offer all ten indicators whatever the climate source, and three
of the sources lack some of them. Counted on the 250 569 cells of `ScatterOccurrences`:

| Indicator | EU-Trees4F | WorldClim 2.1 | CHELSA 2.1 |
|---|---|---|---|
| `env_climate_bio01`, `_tas_summer`, `_continentality` | yes | yes | yes |
| `env_climate_bio12`, `_pr_summer`, `_pr_winter` | yes | yes | yes |
| `env_climate_tas_coldest` | no | yes | yes |
| `env_climate_bio14` | no | yes | yes |
| `env_climate_pr_seasonality-ratio` | no | yes | yes |
| `env_climate_srad_spring-summer` | no | reference period only | no |

EU-Trees4F, the default source, publishes seven climate layers; CHELSA 2.1 has no monthly radiation;
the WorldClim 2.1 future has none either. All three are decisions of the data plan, stated in the
dataset records. The interface did not say so.

Decided by Milko: **the indicators the selected source and period cannot supply are greyed out in
the two selectors**, with a hover saying why; when a change of source or period leaves the chosen
indicator unavailable, the page moves that axis to an available one and says so. The service's
catalogue will list the indicators of each climate, so nothing is hard-coded in the page.

## 2. New labels

### ui_layout_scatterplot_label_unavailable    (new)
```
Kind:        label; the hover of a greyed option of the X and Y selectors, followed by the titles of
             the sources that have the indicator: "Not available from this climate source. Available
             from: WorldClim 2.1, CHELSA 2.1."
_title:      Not available from this climate source
_definition: The selected climate source, or its selected period, does not hold this indicator.
_description:The climate sources do not all hold the same indicators. EU-Trees4F publishes seven
             climate layers and has no coldest-month temperature, driest-month precipitation,
             precipitation seasonality ratio or solar radiation; CHELSA 2.1 has no monthly solar
             radiation; WorldClim 2.1 has solar radiation for its reference period only. An indicator
             the selected [source](ui_layout_label_source.md) and [period](env_climate_period.md) cannot
             supply is shown greyed in the [X](ui_layout_scatterplot_X.md) and
             [Y](ui_layout_scatterplot_Y.md) selectors: choose another source to use it.
```

### ui_layout_scatterplot_label_available-from (new)
```
Kind:        label; the words before the list of sources in that hover
_title:      Available from
_definition: The climate sources that hold the indicator.
```

### ui_layout_scatterplot_label_axis-moved     (new)
```
Kind:        label; a message in the status popover (the "i" mark) and for a few seconds beside the
             selectors, followed by the two indicator titles: "Axis changed: Spring-summer solar
             radiation → Mean annual air temperature"
_title:      Axis changed
_definition: The chosen indicator is not available from the new climate source or period, so the axis shows another indicator.
```

## 3. Existing terms: texts to add

- `ui_layout_scatterplot_X` and `ui_layout_scatterplot_Y`, `_issues` (both have none today): "Not
  every indicator is available from every climate source: the ones the selected source and period
  cannot supply are greyed out. EU-Trees4F holds annual and summer temperature, continentality and
  annual, summer and winter precipitation only; solar radiation is available from WorldClim 2.1 in
  its reference period only." With the issue they get the warning mark beside their labels, which
  is wanted here.
- `ui_layout_scatterplot_X`, `_description`: after the sentence on the paired Y indicator, "When the
  paired indicator is not available from the selected source, the Y axis keeps its indicator."
- Manual page `using/map-and-scatterplot`, where the axes are described: one paragraph with the
  table of §1 in words, and the greyed options.

## 4. Proposed addition to the shared guidelines

§4.2: **an option of a selector may be unavailable in the current state** (here: an indicator the
selected source does not hold). The selector shows it disabled, never hides it, and its hover is a
label term that says why, followed by where it is available; the control's `_issues` states the
dependency. We add the rule and a changelog line with this round.
