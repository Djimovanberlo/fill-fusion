# Fill Fusion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a landscape-mobile-only vanilla JS app that renders random drum fills as traditional music notation using VexFlow, deployed to GitHub Pages.

**Architecture:** Single-page app, no build step. VexFlow (ESM via CDN) renders a percussion staff into an SVG container. A data ES module exports fill objects. CSS media queries gate the portrait orientation. GitHub Actions deploys the repo root on push to main.

**Tech Stack:** Vanilla JS (ES modules), CSS3, HTML5, VexFlow 4.x (esm.sh CDN), GitHub Actions + GitHub Pages.

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | App shell: mounts `#staff`, `#next-btn`, `#orientation-overlay`; loads `main.js` as a module |
| `style.css` | Dark theme, landscape flex layout, portrait overlay |
| `main.js` | VexFlow import, note parser, staff renderer, random selection, button handler, error display |
| `data/fills.js` | ES module exporting `fills` array |
| `.github/workflows/deploy.yml` | Deploy repo root to GitHub Pages on push to `main` |

---

## Drum Voice → VexFlow Pitch Reference

These pitch strings place noteheads at the correct staff positions for percussion notation. Verify visually during Task 5 and adjust by one step if any voice renders out of place.

| Voice | Pitch | Notehead | Stem |
|-------|-------|----------|------|
| crash | `a/5` | × | up |
| hihat | `g/5` | × | up |
| highTom | `e/5` | oval | up |
| midTom | `d/5` | oval | up |
| floorTom | `a/4` | oval | up |
| snare | `b/4` | oval | up |
| kick | `c/4` | oval | down |

VexFlow pitch format: `pitch/octave` in lowercase, e.g. `b/4`. This differs from the data file format (`B4`) — the parser converts them.

---

### Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `main.js`
- Create: `data/fills.js`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fill Fusion</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <main id="app">
    <div id="staff"></div>
    <button id="next-btn">Next Fill</button>
  </main>
  <script type="module" src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create style.css stub**

```css
/* styles added in Tasks 2 and 7 */
```

- [ ] **Step 3: Create main.js stub**

```js
import { fills } from './data/fills.js';

console.log('Fill Fusion loaded', fills.length, 'fills');
```

- [ ] **Step 4: Create data/fills.js stub**

```js
export const fills = [];
```

- [ ] **Step 5: Verify in browser**

Serve the project root with a local server (e.g. `npx serve .` or VS Code Live Server — open `index.html` directly will block ES module imports due to CORS). Open DevTools console.

Expected: `Fill Fusion loaded 0 fills` — no errors.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css main.js data/fills.js
git commit -m "feat: scaffold project files"
```

---

### Task 2: Orientation Gate

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Replace style.css contents**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  color: #f0f0f0;
  font-family: sans-serif;
  overflow: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 16px;
  gap: 16px;
}

#staff {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

#next-btn {
  background: #444;
  color: #f0f0f0;
  border: none;
  padding: 10px 28px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
}

#next-btn:hover {
  background: #666;
}

#orientation-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: #1a1a1a;
  z-index: 100;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.2rem;
  padding: 2rem;
}

@media (orientation: portrait) {
  #orientation-overlay {
    display: flex;
  }
}

.render-error {
  color: #e55;
  font-size: 1rem;
  text-align: center;
  padding: 1rem;
}
```

- [ ] **Step 2: Verify in browser**

