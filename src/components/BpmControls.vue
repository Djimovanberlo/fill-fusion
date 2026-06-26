<template>
  <div id="bpm-controls">
    <button @click="emit('update:bpm', clamp(bpm - 1))">−</button>
    <input
      id="bpm-input"
      type="number"
      :value="bpm"
      min="40"
      max="300"
      @change="onInputChange"
    />
    <button @click="emit('update:bpm', clamp(bpm + 1))">+</button>
  </div>
</template>

<script setup>
const props = defineProps({
  bpm: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:bpm'])

function clamp(value) {
  return Math.min(300, Math.max(40, Math.round(value)))
}

function onInputChange(e) {
  const parsed = parseInt(e.target.value, 10)
  emit('update:bpm', isNaN(parsed) ? props.bpm : clamp(parsed))
}
</script>
