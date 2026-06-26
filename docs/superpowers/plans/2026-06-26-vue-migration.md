# Vue Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Fill Fusion from a plain HTML/JS app to a Vite + Vue 3 (Composition API, plain JS) app with the same functionality and zero visual changes.

**Architecture:** All state and the requestAnimationFrame timer loop live in App.vue. Three focused components handle rendering: Staff.vue (VexFlow), BpmControls.vue, and BeatCounter.vue. Vue mounts to `<div id="app">` in index.html, which inherits the existing `#app` flex-centering CSS — no style changes needed since beat-counter, bpm-controls, and orientation-overlay are all `position: fixed` and out of flow.

**Tech Stack:** Vite 5, Vue 3 (Composition API, `<script setup>`), VexFlow 4 (npm), plain JavaScript.

---

## File Map

| Action | Path |
|--------|------|
| Modify | `package.json` |
| Modify | `index.html` |
| Create | `vite.config.js` |
| Create | `src/main.js` |
| Create | `src/App.vue` |
| Create | `src/components/BeatCounter.vue` |
| Create | `src/components/BpmControls.vue` |
| Create | `src/components/Staff.vue` |
| Create | `src/data/fills.js` |
| Create | `src/style.css` |
| Delete | `main.js` (root) |
| Delete | `style.css` (root) |
| Delete | `data/fills.js` |
| Modify | `.github/workflows/deploy.yml` |

---

## Task 1: Vite + Vue scaffolding

**Files:**
- Modify: `package.json`
- Create: `vite.config.js`
- Modify: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`

- [ ] **Step 1: Replace `package.json`**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vexflow": "^4.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

- [ ] **Step 3: Replace `index.html`**

The only mount point. No CDN script tags — VexFlow now comes via npm.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fill Fusion</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create `src/main.js`**

```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 5: Create `src/App.vue` (minimal shell — logic added in Task 6)**

```vue
<template>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <main>
    <div id="staff"></div>
  </main>
</template>

<script setup>
</script>
```

- [ ] **Step 6: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Run dev server and verify**

```bash
npm run dev
```

Open http://localhost:5173. Expected: blank white page with title "Fill Fusion" in the browser tab. No console errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/main.js src/App.vue
git commit -m "feat: add Vite + Vue scaffold"
```

---

## Task 2: Move fills data and styles

**Files:**
- Create: `src/data/fills.js`
- Create: `src/style.css`

- [ ] **Step 1: Copy `data/fills.js` → `src/data/fills.js`**

Create `src/data/fills.js` with identical content to the current `data/fills.js`:

```js
// Each voice is an array of [key, duration, ?modifier] tuples in VexFlow format.
// Keys: 'b/4', 'g/5', etc. Durations: 'w' 'h' 'q' '8' '16', append 'r' for rests.
// Optional third element: 'flam' adds a grace note before the note.
export const fills = [
  {
    id: 'fill-001',
    voices: {
      crash:    [['b/4', 'wr']],
      hihat:    [['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q']],
      highTom:  [['b/4', 'hr'], ['b/4', 'qr'], ['e/5', 'q']],
      midTom:   [['b/4', 'wr']],
      floorTom: [['b/4', 'wr']],
      snare:    [['b/4', 'qr'], ['b/4', 'q'], ['b/4', 'qr'], ['b/4', 'q']],
      kick:     [['c/4', 'q'], ['b/4', 'qr'], ['c/4', 'q'], ['b/4', 'qr']],
    },
  },
  {
    id: 'fill-002',
    voices: {
      crash:    [['b/4', 'wr']],
      hihat:    [['b/4', 'wr']],
      highTom:  [['b/4', 'qr'], ['e/5', 'q'], ['b/4', 'hr']],
      midTom:   [['b/4', 'hr'], ['d/5', 'q'], ['b/4', 'qr']],
      floorTom: [['b/4', 'hr'], ['b/4', 'qr'], ['a/4', 'q']],
      snare:    [['b/4', 'q'], ['b/4', 'hr'], ['b/4', 'qr']],
      kick:     [['c/4', 'q'], ['b/4', 'qr'], ['b/4', 'hr']],
    },
  },
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
        ['b/4', 'q', 'flam'],
        ['b/4', 'qr'],
        ['b/4', 'q'],
      ],
      hihatFoot: [['e/4', 'q'], ['e/4', 'qr'], ['e/4', 'q'], ['e/4', 'qr']],
      kick:      [['c/4', 'q'], ['b/4', 'qr'], ['c/4', 'q'], ['b/4', 'qr']],
    },
  },
]
```

- [ ] **Step 2: Copy `style.css` → `src/style.css`**

Create `src/style.css` with identical content to the current `style.css`:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  background: white;
  color: #1a1a1a;
  font-family: sans-serif;
  overflow: hidden;
}

#app {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 16px;
}

#staff {
  width: 100%;
}

#orientation-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: white;
  color: #1a1a1a;
  z-index: 100;
  text-align: center;
  font-size: 1.2rem;
  padding: 2rem;
}

@media (orientation: portrait) {
  #orientation-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

#staff svg {
  width: 100% !important;
  height: auto !important;
}

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

- [ ] **Step 3: Verify styles apply**

With `npm run dev` running, open http://localhost:5173. Expected: white background, no visible elements yet (orientation overlay hidden since landscape on desktop).

- [ ] **Step 4: Commit**

```bash
git add src/data/fills.js src/style.css
git commit -m "feat: move fills data and styles to src/"
```

---

## Task 3: BeatCounter component

**Files:**
- Create: `src/components/BeatCounter.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create `src/components/BeatCounter.vue`**

