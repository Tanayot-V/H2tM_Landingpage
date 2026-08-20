# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repo is a single self-contained landing page for **Orion FX**, a forex trading academy / Expert Advisor (EA) store. There is no build system, package manager, or framework — everything (HTML, CSS, JS) lives in one file:

- `orion-fx.html` — the entire site (public marketing page + client-side admin console)
- `Element/256094_0.png` — an image asset (currently unreferenced by the HTML)

## Running / testing

There is no build step. Open `orion-fx.html` directly in a browser, or serve the directory with any static file server, e.g.:

```
npx serve .
```

There is no linter, formatter, or test suite configured — verify changes by loading the page in a browser.

## Architecture

Everything is inline inside `orion-fx.html`, split into three parts in document order: `<style>`, body markup, and a single IIFE `<script>` at the bottom.

### Two "views" toggled by JS, not routing
The body contains two top-level divs that are shown/hidden via `display` — there's no router or page navigation:
- `#publicView` — the marketing site (hero, slideshow, tools grid, academy grid, reviews, footer)
- `#adminView` — a password-gated content editor (`showAdmin()` / `showPublic()` in the script)

### Content is data-driven and editable at runtime
All page copy (hero text, slideshow slides, tools/EAs, academy highlights, reviews) lives in the `DEFAULT_DATA` object in the script, not hardcoded in the HTML. Public-facing sections are pure render functions (`renderHero`, `renderSlideshow`, `renderTools`, `renderAcademy`, `renderReviews`) that stamp `data.*` into the DOM on load and again after any admin save.

The admin console (client-side only, no backend) lets a user edit that same `data` object through generated forms (`renderSlidesEditor`, `renderToolsEditor`, etc.), using shared helpers `bindEditableFields()` (wires `[data-field]` inputs to mutate `data`) and `bindRemoveButtons()` (wires `[data-remove]` buttons to delete items). Editors follow a consistent per-section pattern: render list → add button pushes a new stub object → save button persists and re-renders the public view.

**Admin auth is a hardcoded client-side password check** (`ADMIN_PASSWORD` constant in the script) — this is not real security, just a UI gate to keep casual visitors out of the editor.

### Persistence
The `Store` object abstracts storage: it prefers `window.storage` (an async key/value API, presumably injected by the hosting environment) and falls back to `localStorage` when that's unavailable. All data is stored under a single key, `orion-fx-site`, as one JSON blob (the whole `data` object). `persist()` writes it; `init()` reads it on load, falling back to a deep copy of `DEFAULT_DATA` if nothing is stored yet.

### Placeholder art
Tools, slides use a deterministic seeded-random SVG generator (`seededRand` / `placeholder(hue)`) to produce a starfield-gradient data URI when an item has no `image` URL set. `imgFor(obj)` picks the real image if present, otherwise generates one from `obj.hue`.

### Styling conventions
- CSS custom properties in `:root` define the color system (`--void`, `--panel`, `--blue`, `--purple`, `--cyan`, etc.) — reuse these tokens rather than hardcoding colors.
- Fonts: Sora (headings/UI), Inter (body), JetBrains Mono (numeric/data values) — loaded from Google Fonts.
- Responsive breakpoints at `900px` and `640px` handled via plain media queries (no framework/grid system).
- `prefers-reduced-motion` is respected globally by collapsing all animation/transition durations.

## Conventions to follow when editing

- Keep the site as a single self-contained HTML file unless asked to restructure it — there's no build pipeline to assemble split files.
- New editable content sections should follow the existing pattern: add to `DEFAULT_DATA`, add a `render*()` function for the public view, add a `render*Editor()` function plus add/save handlers for the admin view, and reuse `bindEditableFields()`/`bindRemoveButtons()` via the shared `data-field`/`data-group`/`data-id`/`data-remove` attribute convention.
- User-supplied strings rendered into HTML must go through `esc()` to avoid XSS (all existing render functions already do this — preserve it in any new ones).
