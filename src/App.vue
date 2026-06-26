<template>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <BeatCounter :beat="0" />
  <main>
    <div id="staff"></div>
  </main>
</template>

<script setup>
import BeatCounter from './components/BeatCounter.vue'
</script>
