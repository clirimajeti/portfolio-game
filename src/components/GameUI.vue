<template>
  <div class="game-ui">
    <div class="level-indicator">Level: {{ level }} / 5</div>
    <div class="score-indicator">Score: {{ score || 0 }}</div>
    <div class="controls-hint">
      Use ← → ↑ ↓ keys to move<br>
      Press Space to throw coffee<br>
      Hit bugs to earn points!
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'

const { level, score } = defineProps<{
  level: number
  score?: number
}>()

// Debug: Watch score changes
watchEffect(() => {
  console.log('GameUI - Score updated:', score)
})
</script>

<style scoped>
.game-ui {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 999;
  color: var(--accent-color);
  font-family: var(--pixel-font);
}

.level-indicator {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
}

.score-indicator {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--success-color);
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
}


.controls-hint {
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-light);
  background: rgba(0, 0, 0, 0.7);
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--accent-color);
}

</style>