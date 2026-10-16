<template>
  <div class="staff" ref="containerRef"></div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import {
  Renderer as VexRenderer,
  Stave as VexStave,
  Voice as VexVoice,
  Formatter as VexFormatter,
  Beam as VexBeam,
  StaveNote as VexStaveNote,
  GraceNote as VexGraceNote,
  GraceNoteGroup as VexGraceNoteGroup,
} from "vexflow";
import { VOICE_COLORS, VOICE_CONFIG } from "../data/voices";
import { COLORS } from "../data/colors";

const props = defineProps({
  fill: {
    type: Object,
    default: null,
  },
});

const containerRef = ref(null);

const renderStave = () => {
  const container = containerRef.value;

  if (!container) {
    return;
  }

  container.innerHTML = "";
  const width = container.clientWidth || 800;
  const height = 220;
  const renderer = new VexRenderer(container, VexRenderer.Backends.SVG);
  renderer.resize(width, height);

  const staveX = 10;
  const staveY = 60;
  const staveWidth = width - 20;
  const stave = new VexStave(staveX, staveY, staveWidth);

  const context = renderer.getContext();
  stave.addClef("percussion");
  stave.addTimeSignature("4/4");

  return { context, stave, width, height };
};

function renderEmpty() {
  const { context, stave } = renderStave();
  // context.setFillStyle(COLORS.black);
  // context.setStrokeStyle(COLORS.black);
  stave.setContext(context).draw();
}

function renderFill(fill) {
  const { context, stave, width } = renderStave();
  context.setFillStyle(COLORS.black);
  context.setStrokeStyle(COLORS.black);
  stave.setContext(context).draw();

  const voicesWithMeta = [];
  for (const [voiceName, noteData] of Object.entries(fill.voices)) {
    const cfg = VOICE_CONFIG[voiceName];

    if (!cfg) {
      throw new Error(`Unknown voice: "${voiceName}"`);
    }

    const notes = noteData.map((nd) => {
      const key = nd[0];
      const duration = nd[1];
      const stemDirection = cfg.stemDirection;

      return new VexStaveNote({
        keys: [key],
        duration: duration,
        stem_direction: stemDirection,
        ...(cfg.noteHead ? { type: cfg.noteHead } : {}),
      });
    });

    const voice = new VexVoice({ numBeats: 4, beatValue: 4 }).addTickables(
      notes,
    );
    const beams = VexBeam.generateBeams(notes.filter((n) => !n.isRest()));
    const voiceColor = VOICE_COLORS[voiceName] || COLORS.black;
    voicesWithMeta.push({ voice, beams, voiceColor });
  }

  const vfVoices = voicesWithMeta.map(({ voice }) => voice);
  new VexFormatter().joinVoices(vfVoices).format(vfVoices, width - 40);

  for (const { voice, beams, voiceColor } of voicesWithMeta) {
    context.setFillStyle(voiceColor);
    context.setStrokeStyle(voiceColor);
    voice.draw(context, stave);
    beams.forEach((b) => b.setContext(context).draw());
  }
}

function renderStaff() {
  if (!containerRef.value) {
    return;
  }

  if (props.fill) {
    renderFill(props.fill);
    return;
  }

  renderEmpty();
}

onMounted(renderStaff);
watch(() => props.fill, renderStaff);
</script>
