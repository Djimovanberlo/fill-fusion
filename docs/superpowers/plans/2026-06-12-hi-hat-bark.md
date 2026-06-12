# Fill Fusion — Hi-Hat Bark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new drum voices (open hi-hat and foot chick) and support for flam grace notes on any voice, demonstrated by a new fill.

**Architecture:** `main.js` gains two new entries in `VOICE_CONFIG` and one generic modifier line in note construction. `data/fills.js` gains a new fill demonstrating all additions. VexFlow `GraceNote`/`GraceNoteGroup` objects are constructed inline in the fill data — `Vex` is available as a global when `fills.js` evaluates because the CDN `<script>` loads synchronously before the ES module.

**Tech Stack:** Vanilla JS, VexFlow 4.x (global `Vex` via CDN).

> **Note:** `main.js` is also modified by the colors and timing-interval feature branches. When merging all three, manual reconciliation of `main.js` will be needed.

---

## Project Context

No build step. `main.js` constructs VexFlow `StaveNote` objects from `[key, duration]` tuples stored in `data/fills.js`. `VOICE_CONFIG` maps voice names to `{ isXHead, stemDirection }`. The renderer loops over `fill.voices` entries, creates notes, formats all voices together, then draws them. Voices absent from a fill object are naturally skipped by `Object.entries()`.

## File Map

| File | Change |
|------|--------|
| `main.js` | Add `hihatOpen` + `hihatFoot` to `VOICE_CONFIG`; add modifier check in note construction |
| `data/fills.js` | Add `fill-003` demonstrating open hi-hat, foot chick, and flam |

---

### Task 1: Add new voices to VOICE_CONFIG

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Replace VOICE_CONFIG with the expanded version**

```js
const VOICE_CONFIG = {
  crash:     { isXHead: true,  stemDirection:  1 },
  hihat:     { isXHead: true,  stemDirection:  1 },
  hihatOpen: { isXHead: true,  stemDirection:  1 },
  hihatFoot: { isXHead: true,  stemDirection: -1 },
  highTom:   { isXHead: false, stemDirection:  1 },
  midTom:    { isXHead: false, stemDirection:  1 },
  floorTom:  { isXHead: false, stemDirection:  1 },
  snare:     { isXHead: false, stemDirection:  1 },
  kick:      { isXHead: false, stemDirection: -1 },
};
```

- [ ] **Step 2: Commit**

```bash
git add main.js
git commit -m "feat: add hihatOpen and hihatFoot to VOICE_CONFIG"
```

---

### Task 2: Add generic modifier support to note construction

**Files:**
- Modify: `main.js`

The note map callback currently uses array destructuring `([key, dur])`. We need access to an optional third element — a pre-built VexFlow modifier (e.g. a `GraceNoteGroup` for flam). Change the callback to use index access.

- [ ] **Step 1: Update note construction inside the renderFill() loop**

Find this block in `renderFill()`:

```js
const notes = noteData.map(([key, dur]) => new StaveNote({
  keys: [key],
  duration: dur,
  stemDirection: cfg.stemDirection,
  ...(cfg.isXHead ? { noteType: "x" } : {}),
}));
```

Replace with:

```js
const notes = noteData.map((nd) => {
  const sn = new StaveNote({
    keys: [nd[0]],
    duration: nd[1],
    stemDirection: cfg.stemDirection,
    ...(cfg.isXHead ? { noteType: "x" } : {}),
  });
  if (nd[2]) sn.addModifier(nd[2]);
  return sn;
});
```

- [ ] **Step 2: Verify existing fills still render correctly**

Reload the app. `fill-001` and `fill-002` should render identically to before — no console errors.

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: generic modifier support on note tuples"
```

---

### Task 3: Add demo fill to fills.js

**Files:**
- Modify: `data/fills.js`

This fill uses `hihatOpen`, `hihatFoot`, and a flam on the snare beat 2. `Vex.Flow.GraceNote` and `Vex.Flow.GraceNoteGroup` are constructed inline — `Vex` is a global set by the CDN `<script>` tag, which loads synchronously before ES modules execute.

Beat arithmetic check (all voices must sum to 4):
- crash: `wr` = 4 ✓
- hihatOpen: `q+q+q+q` = 4 ✓
- highTom: `wr` = 4 ✓
- midTom: `wr` = 4 ✓
- floorTom: `wr` = 4 ✓
- snare: `qr+q+qr+q` = 4 ✓
- hihatFoot: `q+qr+q+qr` = 4 ✓
- kick: `q+qr+q+qr` = 4 ✓

- [ ] **Step 1: Append fill-003 to the fills array in data/fills.js**

```js
  {
    id: 'fill-003',
    voices: {
      crash:     [['b/4', 'wr']],
      hihatOpen: [['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q']],
      highTom:   [['b/4', 'wr']],
      midTom:    [['b/4', 'wr']],
      floorTom:  [['b/4', 'wr']],
      snare: [
        ['b/4', 'qr'],
        ['b/4', 'q', new Vex.Flow.GraceNoteGroup([new Vex.Flow.GraceNote({ keys: ['b/4'], duration: '8', slash: true })])],
        ['b/4', 'qr'],
        ['b/4', 'q'],
      ],
      hihatFoot: [['e/4', 'q'], ['e/4', 'qr'], ['e/4', 'q'], ['e/4', 'qr']],
      kick:      [['c/4', 'q'], ['b/4', 'qr'], ['c/4', 'q'], ['b/4', 'qr']],
    },
  },
```

- [ ] **Step 2: Verify fill-003 renders correctly**

To reliably see fill-003, temporarily change the last line of `main.js` from:
```js
const fill = fills[Math.floor(Math.random() * fills.length)];
```
to:
```js
const fill = fills[2];
```
Reload. Expected:
- Open hi-hat × noteheads at g/5 with stems up on all four beats
- Foot chick × noteheads at e/4 with stems down on beats 1 and 3
- Small grace note (×, slashed) preceding the snare hit on beat 2
- No console errors

Revert the temporary change before committing.

- [ ] **Step 3: Revert the temporary fill index change**

Ensure `main.js` ends with:
```js
const fill = fills[Math.floor(Math.random() * fills.length)];
try {
  renderFill(fill);
} catch (e) {
  document.getElementById("staff").textContent = e.message;
}
```

- [ ] **Step 4: Commit**

```bash
git add data/fills.js
git commit -m "feat: add fill-003 with hihatOpen, hihatFoot, and flam"
```
