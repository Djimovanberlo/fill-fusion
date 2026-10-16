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
});

const emit = defineEmits(["update:bpm"]);

function clamp(value) {
  return Math.min(300, Math.max(40, Math.round(value)));
}

function onInputChange(e) {
  const parsed = parseInt(e.target.value, 10);
  emit("update:bpm", isNaN(parsed) ? props.bpm : clamp(parsed));
}
</script>

<style lang="css" scoped>
#bpm-controls {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
}

#bpm-controls button {
  background: #444;
  color: #f0f0f0;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}

#bpm-controls button:hover {
  background: #666;
}

#bpm-input {
  width: 52px;
  text-align: center;
  font-size: 1rem;
  background: #333;
  color: #f0f0f0;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px;
}
</style>
