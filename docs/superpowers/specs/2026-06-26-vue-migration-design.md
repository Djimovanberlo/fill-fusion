# Fill Fusion — Vue Migration Design

**Date:** 2026-06-26  
**Status:** Approved

## Overview

Migrate Fill Fusion from a plain HTML/JS app to a Vite + Vue 3 (Composition API, plain JS) app in the same repository. No functional or visual changes — this is a structural migration only.

## Tooling

- **Vite** as dev server and build tool
- **Vue 3** with Composition API
- **Plain JavaScript** (no TypeScript)
- **VexFlow** installed as an npm package (`vexflow`) instead of loaded via CDN script tag
- `package.json` gains `vite`, `@vitejs/plugin-vue`, and `vexflow` as dependencies

## File Structure

```
fill-fusion/
  src/
    App.vue                 ← state, timer loop, orchestration
    components/
      Staff.vue             ← VexFlow rendering (fill prop: object | null)
      BpmControls.vue       ← bpm prop + update:bpm emit (v-model compatible)
      BeatCounter.vue       ← beat prop (0–3)
    data/
      fills.js              ← unchanged
    style.css               ← unchanged, imported globally in main.js
    main.js                 ← createApp(App).mount('#app')
  index.html                ← Vite entry point, no CDN/script tags
  vite.config.js            ← minimal config (@vitejs/plugin-vue)
  package.json              ← updated
  .github/workflows/deploy.yml ← updated for build step
```

The existing root-level `index.html`, `main.js`, and `style.css` are replaced by the above.  
`data/fills.js` moves to `src/data/fills.js` with no content changes.

## Components

### App.vue

Owns all state and the timer loop.

**State (refs):**
- `bpm` — current BPM, starts at 120, clamped 40–300
- `beat` — current beat index 0–3
- `measureIndex` — count of measures elapsed
- `currentFill` — the fill object to render, or `null` for an empty stave

**Timer loop:**
- Started in `onMounted` via `requestAnimationFrame`
- Cancelled in `onUnmounted` via `cancelAnimationFrame`
- Same logic as current `tick()` / `onBeat()` in `main.js`
- On beat 0: if `measureIndex % 4 === 3`, pick a random fill from `fills` and set `currentFill`; otherwise set `currentFill = null`. Increment `measureIndex`.

**Template:**
- Orientation overlay `<div>` (plain markup, no sub-component — CSS-only behaviour)
- `<BeatCounter :beat="beat" />`
- `<Staff :fill="currentFill" />`
- `<BpmControls v-model:bpm="bpm" />`

### Staff.vue

Renders the VexFlow percussion stave.

**Props:** `fill` (Object | null)

- When `fill` is null: renders an empty stave (clef + time signature, no notes)
- When `fill` is an object: renders all voices with colors, beams, and flam modifiers
- Re-renders whenever `fill` changes (watch or computed trigger on the `<div>` ref)
- `VOICE_CONFIG` and `VOICE_COLORS` constants live here (they are rendering concerns)

### BpmControls.vue

**Props:** `bpm` (Number)  
**Emits:** `update:bpm` (Number) — makes it `v-model:bpm` compatible

Renders the −/input/+ controls. Clamps value to 40–300 before emitting.

### BeatCounter.vue

**Props:** `beat` (Number, 0–3)

Renders `beat + 1` as the large fixed counter. No logic.

## Styles

`style.css` is imported in `src/main.js` and is otherwise unchanged. All scoped styling (none currently) would go in individual `.vue` files if added later, but this migration introduces none.

## GitHub Pages Deploy

The workflow is updated to:
1. `npm ci`
2. `npm run build` (outputs to `dist/`)
3. Upload `dist/` as the Pages artifact (instead of `.`)

```yaml
- name: Install dependencies
  run: npm ci

- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: 'dist'
```

## Out of Scope

- No TypeScript
- No Pinia / Vuex (no need — all state fits in App.vue)
- No unit tests (none exist today)
- No new features or visual changes
