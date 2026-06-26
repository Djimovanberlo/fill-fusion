<template>
  <div id="beat-counter">{{ beat + 1 }}</div>
</template>

<script setup>
defineProps({
  beat: {
    type: Number,
    required: true,
  },
})
</script>
