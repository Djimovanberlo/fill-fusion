<template>
  <div id="orientation-overlay">
    <p>Please rotate your device to landscape mode</p>
  </div>
  <BeatCounter :beat="beat" />
  <main>
    <Staff :fill="currentFill" />
  </main>
  <BpmControls v-model:bpm="bpm" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { fills } from './data/fills.js'
import BeatCounter from './components/BeatCounter.vue'
import BpmControls from './components/BpmControls.vue'
import Staff from './components/Staff.vue'

const bpm = ref(120)
const beat = ref(0)
const measureIndex = ref(0)
const currentFill = ref(null)

let rafId = null
let lastBeatTime = null
let beatIndex = 0

function onBeat(b) {
  beat.value = b
  if (b === 0) {
    if (measureIndex.value % 4 === 3) {
      currentFill.value = fills[Math.floor(Math.random() * fills.length)]
    } else {
      currentFill.value = null
    }
    measureIndex.value++
  }
}

function tick(timestamp) {
  if (lastBeatTime === null) {
    lastBeatTime = timestamp
    onBeat(0)
    rafId = requestAnimationFrame(tick)
    return
  }

  const mspb = 60000 / bpm.value
  if (timestamp - lastBeatTime >= mspb) {
    lastBeatTime += mspb
    beatIndex = (beatIndex + 1) % 4
    onBeat(beatIndex)
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>
