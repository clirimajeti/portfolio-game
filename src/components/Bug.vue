<template>
  <div
    v-for="bug in bugEnemies"
    :key="bug.id"
    class="bug-enemy"
    :style="{
      left: `${bug.position.x}px`,
      top: `${bug.position.y}px`,
    }"
    :class="{ hit: bug.isHit }"
  >
    <!-- Multiple hit zones for head, body, tail -->
    <div v-if="!bug.isHit" class="bug-hit-zones">
      <div class="hit-zone hit-zone-head" data-zone="head" />
      <div class="hit-zone hit-zone-body" data-zone="body" />
      <div class="hit-zone hit-zone-tail" data-zone="tail" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const bugEnemies = computed(() => gameStore.bugEnemies)
</script>

<style scoped>
.bug-enemy {
  position: absolute;
  width: 45px;
  height: 45px;
  background-image: url('../assets/bug.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 998;
  animation: bugCrawl 2s linear infinite;
  
  /* Red glow effect radiating from center */
  filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.8))
          drop-shadow(0 0 16px rgba(255, 0, 0, 0.6))
          drop-shadow(0 0 24px rgba(255, 0, 0, 0.4));
}

.bug-enemy.hit {
  animation: bugHit 0.5s ease-out forwards;
}

@keyframes bugCrawl {
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-5deg) scale(1.05);
  }
  50% {
    transform: rotate(0deg) scale(1);
  }
  75% {
    transform: rotate(5deg) scale(1.05);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

.bug-hit-zones {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1001;
}

.hit-zone {
  position: absolute;
  /* Hide hit zones from user - only for collision detection */
  border: none;
  background: transparent;
}

/* Head hit zone - top part of bug */
.hit-zone-head {
  width: 15px;
  height: 15px;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
}

/* Body hit zone - center part of bug */
.hit-zone-body {
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Tail hit zone - bottom part of bug */
.hit-zone-tail {
  width: 12px;
  height: 12px;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}


@keyframes bugHit {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
}
</style>
