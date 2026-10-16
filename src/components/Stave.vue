<template>
  <div class="staff" ref="containerRef"></div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import {
  Renderer as VexRenderer,
  Stave as VexStave,
  Voice as VexVoice,
  Formatter as VexFormatter,
  StaveNote as VexStaveNote,
} from "vexflow";

const TIME_SIGNATURE = { numBeats: 4, beatValue: 4 };

const props = defineProps({
  // Array of [key, duration] tuples, e.g. [["b/4", "q"], ["b/4", "q"]]
  notes: {
    type: Array,
    default: () => [],
  },
});

const containerRef = ref(null);

const draw = () => {
  const container = containerRef.value;

  if (!container) {
    console.warn("Container ref is not available for stave component");
    return;
  }

  container.innerHTML = "";
  const width = container.clientWidth || 800;

  const renderer = new VexRenderer(container, VexRenderer.Backends.SVG);
  renderer.resize(width, 220);
  const context = renderer.getContext();

  const stave = new VexStave(10, 60, width - 20);
  stave.addClef("percussion");
  stave.addTimeSignature(
    `${TIME_SIGNATURE.numBeats}/${TIME_SIGNATURE.beatValue}`,
  );
  stave.setConfigForLines([
    { visible: false },
    { visible: false },
    { visible: true }, // middle line only
    { visible: false },
    { visible: false },
  ]);
  stave.setContext(context).draw();

  if (!props.notes.length) {
    console.warn("No notes provided for stave component");
    return;
  }

  const notes = props.notes.map(
    ([key, duration]) =>
      new VexStaveNote({ keys: [key], duration, stem_direction: 1 }),
  );
  const voice = new VexVoice(TIME_SIGNATURE).addTickables(notes);
  new VexFormatter().joinVoices([voice]).format([voice], width - 100);
  voice.draw(context, stave);
};

// flush: "post" defers the first run until after mount, so the container ref exists
watchEffect(draw, { flush: "post" });
</script>
