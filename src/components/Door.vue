<template>
  <div 
    class="door"
    :style="{ 
      left: `${position.x}px`, 
      top: `${position.y}px`
    }"
    :class="{
      'door-locked': !isUnlocked,
      'door-unlocked': isUnlocked
    }"
  >
    <div class="door-body" />
    <div class="door-indicator">
      <i v-if="isUnlocked" class="fas fa-door-open" />
      <i v-else class="fas fa-lock" />
    </div>
    <div v-if="isUnlocked" class="door-text">Walk through!</div>
    <div v-else class="door-text">Kill all bugs to unlock</div>
  </div>
</template>

<script setup lang="ts">
import type { Position } from '../types'

defineProps<{
  position: Position
  isUnlocked: boolean
}>()
</script>

<style scoped>
.door {
  position: absolute;
  width: 80px;
  height: 100px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.door-body {
  width: 60px;
  height: 80px;
  border: 3px solid;
  border-radius: 10px 10px 0 0;
  position: relative;
  transition: all 0.3s ease;
}

.door-locked .door-body {
  background: linear-gradient(135deg, #8b0000 0%, #a00000 50%, #8b0000 100%);
  border-color: #ff4444;
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.5);
}

.door-unlocked .door-body {
  background: linear-gradient(135deg, #006400 0%, #00a000 50%, #006400 100%);
  border-color: #44ff44;
  box-shadow: 0 0 15px rgba(68, 255, 68, 0.5);
  animation: doorGlow 2s ease-in-out infinite alternate;
}

.door-indicator {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  color: var(--white);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.door-text {
  margin-top: 5px;
  font-size: 12px;
  color: var(--accent-color);
  text-align: center;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  min-height: 24px;
  display: flex;
  align-items: center;
}

.door-locked {
  animation: lockedShake 3s ease-in-out infinite;
}

.door-unlocked {
  animation: unlockedPulse 1.5s ease-in-out infinite;
}

@keyframes doorGlow {
  0% {
    box-shadow: 0 0 15px rgba(68, 255, 68, 0.5);
  }
  100% {
    box-shadow: 0 0 25px rgba(68, 255, 68, 0.8);
  }
}

@keyframes lockedShake {
  0%, 90%, 100% {
    transform: translateX(0);
  }
  95% {
    transform: translateX(-2px);
  }
  97% {
    transform: translateX(2px);
  }
}

@keyframes unlockedPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>