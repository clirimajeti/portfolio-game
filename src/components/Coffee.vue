<template>
  <div
    v-for="coffee in coffeeProjectiles"
    :key="coffee.id"
    class="coffee-projectile"
    :style="{
      left: `${coffee.position.x}px`,
      top: `${coffee.position.y}px`,
      transform: `rotate(${coffee.rotation}deg)`,
    }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const coffeeProjectiles = computed(() => gameStore.coffeeProjectiles)
</script>

<style scoped>
.coffee-projectile {
  position: absolute;
  width: 20px;
  height: 20px;
  background-image: url('../assets/coffeMugImage.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 999;
  transition: transform 0.1s ease;
  border-radius: 50%;
}
</style>
