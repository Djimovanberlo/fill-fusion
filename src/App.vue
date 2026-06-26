<template>
  <div class="orientation-overlay">
    <p>Full fusion only works in landscape mode</p>
  </div>
  <main>
    <BeatCounter :beat="beat" />
    <Staff :fill="currentFill" />
    <BpmControls v-model:bpm="bpm" />
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { fills } from "./data/fills.js";
import BeatCounter from "./components/BeatCounter.vue";
import BpmControls from "./components/BpmControls.vue";
import Staff from "./components/Staff.vue";

const bpm = ref(100);
const beat = ref(1);
const measureIndex = ref(0);
const currentFill = ref(null);

let rafId = null;
let lastBeatTime = null;
let beatIndex = 0;

function onBeat(b) {
  beat.value = b;
  if (b === 0) {
    if (measureIndex.value % 4 === 3) {
      currentFill.value = fills[Math.floor(Math.random() * fills.length)];
    } else {
      currentFill.value = null;
    }
    measureIndex.value++;
  }
}

function tick(timestamp) {
  if (lastBeatTime === null) {
    lastBeatTime = timestamp;
    onBeat(0);
    rafId = requestAnimationFrame(tick);
    return;
  }

  const mspb = 60000 / bpm.value;
  if (timestamp - lastBeatTime >= mspb) {
    lastBeatTime += mspb;
    beatIndex = (beatIndex + 1) % 4;
    onBeat(beatIndex);
  }

  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  // rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});
</script>

<style lang="css" scoped>
main {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  height: 100%;
}

.orientation-overlay {
  display: none;
}

@media (orientation: portrait) {
  main {
    display: none;
  }

  .orientation-overlay {
    display: block;
    width: fit-content;
    margin-inline: auto;
  }
}
</style>
