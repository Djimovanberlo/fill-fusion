<template>
  <div class="staff" ref="containerRef"></div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import {
  Renderer,
  Stave,
  Voice,
  Formatter,
  Beam,
  StaveNote,
  GraceNote,
  GraceNoteGroup,
} from "vexflow";

const props = defineProps({
  fill: {
    type: Object,
    default: null,
  },
});

const VOICE_CONFIG = {
  crash: { isXHead: true, stemDirection: 1 },
  hihat: { isXHead: true, stemDirection: 1 },
  hihatOpen: { isXHead: true, stemDirection: 1 },
  hihatFoot: { isXHead: true, stemDirection: -1 },
  highTom: { isXHead: false, stemDirection: 1 },
  midTom: { isXHead: false, stemDirection: 1 },
  floorTom: { isXHead: false, stemDirection: 1 },
  snare: { isXHead: false, stemDirection: 1 },
  kick: { isXHead: false, stemDirection: -1 },
};

const VOICE_COLORS = {
  crash: "#e63946",
  hihat: "#457b9d",
  hihatOpen: "#457b9d",
  hihatFoot: "#1d3557",
  highTom: "#2a9d8f",
  midTom: "#e9c46a",
  floorTom: "#f4a261",
  snare: "#6a4c93",
  kick: "#264653",
};

const containerRef = ref(null);

function renderEmpty() {
  const container = containerRef.value;
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

function renderFill(fill) {
  const container = containerRef.value;
  container.innerHTML = "";
  const width = container.clientWidth || 800;
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(width, 220);
  const context = renderer.getContext();

  const stave = new Stave(10, 60, width - 20);
  stave.addClef("percussion");
  stave.addTimeSignature("4/4");
  context.setFillStyle("#000");
  context.setStrokeStyle("#000");
  stave.setContext(context).draw();

  const voicesWithMeta = [];
  for (const [voiceName, noteData] of Object.entries(fill.voices)) {
    const cfg = VOICE_CONFIG[voiceName];
    if (!cfg) throw new Error(`Unknown voice: "${voiceName}"`);
    const notes = noteData.map((nd) => {
      const sn = new StaveNote({
        keys: [nd[0]],
        duration: nd[1],
        stemDirection: cfg.stemDirection,
        ...(cfg.isXHead ? { noteType: "x" } : {}),
      });
      if (nd[2] === "flam") {
        sn.addModifier(
          new GraceNoteGroup([
            new GraceNote({ keys: [nd[0]], duration: "8", slash: true }),
          ]),
        );
      }
      return sn;
    });

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickables(notes);
    const beams = Beam.generateBeams(notes.filter((n) => !n.isRest()));
    voicesWithMeta.push({ voice, beams, voiceName });
  }

  const vfVoices = voicesWithMeta.map(({ voice }) => voice);
  new Formatter().joinVoices(vfVoices).format(vfVoices, width - 40);

  for (const { voice, beams, voiceName } of voicesWithMeta) {
    const color = VOICE_COLORS[voiceName] || "#000";
    context.setFillStyle(color);
    context.setStrokeStyle(color);
    voice.draw(context, stave);
    beams.forEach((b) => b.setContext(context).draw());
  }
}

function render() {
  if (!containerRef.value) return;
  if (props.fill) {
    try {
      renderFill(props.fill);
    } catch (e) {
      containerRef.value.textContent = e.message;
    }
  } else {
    renderEmpty();
  }
}

onMounted(render);
watch(() => props.fill, render);
</script>
