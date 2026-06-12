import { Renderer, Stave, StaveNote, Voice, Formatter, Beam } from 'https://esm.sh/vexflow';
import { fills } from './data/fills.js';

function parseNotes(str, stemDirection, noteType) {
  return str.split(',').map(token => {
    const [pitch, dur] = token.trim().split('/');
    if (pitch === 'r') return new StaveNote({ keys: ['b/4'], duration: dur + 'r' });
    const key = pitch.slice(0, -1).toLowerCase() + '/' + pitch.slice(-1);
    return new StaveNote({ keys: [key], duration: dur, stemDirection, ...(noteType ? { noteType } : {}) });
  });
}

function render(fill) {
  const el = document.getElementById('staff');
  el.innerHTML = '';
  const width = el.clientWidth || 700;
  const renderer = new Renderer(el, Renderer.Backends.SVG);
  renderer.resize(width, 220);
  const ctx = renderer.getContext();

  const stave = new Stave(10, 60, width - 20);
  stave.addClef('percussion').addTimeSignature('4/4').setContext(ctx).draw();

  const voices = [], beams = [];
  for (const [name, str] of Object.entries(fill.voices)) {
    const notes = parseNotes(str, name === 'kick' ? -1 : 1, (name === 'crash' || name === 'hihat') ? 'x' : null);
    const v = new Voice({ numBeats: 4, beatValue: 4 });
    v.addTickables(notes);
    voices.push(v);
    beams.push(...Beam.generateBeams(notes.filter(n => !n.isRest())));
  }
  new Formatter().joinVoices(voices).format(voices, width - 40);
  voices.forEach(v => v.draw(ctx, stave));
  beams.forEach(b => b.setContext(ctx).draw());
}

const fill = fills[Math.floor(Math.random() * fills.length)];
try {
  render(fill);
} catch (e) {
  document.getElementById('staff').textContent = e.message;
}
