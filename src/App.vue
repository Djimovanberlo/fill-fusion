<template>
  <div class="orientation-overlay">
    <p>Full fusion only works in landscape mode</p>
  </div>
  <main>
    <BpmControls />
    <Stave :notes="notes" />
    <Stave class="stave-preview" :notes="notes" />
  </main>
</template>

<script setup>
import { ref } from "vue";
import BpmControls from "./components/BpmControls.vue";
import Stave from "./components/Stave.vue";

// const notes = ref([
//   ["b/4", "q"],
//   ["b/4", "q"],
//   ["b/4", "q"],
//   ["b/4", "q"],
// ]);

const notes = ref([
  ["b/4", "8"],
  ["b/4", "8"],
  ["b/4", "8"],
  ["b/4", "8"],
  ["b/4", "8"],
  ["b/4", "8"],
  ["b/4", "8"],
  ["b/4", "8"],
]);
</script>

<style lang="css" scoped>
main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: center;
  height: 100%;
}

.stave-preview {
  transform: scale(0.8);
  transform-origin: bottom center;
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
