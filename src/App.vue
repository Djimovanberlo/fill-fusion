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
