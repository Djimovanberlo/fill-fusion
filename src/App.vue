<template>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <BeatCounter :beat="0" />
  <main>
    <div id="staff"></div>
  </main>
  <BpmControls v-model:bpm="bpm" />
</template>

<script setup>
import { ref } from 'vue'
import BeatCounter from './components/BeatCounter.vue'
import BpmControls from './components/BpmControls.vue'

const bpm = ref(120)
</script>
