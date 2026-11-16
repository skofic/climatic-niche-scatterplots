# Terms and user interface: the shared process started (2026-11-16)

Milko opened a process shared by `metadata-store`, `metadata-external-databases` and this repository: to
formalise how dictionary terms feed user interfaces (labels, hovers, options, state, perhaps layout), so
that the five planned interfaces follow the same rules. His note:
`../shared/Terms and User Interface/2026-11-16 Note on process.md`. An *idea document*
(`IdeaDocument.md`, a catalogue of use cases, written by Milko) comes first; a *proposal document*
follows, reviewed by the three repositories.

## What this session wrote

`../shared/Terms and User Interface/2026-11-16 Use cases - indicator-pair-scatterplots.md`, a separate
file on Milko's decision (he merges what he wants into the idea document):

1. eleven use cases from the map and scatterplot application;
2. **the complete inventory of the application's elements**, in the order of the screen, one row each,
   with an empty column for Milko's changes (he will go through every element and change things);
3. twelve open problems put as questions for the proposal;
4. suggestions on the process.

Built from the pages as committed (`dc84495`) and from the term source files of `metadata-store`
(`7500d35`), read only. The laptop's database was not running: nothing was checked against a loaded
dictionary or a running page.

## Found while building the inventory (nothing changed)

- Controls without a label, whose term texts nothing shows: the units mode in the common bar, the five
  opacity sliders of the map, the future layer's scenario, period and variant selectors, cells per arrow.
- Terms the pages do not reference: `ui_layout_scatterplot_label_arrows`,
  `ui_layout_map_label_attribution`; `ui_layout_map_view` is in the state structure but the map view is
  kept in browser storage under a key of the page.
- The species legend entry takes the word "present" by cutting another label's title at the comma.
- Words still written in the page code (status lines, error messages, "km", "≥"): section F of the file.
- The six `ui_layout_state` examples are stored and not yet used (already on the list).

## This session's position on one point

Layout and style in terms: keep what a control means in the dictionary and where and how it is drawn out
of it, at least at first; if layout is wanted there, as a separate form structure, not as properties of
the terms. Stated in the file, Part 3, point 10. Milko decides.

## Next

Milko carries the file to the other two sessions and writes the idea document. The dictionary interface
has done much of this ground and will have suggestions of its own.