Open DevTools → toggle device toolbar → switch to a phone in portrait. Expected: overlay appears with message. Switch to landscape: overlay disappears, app visible (empty staff area and button).

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add landscape orientation gate and base styles"
```

---

### Task 3: Fill Data

**Files:**
- Modify: `data/fills.js`

Beat arithmetic reference: w=4, h=2, q=1, 8=0.5, 16=0.25. Every voice must sum to exactly 4.

- [ ] **Step 1: Replace data/fills.js contents**

```js
export const fills = [
  {
    // Fill 1: Driving pattern — hi-hat on every beat, high tom on beat 4
    id: 'fill-001',
    voices: {
      crash:    'r/w',
      hihat:    'G5/q, G5/q, G5/q, G5/q',
      highTom:  'r/h, r/q, E5/q',
      midTom:   'r/w',
      floorTom: 'r/w',
      snare:    'r/q, B4/q, r/q, B4/q',
      kick:     'C4/q, r/q, C4/q, r/q',
    },
  },
  {
    // Fill 2: Descending tom fill — snare+kick leadoff, toms cascade on beats 2, 3, 4
    id: 'fill-002',
    voices: {
      crash:    'r/w',
      hihat:    'r/w',
      highTom:  'r/q, E5/q, r/h',
      midTom:   'r/h, D5/q, r/q',
      floorTom: 'r/h, r/q, A4/q',
      snare:    'B4/q, r/h, r/q',
      kick:     'C4/q, r/q, r/h',
    },
  },
];
```

- [ ] **Step 2: Verify beat totals**

Check each voice sums to 4 beats:
- fill-001 hihat: q+q+q+q = 4 ✓
- fill-001 highTom: h+q+q = 2+1+1 = 4 ✓
- fill-001 snare: q+q+q+q = 4 ✓
- fill-001 kick: q+q+q+q = 4 ✓
- fill-002 highTom: q+q+h = 1+1+2 = 4 ✓
- fill-002 midTom: h+q+q = 2+1+1 = 4 ✓
- fill-002 floorTom: h+q+q = 2+1+1 = 4 ✓
- fill-002 snare: q+h+q = 1+2+1 = 4 ✓
- fill-002 kick: q+q+h = 1+1+2 = 4 ✓

- [ ] **Step 3: Verify in browser console**

Expected: `Fill Fusion loaded 2 fills` in console.

- [ ] **Step 4: Commit**

```bash
git add data/fills.js
git commit -m "feat: add 2 mock drum fills"
```

---

### Task 4: Note Parser

**Files:**
- Modify: `main.js`

Converts a voice string like `"B4/q, r/q, B4/8, B4/8"` into an array of VexFlow `StaveNote` objects.

Conversion rules:
- Data pitch `B4` → VexFlow pitch `b/4` (lowercase, slash before octave)
- Rest token `r/q` → `StaveNote({ keys: ['b/4'], duration: 'qr' })` (append `r` to duration; key is a dummy middle-line pitch)
- Duration string passthrough: `w`, `h`, `q`, `8`, `16` are used as-is in VexFlow
- X noteheads: pass `noteType: 'x'` in the StaveNote constructor (crash, hihat voices)
- Stem direction: `1` = up (all voices except kick), `-1` = down (kick)

- [ ] **Step 1: Replace main.js with parser + VexFlow import**

> **VexFlow import note:** `import Vex from 'https://esm.sh/vexflow'` should expose `Vex.Flow.*`. If you get `Cannot read properties of undefined (reading 'StaveNote')` in the console, switch to `import * as VF from 'https://esm.sh/vexflow'` and replace all `Vex.Flow.X` with `VF.X` (dropping the `.Flow` namespace) throughout main.js.

```js
import Vex from 'https://esm.sh/vexflow';
import { fills } from './data/fills.js';

const { StaveNote } = Vex.Flow;

// "B4" → "b/4", "G5" → "g/5"
function toVexPitch(str) {
  return str.slice(0, -1).toLowerCase() + '/' + str.slice(-1);
}

// Parses "B4/q, r/q, B4/8, B4/8" → StaveNote[]
function parseVoiceString(str, { isXHead = false, stemDirection = 1 } = {}) {
  return str.split(',').map(token => {
    const [pitchStr, dur] = token.trim().split('/');
    if (pitchStr === 'r') {
      return new StaveNote({ keys: ['b/4'], duration: dur + 'r' });
    }
    return new StaveNote({
      keys: [toVexPitch(pitchStr)],
      duration: dur,
      stemDirection,
      ...(isXHead ? { noteType: 'x' } : {}),
    });
  });
}

console.log('Fill Fusion loaded', fills.length, 'fills');
```

- [ ] **Step 2: Verify parser in browser**

Temporarily add this at the bottom of main.js (remove after verifying):

```js
window._test_parseVoiceString = parseVoiceString;
```

In DevTools console:

```js
const notes = _test_parseVoiceString('B4/q, r/q, B4/8, B4/8');
console.assert(notes.length === 4, 'should have 4 notes');
console.assert(notes[1].isRest(), 'second note should be rest');
console.assert(!notes[0].isRest(), 'first note should not be rest');
console.log('Parser OK ✓');
```

Expected: `Parser OK ✓` with no assertion errors.

- [ ] **Step 3: Remove the temporary window assignment**

Delete the `window._test_parseVoiceString = parseVoiceString;` line from main.js.

- [ ] **Step 4: Commit**

```bash
git add main.js
git commit -m "feat: add voice string parser"
```

---

### Task 5: Staff Renderer

**Files:**
- Modify: `main.js`

Renders one fill onto `#staff` using VexFlow. All 7 voices are layered on one percussion staff. VexFlow strict mode is on by default (Voice created with numBeats/beatValue) — any voice that doesn't sum to 4 beats throws, which surfaces data errors early.

- [ ] **Step 1: Append to main.js (after all code from Task 4)**

