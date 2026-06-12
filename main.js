import { fills } from "./data/fills.js";

const { Renderer, Stave, Voice, Formatter, Beam, StaveNote } = Vex.Flow;

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

  const vfVoices = [];
  const allBeams = [];

  for (const [voiceName, noteData] of Object.entries(fill.voices)) {
    const cfg = VOICE_CONFIG[voiceName];
    if (!cfg) throw new Error(`Unknown voice: "${voiceName}"`);
    const notes = noteData.map(([key, dur]) => new StaveNote({
      keys: [key],
      duration: dur,
      stemDirection: cfg.stemDirection,
      ...(cfg.isXHead ? { noteType: "x" } : {}),
    }));

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickables(notes);
    vfVoices.push(voice);

    allBeams.push(...Beam.generateBeams(notes.filter((n) => !n.isRest())));
  }

  new Formatter().joinVoices(vfVoices).format(vfVoices, width - 40);
  vfVoices.forEach((v) => v.draw(context, stave));
  allBeams.forEach((b) => b.setContext(context).draw());
}

const fill = fills[Math.floor(Math.random() * fills.length)];
try {
  renderFill(fill);
} catch (e) {
  document.getElementById("staff").textContent = e.message;
}
