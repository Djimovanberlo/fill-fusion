# Fill Fusion — Design Spec
_2026-06-12_

## Overview

A vanilla JS/HTML/CSS web app that displays random drum fills as traditional music notation. Landscape-mobile-only. No framework, no build step. Deployed to GitHub Pages via GitHub Actions.

---

## File Structure

```
fill-fusion/
├── index.html
├── style.css
├── main.js
├── data/
│   └── fills.js
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Notation Rendering

VexFlow is loaded via CDN (no install). It renders a single percussion staff spanning the full viewport width. All 7 drum voices are layered onto the same staff as separate VexFlow `Voice` objects. Strict mode is on by default — if any voice does not sum to exactly 4 beats, VexFlow throws and the app shows an error message in place of the staff.

Crash and hi-hat voices automatically receive × noteheads via VexFlow's note annotation API. All other voices use standard oval noteheads.

Staff positions (pitch values) map to drum voices as follows — exact values to be confirmed during implementation and documented in `main.js`:

| Voice     | Staff position | Notehead |
|-----------|---------------|----------|
| crash     | TBD           | ×        |
| hihat     | TBD           | ×        |
| highTom   | TBD           | oval     |
| midTom    | TBD           | oval     |
| floorTom  | TBD           | oval     |
| snare     | TBD           | oval     |
| kick      | TBD           | oval     |

---

## Data Format

`data/fills.js` exports a single array of 2 mock fill objects (more to be added later):

```js
export const fills = [
  {
    id: "fill-001",
    voices: {
      crash:     "r/w",
      hihat:     "r/w",
      highTom:   "r/h, [TBD]/q, [TBD]/q",   // pitch TBD — see mapping table
      midTom:    "r/h, r/q, [TBD]/q",
      floorTom:  "r/w",
      snare:     "[TBD]/q, [TBD]/q, r/h",
      kick:      "[TBD]/q, r/q, [TBD]/q, r/q"
    }
  }
]
```

Pitch placeholders (`[TBD]`) will be replaced with correct VexFlow staff positions during implementation, once confirmed against the mapping table.

Rules:
- All 7 voice keys must be present in every fill.
- Each voice string must sum to exactly 4 beats (whole = 4, half = 2, quarter = 1, eighth = 0.5, sixteenth = 0.25).
- Silent voices use `r/w` (whole rest).
- Rests are written as `r/w`, `r/h`, `r/q`, `r/8`, `r/16`.
- Note durations: `w` whole, `h` half, `q` quarter, `8` eighth, `16` sixteenth.
- Pitches are staff positions — refer to the mapping table above and comments in `main.js`.

---

## UI & Layout

### Landscape mobile (active view)
- Full viewport, dark background
- VexFlow staff centered vertically, spanning full width
- "Next fill" button at the bottom center
- On load and on button press: a random fill is selected from the array and rendered

### Non-landscape view
- Full-screen overlay covers everything
- Message: "Please rotate your device to landscape mode"
- Detected via CSS `@media (orientation: portrait)` — no JS needed for this

### Error state
- If VexFlow throws during render, the staff area shows: "Could not render fill: [error message]"
- The "Next fill" button remains functional

---

## Deployment

`.github/workflows/deploy.yml` deploys the repo root to GitHub Pages on every push to `main`. No build step required.

**One-time manual step:** In the GitHub repo settings → Pages → Source, set to "GitHub Actions".

---

## Out of Scope

- Playback / audio
- Fill authoring UI
- Multiple bars
- Time signatures other than 4/4
