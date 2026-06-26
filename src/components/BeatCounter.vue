<template>
  <div class="beat-counter">
    <p>{{ beat + 1 }} / 1</p>
  </div>
</template>

<script setup>
defineProps({
  beat: Number,
});
</script>

<style lang="css" scoped>
.beat-counter {
  font-size: 22px;
  text-align: center;
}
</style>
