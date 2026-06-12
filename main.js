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

const { Renderer, Stave, Voice, Formatter, Beam } = Vex.Flow;

// Drum voice → VexFlow pitch/notehead/stem reference:
// crash:    a/5, ×-head, stem up
// hihat:    g/5, ×-head, stem up
// highTom:  e/5, oval,   stem up
// midTom:   d/5, oval,   stem up
// floorTom: a/4, oval,   stem up
// snare:    b/4, oval,   stem up
// kick:     c/4, oval,   stem down
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

  const width = container.clientWidth || 800;
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
    if (!cfg) throw new Error(`Unknown voice: "${voiceName}"`);
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