```vue
<template>
  <div id="beat-counter">{{ beat + 1 }}</div>
</template>

<script setup>
defineProps({
  beat: {
    type: Number,
    required: true,
  },
})
</script>
```

- [ ] **Step 2: Wire BeatCounter into `src/App.vue` with a hardcoded value**

```vue
<template>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <BeatCounter :beat="0" />
  <main>
    <div id="staff"></div>
  </main>
</template>

<script setup>
import BeatCounter from './components/BeatCounter.vue'
</script>
```

- [ ] **Step 3: Verify beat counter renders**

Open http://localhost:5173. Expected: "1" displayed in large light-grey text at the top-center of the screen.

- [ ] **Step 4: Commit**

```bash
git add src/components/BeatCounter.vue src/App.vue
git commit -m "feat: add BeatCounter component"
```

---

## Task 4: BpmControls component

**Files:**
- Create: `src/components/BpmControls.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create `src/components/BpmControls.vue`**

```vue
<template>
  <div id="bpm-controls">
    <button @click="emit('update:bpm', clamp(bpm - 1))">−</button>
    <input
      id="bpm-input"
      type="number"
      :value="bpm"
      min="40"
      max="300"
      @change="onInputChange"
    />
    <button @click="emit('update:bpm', clamp(bpm + 1))">+</button>
  </div>
</template>

