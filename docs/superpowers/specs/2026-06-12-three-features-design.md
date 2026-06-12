# Fill Fusion — Three Features Design Spec
_2026-06-12_

## Overview

Three independent features to be implemented in parallel git worktrees:
1. **Colors** — white background, per-voice colored notation
2. **Hi-Hat Bark** — open hi-hat and foot chick voices, flam modifier
3. **Timing / Interval** — BPM controls, looping 3-empty-measures → fill cycle, beat counter

Each feature is fully independent. No shared file changes between them except `data/fills.js` (Feature 2 adds new voices; Feature 3 does not touch fills data).

---

## Feature 1: Colors

### Goal
Replace the dark/inverted theme with standard music notation colors: white background, black staff, each drum voice in its own distinct color.

### Changes

**`style.css`**
- `background` on `html, body`: `#1a1a1a` → `white`
- `color` on `html, body`: `#f0f0f0` → `#1a1a1a`
- `background` on `#orientation-overlay`: `#1a1a1a` → `white`
- Remove `filter: invert(1)` from `#staff svg`

**`main.js`**
- Add `VOICE_COLORS` map (one hex color per voice key)
- In `renderFill()`, before drawing each voice: call `context.setFillStyle(color)` and `context.setStrokeStyle(color)`
- Before drawing the stave (lines, clef, time sig): explicitly set `context.setFillStyle('#000')` and `context.setStrokeStyle('#000')`
- After all voices are drawn, reset context to black

### Voice Color Palette

| Voice | Color |
|---|---|
| crash | `#e63946` |
| hihat | `#457b9d` |
| hihatOpen | `#457b9d` |
| hihatFoot | `#1d3557` |
| highTom | `#2a9d8f` |
| midTom | `#e9c46a` |
| floorTom | `#f4a261` |
| snare | `#6a4c93` |
| kick | `#264653` |

---

## Feature 2: Hi-Hat Bark

### Goal
Add two new hi-hat articulation voices and support for flam grace notes on any voice.

### New Voices

**`hihatOpen`** — open hi-hat hit
- Position: `g/5`
- Notehead: × (`noteType: 'x'`)
- Stem: up (`stemDirection: 1`)
- Same staff position as `hihat`; used instead of `hihat` when the hit is open

**`hihatFoot`** — foot chick (hi-hat closed with foot)
- Position: `e/4`
- Notehead: × (`noteType: 'x'`)
- Stem: down (`stemDirection: -1`)

Both are optional per fill — voices absent from a fill object are skipped.

### Flam

A flam is a grace note immediately preceding a main note. It is stored as a pre-built VexFlow `GraceNoteGroup` as the third element of a note tuple:

```js
// Regular note
['b/4', 'q']

// Flammed note — GraceNoteGroup constructed inline in fills.js
['b/4', 'q', new Vex.Flow.GraceNoteGroup([
  new Vex.Flow.GraceNote({ keys: ['b/4'], duration: '8', slash: true })
])]
```

**`main.js`** renderer gets one generic line added to note construction:
```js
if (noteData[2]) staveNote.addModifier(noteData[2]);
```

No flam-specific logic. Any pre-built VexFlow modifier stored at index 2 is attached generically.

### Data Format Update

`VOICE_CONFIG` in `main.js` gains two entries:
```js
hihatOpen: { isXHead: true,  stemDirection:  1 },
hihatFoot: { isXHead: true,  stemDirection: -1 },
```

At least one fill in `data/fills.js` should demonstrate `hihatOpen`, `hihatFoot`, and a flam to verify the feature works.

---

## Feature 3: Timing / Interval

### Goal
The app loops continuously: 3 empty measures → 1 random fill. A beat counter shows the current beat (1–4). BPM is user-controlled via a text field and +/− buttons.

### Timing Loop

Uses `requestAnimationFrame`. One beat = `60000 / bpm` ms. The loop tracks `lastBeatTime` and advances `beatIndex` (0–15, 16 beats = 4 measures) each time a full beat duration has elapsed. `lastBeatTime` is stepped forward by exactly one beat duration per tick (not snapped to `now`) to prevent drift.

```
beatIndex 0–11  → empty measure (measures 1–3)
beatIndex 12–15 → fill measure (measure 4)
```

On beat 12 (start of measure 4): pick and render a new random fill.
On beats 0, 4, 8 (start of measures 1–3): render an empty staff.
Beat counter displayed = `(beatIndex % 4) + 1`.

### Initial Load

On page load: immediately call `renderEmpty()` and render the beat counter at 1, then start the RAF loop.

### Empty Staff

A dedicated `renderEmpty()` function draws the percussion staff with clef and time signature but no notes.

### BPM Controls

Positioned bottom-right. Layout: `[ − ][ input ][ + ]`

- Default: 120 BPM
- Min: 40, Max: 300
- `+` increments by 1, `−` decrements by 1
- Text field accepts direct numeric input; validated on `change` event (clamped to min/max, non-numeric input reset to current BPM)
- BPM change takes effect on next beat (no loop restart needed)

**`index.html`**: add BPM control markup bottom-right.
**`style.css`**: position and style the BPM controls and beat counter.
**`main.js`**: RAF loop, `renderEmpty()`, BPM read/write, beat counter update.

### Beat Counter Display

Large number centered at the top of the viewport, above the staff. Updates on each beat tick.

---

## Out of Scope

- Time signatures other than 4/4
- Tap tempo
- Audio playback
- Changing the loop structure (e.g. 2 empty + 1 fill)
