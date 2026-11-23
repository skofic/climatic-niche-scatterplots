# Renaming the two repositories, step by step (2026-11-23)

Decided by Milko: `indicator-pair-scatterplots` becomes **`climatic-niche-scatterplots`**,
`indicator-pair-scatterplots-service` becomes **`climatic-niche-service`**. Both names were free on GitHub
on 2026-11-23. Before these steps, both repositories had nothing uncommitted and nothing unpushed.

Do the steps in order. Each step ends with a check; if a check does not give what is written, stop there
and open a Claude session in the folder you are in.

## A. Close Claude

1. Type `/exit` in every Claude session open in either folder.

## B. GitHub (in the browser)

2. Open `https://github.com/skofic/indicator-pair-scatterplots` → **Settings** → **General** →
   **Repository name**: type `climatic-niche-scatterplots` → **Rename**.
   *Check:* the page now shows `skofic/climatic-niche-scatterplots`.
3. Open `https://github.com/skofic/indicator-pair-scatterplots-service` → **Settings** → **General** →
   **Repository name**: type `climatic-niche-service` → **Rename**.
   *Check:* the page now shows `skofic/climatic-niche-service`.

Never create a new repository under either old name: the redirects from the old addresses would stop.

## C. The laptop (in Terminal, one command at a time)

4. Go to the folder that holds both repositories:
   ```
   cd /Users/milko/Local/Development/Git/Projects/Metadata
   ```
5. Rename the two folders:
   ```
   mv indicator-pair-scatterplots climatic-niche-scatterplots
   mv indicator-pair-scatterplots-service climatic-niche-service
   ```
   *Check:* `ls` lists `climatic-niche-scatterplots` and `climatic-niche-service`, and no longer the old names.
6. Point each repository at its new GitHub address:
   ```
   git -C climatic-niche-scatterplots remote set-url origin https://github.com/skofic/climatic-niche-scatterplots.git
   git -C climatic-niche-service remote set-url origin https://github.com/skofic/climatic-niche-service.git
   ```
   *Check:*
   ```
   git -C climatic-niche-scatterplots fetch && git -C climatic-niche-scatterplots status -sb | head -1
   git -C climatic-niche-service fetch && git -C climatic-niche-service status -sb | head -1
   ```
   Each prints `## main...origin/main` with nothing after it.
7. Move Claude's memory of this project, so the next session in the new folder finds it:
   ```
   mv ~/.claude/projects/-Users-milko-Local-Development-Git-Projects-Metadata-indicator-pair-scatterplots ~/.claude/projects/-Users-milko-Local-Development-Git-Projects-Metadata-climatic-niche-scatterplots
   ```
   *Check:* `ls ~/.claude/projects/-Users-milko-Local-Development-Git-Projects-Metadata-climatic-niche-scatterplots/memory`
   lists `MEMORY.md` and the memory files.

## D. Open Claude in the new folder

8. ```
   cd /Users/milko/Local/Development/Git/Projects/Metadata/climatic-niche-scatterplots && claude
   ```
   Tell the session: "The renaming steps are done; continue with notes/2026-11-23-renaming-steps.md, part E."

## E. What Claude does after (nothing for Milko to type)

- Rebuild the Python environment (`.venv` holds the old folder's path): `python3 -m venv --clear .venv`,
  then `.venv/bin/pip install -r requirements.txt`.
- Change the references that would break: `skofic.io` (the export's credentials path, the README
  recipes, `CLAUDE.md`), `../shared/deployments.md`, the ecosystem tables of every repository's
  `CLAUDE.md`, the service's `manifest.json` name, `README.md` and `MILKO.md`, the GitHub address in our
  dataset records; then copy the records and the service to the showcase server (key unlocked by Milko).
- Write the note for `metadata-store` (its manual page `using/map-and-scatterplot` names the project; the
  theme title *Indicator-pair scatterplots* is a dictionary text, kept or changed at Milko's word).
- Dated notes stay as written; each `CLAUDE.md` gets one dated line on the renaming.

Until part E is done, do not refresh the showcase server: the export looks for the old folder name.