<script setup>
const props = defineProps({
  bpm: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:bpm'])

function clamp(value) {
  return Math.min(300, Math.max(40, Math.round(value)))
}

function onInputChange(e) {
  const parsed = parseInt(e.target.value, 10)
  emit('update:bpm', isNaN(parsed) ? props.bpm : clamp(parsed))
}
</script>
```

- [ ] **Step 2: Wire BpmControls into `src/App.vue` with v-model**

```vue
<template>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <BeatCounter :beat="0" />
  <main>
    <div id="staff"></div>
  </main>
  <BpmControls v-model:bpm="bpm" />
</template>

<script setup>
import { ref } from 'vue'
import BeatCounter from './components/BeatCounter.vue'
import BpmControls from './components/BpmControls.vue'

const bpm = ref(120)
</script>
```

- [ ] **Step 3: Verify BPM controls work**

Open http://localhost:5173. Expected: −/120/+ controls in bottom-right corner. Clicking − decrements, + increments. Typing a value in the input and pressing Enter updates it. Values clamp to 40–300.

- [ ] **Step 4: Commit**

```bash
git add src/components/BpmControls.vue src/App.vue
git commit -m "feat: add BpmControls component"
```

---

## Task 5: Staff component

**Files:**
- Create: `src/components/Staff.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create `src/components/Staff.vue`**

VexFlow renders imperatively into a DOM element. `containerRef` is a template ref for the div. A `watch` on `fill` triggers re-render whenever the prop changes. `onMounted` renders the initial empty stave.

```vue
<template>
  <div id="staff" ref="containerRef"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  Renderer,
  Stave,
  Voice,
  Formatter,
  Beam,
  StaveNote,
  GraceNote,
  GraceNoteGroup,
} from 'vexflow'

const props = defineProps({
  fill: {
    type: Object,
    default: null,
  },
})

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
}

const VOICE_COLORS = {
  crash:     '#e63946',
  hihat:     '#457b9d',
  hihatOpen: '#457b9d',
  hihatFoot: '#1d3557',
  highTom:   '#2a9d8f',
  midTom:    '#e9c46a',
  floorTom:  '#f4a261',
  snare:     '#6a4c93',
  kick:      '#264653',
}

const containerRef = ref(null)

function renderEmpty() {
  const container = containerRef.value
  container.innerHTML = ''
  const width = container.clientWidth || 800
  const renderer = new Renderer(container, Renderer.Backends.SVG)
  renderer.resize(width, 220)
  const context = renderer.getContext()
  const stave = new Stave(10, 60, width - 20)
  stave.addClef('percussion')
  stave.addTimeSignature('4/4')
  stave.setContext(context).draw()
}

function renderFill(fill) {
  const container = containerRef.value
  container.innerHTML = ''
  const width = container.clientWidth || 800
  const renderer = new Renderer(container, Renderer.Backends.SVG)
  renderer.resize(width, 220)
  const context = renderer.getContext()

  const stave = new Stave(10, 60, width - 20)
  stave.addClef('percussion')
  stave.addTimeSignature('4/4')
  context.setFillStyle('#000')
  context.setStrokeStyle('#000')
  stave.setContext(context).draw()

  const voicesWithMeta = []
  for (const [voiceName, noteData] of Object.entries(fill.voices)) {
    const cfg = VOICE_CONFIG[voiceName]
    if (!cfg) throw new Error(`Unknown voice: "${voiceName}"`)
    const notes = noteData.map((nd) => {
      const sn = new StaveNote({
        keys: [nd[0]],
        duration: nd[1],
        stemDirection: cfg.stemDirection,
        ...(cfg.isXHead ? { noteType: 'x' } : {}),
      })
      if (nd[2] === 'flam') {
        sn.addModifier(
          new GraceNoteGroup([
            new GraceNote({ keys: [nd[0]], duration: '8', slash: true }),
          ])
        )
      }
      return sn
    })

    const voice = new Voice({ numBeats: 4, beatValue: 4 })
    voice.addTickables(notes)
    const beams = Beam.generateBeams(notes.filter((n) => !n.isRest()))
    voicesWithMeta.push({ voice, beams, voiceName })
  }

  const vfVoices = voicesWithMeta.map(({ voice }) => voice)
  new Formatter().joinVoices(vfVoices).format(vfVoices, width - 40)

  for (const { voice, beams, voiceName } of voicesWithMeta) {
    const color = VOICE_COLORS[voiceName] || '#000'
    context.setFillStyle(color)
    context.setStrokeStyle(color)
    voice.draw(context, stave)
    beams.forEach((b) => b.setContext(context).draw())
  }
}

function render() {
  if (!containerRef.value) return
  if (props.fill) {
    try {
      renderFill(props.fill)
    } catch (e) {
      containerRef.value.textContent = e.message
    }
  } else {
    renderEmpty()
  }
}

onMounted(render)
watch(() => props.fill, render)
</script>
```

- [ ] **Step 2: Wire Staff into `src/App.vue` with a hardcoded null fill**

```vue
<template>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <BeatCounter :beat="0" />
  <main>
    <Staff :fill="null" />
  </main>
  <BpmControls v-model:bpm="bpm" />
</template>

<script setup>
import { ref } from 'vue'
import BeatCounter from './components/BeatCounter.vue'
import BpmControls from './components/BpmControls.vue'
import Staff from './components/Staff.vue'

const bpm = ref(120)
</script>
```

- [ ] **Step 3: Verify the empty stave renders**

Open http://localhost:5173. Expected: a percussion stave with clef and 4/4 time signature rendered in the center of the page. No notes, no errors in the console.

- [ ] **Step 4: Commit**

```bash
git add src/components/Staff.vue src/App.vue
git commit -m "feat: add Staff component with VexFlow rendering"
```

---

## Task 6: App.vue — state and timer loop

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Replace `src/App.vue` with the full implementation**

```vue
<template>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <BeatCounter :beat="beat" />
  <main>
    <Staff :fill="currentFill" />
  </main>
  <BpmControls v-model:bpm="bpm" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { fills } from './data/fills.js'
import BeatCounter from './components/BeatCounter.vue'
import BpmControls from './components/BpmControls.vue'
import Staff from './components/Staff.vue'

const bpm = ref(120)
const beat = ref(0)
const measureIndex = ref(0)
const currentFill = ref(null)

let rafId = null
let lastBeatTime = null
let beatIndex = 0

function onBeat(b) {
  beat.value = b
  if (b === 0) {
    if (measureIndex.value % 4 === 3) {
      currentFill.value = fills[Math.floor(Math.random() * fills.length)]
    } else {
      currentFill.value = null
    }
    measureIndex.value++
  }
}

function tick(timestamp) {
  if (lastBeatTime === null) {
    lastBeatTime = timestamp
    onBeat(0)
    rafId = requestAnimationFrame(tick)
    return
  }

  const mspb = 60000 / bpm.value
  if (timestamp - lastBeatTime >= mspb) {
    lastBeatTime += mspb
    beatIndex = (beatIndex + 1) % 4
    onBeat(beatIndex)
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>
```

- [ ] **Step 2: Verify the full app works**

Open http://localhost:5173. Expected:
- Beat counter at top counts 1 → 2 → 3 → 4 → 1 at the current BPM
- Empty stave shows for measures 1, 2, 3
- On the 4th measure a random fill is rendered with colored notes
- BPM controls change the tempo in real time
- Rotating to portrait (or resizing to portrait aspect ratio) shows the orientation overlay

- [ ] **Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat: wire App.vue state and timer loop"
```

---

## Task 7: Remove old root-level files

**Files:**
- Delete: `main.js`
- Delete: `style.css`
- Delete: `data/fills.js` (and `data/` directory)

- [ ] **Step 1: Delete the old files**

```bash
git rm main.js style.css data/fills.js
rmdir data
```

- [ ] **Step 2: Verify dev server still works**

With `npm run dev` still running (or restart it), open http://localhost:5173. Expected: app works exactly as before. No errors.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove old root-level source files"
```

---

## Task 8: Update GitHub Pages deploy workflow

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Replace `.github/workflows/deploy.yml`**

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

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify the build works locally**

```bash
npm run build
```

Expected: `dist/` folder created, no errors. Output should list bundled files including an `index.html` and JS/CSS assets.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: update GitHub Pages deploy to build Vite app"
```
