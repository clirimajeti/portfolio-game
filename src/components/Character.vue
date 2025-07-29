<template>
  <div 
    class="character"
    :style="{ 
      left: `${position.x}px`, 
      top: `${position.y}px`
    }"
    :class="{
      'character-throwing': isThrowingCoffee,
      'character-right-leg': currentLeg === 'right',
      'character-left-leg': currentLeg === 'left',
      'character-facing-left': facingDirection === 'left',
      'character-facing-right': facingDirection === 'right'
    }"
  />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import type { Position } from '../types'

const { position, currentLeg, facingDirection, isThrowingCoffee } = defineProps<{
  position: Position
  currentLeg?: 'right' | 'left' | 'idle'
  facingDirection?: 'right' | 'left'
  isThrowingCoffee?: boolean
}>()

// Debug: Watch when isThrowingCoffee changes
watchEffect(() => {
  console.log('Character state:', {
    isThrowingCoffee: isThrowingCoffee,
    currentLeg: currentLeg,
    facingDirection: facingDirection
  })
  
  if (isThrowingCoffee) {
    console.log('🎯 Character - isThrowingCoffee is TRUE, should show throwing animation!')
  }
})
</script>

<style scoped>
.character {
  position: absolute;
  width: 70px;
  height: 70px;
  z-index: 1000;
  transition: all 0.1s ease;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  /* Default: show right leg as default pose */
  background-image: url('../assets/right leg.png');
}

/* Right leg forward character image */
.character-right-leg:not(.character-throwing) {
  background-image: url('../assets/right leg.png');
}

/* Left leg forward character image */
.character-left-leg:not(.character-throwing) {
  background-image: url('../assets/left leg.png');
}

/* Throwing coffee character image - Higher specificity to override leg images */
.character-throwing {
  background-image: url('../assets/throwingCoffe.png') !important;
  animation: throwAnimation 1s ease-in-out;
}

/* Facing direction - flip character horizontally when facing left */
.character-facing-left {
  transform: scaleX(-1);
}

.character-facing-right {
  transform: scaleX(1);
}

/* Combine facing direction with throwing animation */
.character-throwing.character-facing-left {
  transform: scaleX(-1);
  animation: throwAnimationLeft 1s ease-in-out;
}

.character-throwing.character-facing-right {
  transform: scaleX(1);
  animation: throwAnimationRight 1s ease-in-out;
}

@keyframes throwAnimationRight {
  0% {
    transform: scaleX(1) scale(1) rotate(0deg);
  }
  50% {
    transform: scaleX(1) scale(1.1) rotate(-5deg);
  }
  100% {
    transform: scaleX(1) scale(1) rotate(0deg);
  }
}

@keyframes throwAnimationLeft {
  0% {
    transform: scaleX(-1) scale(1) rotate(0deg);
  }
  50% {
    transform: scaleX(-1) scale(1.1) rotate(5deg);
  }
  100% {
    transform: scaleX(-1) scale(1) rotate(0deg);
  }
}
</style>