```js
const { Renderer, Stave, Voice, Formatter, Beam } = Vex.Flow;

const VOICE_CONFIG = {
  crash:    { isXHead: true,  stemDirection:  1 },
  hihat:    { isXHead: true,  stemDirection:  1 },
  highTom:  { isXHead: false, stemDirection:  1 },
  midTom:   { isXHead: false, stemDirection:  1 },
  floorTom: { isXHead: false, stemDirection:  1 },
  snare:    { isXHead: false, stemDirection:  1 },
  kick:     { isXHead: false, stemDirection: -1 },
};

function renderFill(fill) {
  const container = document.getElementById('staff');
  container.innerHTML = '';

  const width = container.clientWidth;
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(width, 220);
  const context = renderer.getContext();

  const stave = new Stave(10, 60, width - 20);
  stave.addClef('percussion');
  stave.addTimeSignature('4/4');
  stave.setContext(context).draw();

  const vfVoices = [];
  const allBeams = [];

  for (const [voiceName, noteStr] of Object.entries(fill.voices)) {
    const cfg = VOICE_CONFIG[voiceName];
    const notes = parseVoiceString(noteStr, cfg);

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickables(notes);
    vfVoices.push(voice);

    allBeams.push(...Beam.generateBeams(notes.filter(n => !n.isRest())));
  }

  new Formatter().joinVoices(vfVoices).format(vfVoices, width - 40);
  vfVoices.forEach(v => v.draw(context, stave));
  allBeams.forEach(b => b.setContext(context).draw());
}

// Temporary: render first fill on load for visual verification
renderFill(fills[0]);
```

- [ ] **Step 2: Verify in browser (landscape)**

Open the app in landscape orientation. Expected:
- A percussion staff with clef and 4/4 time signature appears
- Notes are visible at expected staff positions
- No console errors

If VexFlow throws `BadArguments` or a strict voice error, a voice in the fill data does not sum to 4 beats — recheck the fill data math.

If a pitch renders at the wrong height (e.g. snare appears where hi-hat should be), update that voice's pitch in `data/fills.js` by one step (e.g. `B4` → `C5`) and re-verify. Document any adjustments in a comment next to `VOICE_CONFIG`.

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add VexFlow staff renderer"
```

---

### Task 6: App Logic and Error Handling

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Replace the temporary render call at the bottom of main.js**

Remove `renderFill(fills[0]);` and replace with:

```js
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showError(message) {
  const container = document.getElementById('staff');
  container.innerHTML = `<p class="render-error">Could not render fill: ${message}</p>`;
}

function loadRandomFill() {
  const fill = pickRandom(fills);
  try {
    renderFill(fill);
  } catch (err) {
    showError(err.message);
  }
}

document.getElementById('next-btn').addEventListener('click', loadRandomFill);
loadRandomFill();
```

- [ ] **Step 2: Verify button and error state in browser**

Click "Next Fill" several times. Expected: fills cycle (with 2 fills, repeats are normal).

To verify the error state: temporarily corrupt one fill in data/fills.js — change one voice string to something that doesn't sum to 4 beats (e.g. `kick: 'C4/q'`). Reload and click Next Fill until the bad fill appears. Expected: red error message instead of crash.

Restore the correct fill data after verifying, then reload to confirm it's clean.

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: wire up random fill selection and error handling"
```

---

### Task 7: Visual Styling for Dark Background

**Files:**
- Modify: `style.css`

VexFlow renders black notation on a transparent SVG background. We need it legible on the dark `#1a1a1a` background.

- [ ] **Step 1: Add SVG inversion to style.css**

Append to style.css:

```css
#staff svg {
  filter: invert(1);
  width: 100% !important;
  height: auto !important;
}
```

`filter: invert(1)` flips black strokes to white and the transparent background stays transparent — the simplest approach for dark-mode VexFlow. If the result looks wrong (e.g. beams or noteheads appear in unexpected colors), remove the filter and instead add these two lines inside `renderFill()` immediately after `renderer.resize(...)`:

```js
context.setFillStyle('#f0f0f0');
context.setStrokeStyle('#f0f0f0');
```

- [ ] **Step 2: Verify in browser at landscape mobile size**

DevTools → device toolbar → iPhone SE landscape (667×375 or similar). Expected:
- Dark background fills the screen
- White notation is visible and legible
- Button sits at the bottom with spacing
- No horizontal or vertical scroll
- Portrait overlay still works when switching orientation

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: invert VexFlow SVG for dark background"
```

---

### Task 8: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the workflow file**

```bash
mkdir -p .github/workflows
```

Contents of `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Enable GitHub Pages in repository settings**

Go to `https://github.com/Djimovanberlo/fill-fusion/settings/pages`.
Set **Source** to **GitHub Actions**. Save.

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions deployment to GitHub Pages"
git push origin main
```

- [ ] **Step 4: Verify deployment**

Go to `https://github.com/Djimovanberlo/fill-fusion/actions`. Expected: a workflow run is in progress or completed successfully.

Once complete, the app is live at: `https://djimovanberlo.github.io/fill-fusion/`

Open that URL on a mobile device in landscape to do a final end-to-end check.
