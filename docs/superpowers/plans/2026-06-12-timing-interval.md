# Fill Fusion — Timing / Interval Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a continuous timing loop that cycles through 3 empty measures then 1 random fill, with a live beat counter (1–4) and user-controllable BPM.

**Architecture:** `requestAnimationFrame` loop tracks elapsed time against `60000 / bpm` ms per beat. `beatIndex` (0–15) advances each beat; indices 0–11 are empty measures, 12–15 are the fill measure. `lastBeatTime` steps forward by exactly one beat duration per tick (never snaps to `now`) to prevent drift. A `renderEmpty()` function draws a bare percussion staff. BPM controls (text field + ± buttons) are fixed bottom-right; beat counter is fixed top-center.

**Tech Stack:** Vanilla JS, CSS3, VexFlow 4.x (global `Vex` via CDN).

> **Note:** `main.js` is also modified by the colors and hi-hat-bark feature branches. When merging all three, manual reconciliation of `main.js` will be needed.

---

## Project Context

No build step. `main.js` currently renders one random fill on load then stops. `index.html` has a `#staff` div inside `#app`. VexFlow is the global `Vex` loaded via CDN `<script>` tag. The existing dark theme (`background: #1a1a1a`) is unchanged in this branch.

## File Map

| File | Change |
|------|--------|
| `index.html` | Add `#beat-counter` and `#bpm-controls` markup |
| `style.css` | Style beat counter (fixed top-center) and BPM controls (fixed bottom-right) |
| `main.js` | Add `renderEmpty()`; add BPM state + controls; add RAF loop; replace one-shot render |

---

### Task 1: Add HTML markup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace index.html with the following**

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
  <div id="beat-counter">1</div>
  <main id="app">
    <div id="staff"></div>
  </main>
  <div id="bpm-controls">
    <button id="bpm-dec">−</button>
    <input id="bpm-input" type="text" value="120" />
    <button id="bpm-inc">+</button>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vexflow@4/build/cjs/vexflow.js"></script>
  <script type="module" src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add beat counter and BPM controls markup"
```

---

### Task 2: Style the new elements

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Append to style.css**

```css
#beat-counter {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem;
  font-weight: bold;
  color: #f0f0f0;
  user-select: none;
  z-index: 10;
}

#bpm-controls {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
}

#bpm-controls button {
  background: #444;
  color: #f0f0f0;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}

#bpm-controls button:hover {
  background: #666;
}

#bpm-input {
  width: 52px;
  text-align: center;
  font-size: 1rem;
  background: #333;
  color: #f0f0f0;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px;
}
```

- [ ] **Step 2: Verify layout in browser**

Serve with `npx serve .`. Open in landscape. Expected: beat counter "1" visible top-center in light color, BPM controls (− 120 +) visible bottom-right. Staff area and existing notation unaffected.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: style beat counter and BPM controls"
```

---

### Task 3: Add renderEmpty()

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Add renderEmpty() after the renderFill() function in main.js**

```js
function renderEmpty() {
  const container = document.getElementById("staff");
  container.innerHTML = "";

  const width = container.clientWidth || 800;
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(width, 220);
  const context = renderer.getContext();

  const stave = new Stave(10, 60, width - 20);
  stave.addClef("percussion");
  stave.addTimeSignature("4/4");
  stave.setContext(context).draw();
}
```

- [ ] **Step 2: Verify renderEmpty() works**

Temporarily call `renderEmpty();` at the bottom of main.js (after the existing one-shot render). Reload. Expected: empty percussion staff (clef + 4/4, no notes). Remove the temporary call before continuing.

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add renderEmpty function"
```

---

### Task 4: Add BPM state and controls

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Replace the one-shot render block at the bottom of main.js**

Remove:
```js
const fill = fills[Math.floor(Math.random() * fills.length)];
try {
  renderFill(fill);
} catch (e) {
  document.getElementById("staff").textContent = e.message;
}
```

Replace with:
```js
let bpm = 120;

function setBpm(value) {
  bpm = Math.min(300, Math.max(40, Math.round(value)));
  document.getElementById("bpm-input").value = bpm;
}

document.getElementById("bpm-dec").addEventListener("click", () => setBpm(bpm - 1));
document.getElementById("bpm-inc").addEventListener("click", () => setBpm(bpm + 1));
document.getElementById("bpm-input").addEventListener("change", (e) => {
  const parsed = parseInt(e.target.value, 10);
  setBpm(isNaN(parsed) ? bpm : parsed);
});
```

- [ ] **Step 2: Commit**

```bash
git add main.js
git commit -m "feat: add BPM state and controls"
```

---

### Task 5: Add RAF timing loop and initial render

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Append the RAF loop to the bottom of main.js**

```js
let beatIndex = 0;
let lastBeatTime = null;

function onBeat(index) {
  document.getElementById("beat-counter").textContent = (index % 4) + 1;

  if (index % 4 === 0) {
    if (index === 12) {
      const fill = fills[Math.floor(Math.random() * fills.length)];
      try {
        renderFill(fill);
      } catch (e) {
        document.getElementById("staff").textContent = e.message;
      }
    } else {
      renderEmpty();
    }
  }
}

function tick(timestamp) {
  if (lastBeatTime === null) {
    lastBeatTime = timestamp;
    onBeat(0);
    requestAnimationFrame(tick);
    return;
  }

  const mspb = 60000 / bpm;
  if (timestamp - lastBeatTime >= mspb) {
    lastBeatTime += mspb;
    beatIndex = (beatIndex + 1) % 16;
    onBeat(beatIndex);
  }

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
```

- [ ] **Step 2: Verify in browser at 120 BPM**

Reload. Expected:
- Beat counter ticks 1 → 2 → 3 → 4 → 1 at 120 BPM (one beat every 500ms)
- Empty percussion staff shows for measures 1–3 (12 beats)
- A random fill appears on measure 4
- Loop repeats continuously with a new random fill each cycle
- Clicking − / + adjusts BPM by 1; typing in the field and pressing Enter/Tab applies it (clamped to 40–300)
- Non-numeric input in the BPM field is reset to the current BPM value

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: RAF timing loop, 3-measure lead-in, beat counter"
```
