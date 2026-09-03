---
name: pull-github-projects
description: Finds noteworthy GitHub repositories Wyatt created or substantially authored and adds them to the personal-site project catalog. Use when refreshing portfolio projects from GitHub or when asked to pull, import, or discover Wyatt's projects.
---

# Pull GitHub Projects

## Workflow

1. Read `src/lib/projects.ts` and collect its existing repository URLs.
2. Confirm `gh auth status`, then list repositories owned by `wyattades`:

   `gh repo list wyattades --source --limit 100 --json name,description,url,homepageUrl,primaryLanguage,repositoryTopics,stargazerCount,isArchived,pushedAt`

3. Also search organizations where Wyatt substantially authored a repository. Check authorship with:

   `gh api "repos/OWNER/REPO/commits?author=wyattades&per_page=5"`

4. Shortlist only portfolio-worthy projects:
   - Prefer complete, distinctive, technically interesting work with a useful README or live demo.
   - Skip tutorials, templates, throwaway tests, archived projects, duplicates, and repositories without enough context to describe accurately.
   - Do not rank repositories by stars alone.
5. Inspect each candidate's README, topics, primary language, homepage, and recent activity. Never invent a description, technology, or ownership claim.
6. Add new entries to `src/lib/projects.ts` with an accurate `type`, relevant `topics`, source URL, live or package URL when available, and a description that follows "Writing the description" below.
7. Give every entry a screenshot, following "Screenshots" below.
8. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Fix issues caused by the additions.

## Writing the description

Lead with the two or three most _interesting_ things about the project, not the most obvious ones. The primary language is rarely the interesting part.

Dig past the repo's headline metadata into the README, `Cargo.toml`/`package.json` dependencies, and the source itself to find:

- The engine, framework, or major library it is built on — this is easy to miss when the language dominates the repo summary.
- Distinctive capabilities or modes the project deliberately supports.
- Unusual constraints or targets (runs in the browser, no dependencies, self-hosted, offline).

Verify every technology against the repository itself — the dependency manifest, the lockfile, or a code search — before naming it. Do not carry over a technology because a sibling project uses it or because it is plausible for the language.

Worked example — `rogue-rs` was originally described only as "a tiny roguelike built in Rust and WebAssembly", which missed its best details. Its three most interesting points are that it renders the same game **three ways (plain text, HTML, and Canvas 2D)**, that it is **Rust compiled to WebAssembly**, and that its dungeons are **seeded procedural generation** you can replay by entering a seed. Note that its renderers are hand-rolled — it uses no game engine, despite `warmvector.rs` (a sibling Rust game) being built on **Bevy**. Confusing the two is exactly the mistake the verification rule above exists to prevent.

## Screenshots

Every project needs an image. Save it as `src/images/project_images/<project-id>.<ext>`; the manifest keys on the filename, so it must match the entry's `id` exactly.

Always attempt to capture one yourself before asking for help:

- If the entry has a live `url`, load it in headless Chrome with Puppeteer (`tests/system/harness.mjs` exports `resolveChrome` for finding the binary).
- Drive the app into a state that shows it actually doing its thing. Interact if needed — play a few turns, generate some output, populate the UI.
- Crop to the app itself. No browser chrome, no OS window frame.
- If the live URL returns a 404 or an error page, the catalog's link is broken for visitors too. Check the repo's `homepage` field for a newer URL, and report the dead link instead of quietly shipping it.

A screenshot is good enough when it shows the project mid-use and a stranger could tell what the project does from it. `src/images/project_images/rogue-rs.png` is the reference: an explored dungeon, the player surrounded by revealed map, a visible HP bar and combat log — not the empty start screen.

Reject and retake a screenshot that shows a title screen, an empty or loading state, a blank canvas, an error, or a cookie banner.

Only one file per `id` may exist in `src/images/project_images` — the manifest strips the extension, so `foo.png` and `foo.gif` collide. Delete the old file when replacing one.

### Converting a video to a GIF

For animated projects, a short GIF beats a still. Given a screen recording, first sample it to find the best stretch, since the opening seconds are usually a title card or idle setup:

```sh
ffmpeg -i clip.mp4 -vf "fps=1/4,scale=340:-1,tile=4x2" -frames:v 1 /tmp/sheet.png
```

Then convert that window with a two-pass palette, where `-ss` is the start second and `-t` the duration:

```sh
ffmpeg -ss 11 -t 11 -i clip.mp4 \
  -vf "fps=10,scale=480:-1:flags=lanczos,palettegen=max_colors=64:stats_mode=diff" -y /tmp/pal.png
ffmpeg -ss 11 -t 11 -i clip.mp4 -i /tmp/pal.png \
  -lavfi "fps=10,scale=480:-1:flags=lanczos[v];[v][1:v]paletteuse=dither=none:diff_mode=rectangle" \
  -y src/images/project_images/<project-id>.gif
```

Keep the result under about 3 MB; trim the duration, drop to `fps=10`, narrow the `scale`, or lower `max_colors` until it fits. `dither=none` matters most — dithering a noisy texture makes every frame differ and can triple the file size. Install ffmpeg with `brew install ffmpeg` if it is missing.

If you cannot produce a satisfying screenshot — no live demo, a native app, or the capture keeps coming out empty — stop and ask the human to supply one. They may explicitly opt out, in which case the entry ships without an image. Never silently skip the image.

## Report

Summarize which repositories were added and briefly explain why other reviewed candidates were skipped. Call out any entry whose screenshot was human-supplied or opted out of.
