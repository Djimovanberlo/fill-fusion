<template>
  <div class="orientation-overlay">
    <p>Full fusion only works in landscape mode</p>
  </div>
  <main>
    <Stave :notes="notes" />
    <BpmControls v-model:bpm="bpm" />
  </main>
</template>

<script setup>
import { ref } from "vue";
import BpmControls from "./components/BpmControls.vue";
import Stave from "./components/Stave.vue";

const notes = ref([
  ["b/4", "q"],
  ["b/4", "q"],
  ["b/4", "q"],
  ["b/4", "q"],
]);
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
