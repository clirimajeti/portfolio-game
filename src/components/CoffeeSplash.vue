<template>
  <div 
    v-for="splash in coffeeSplashes"
    :key="splash.id"
    class="coffee-splash"
    :style="{ 
      left: `${splash.position.x}px`, 
      top: `${splash.position.y}px`
    }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const coffeeSplashes = computed(() => gameStore.coffeeSplashes)
</script>

<style scoped>
.coffee-splash {
  position: absolute;
  width: 40px;
  height: 40px;
  background-image: url('../assets/coffeHitsSplash.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1001;
  animation: splash 0.8s ease-out forwards;
}

@keyframes splash {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.8) rotate(360deg);
    opacity: 0;
  }
}
</style>