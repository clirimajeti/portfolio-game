<template>
  <div class="game-container">
    <!-- Character -->
    <Character 
      :position="characterPosition" 
      :current-leg="currentLeg"
      :facing-direction="facingDirection"
      :is-throwing-coffee="isThrowingCoffee"
    />
    
    <!-- Coffee projectiles -->
    <Coffee />
    
    <!-- Bug enemies -->
    <Bug />
    
    <!-- Coffee splash effects -->
    <CoffeeSplash />
    
    
    
    <!-- Game UI -->
    <GameUI :level="currentLevel" :score="score" @cheat-activated="handleCheatCode" />
    
    <!-- Portfolio sections -->
    <div class="scroll-container" :style="{ transform: `translateX(-${currentSection * 100}vw)` }">
      <IntroSection @next="nextSection" />
      <AboutSection @next="nextSection" />
      <SkillsSection @next="nextSection" />
      <ProjectsSection @next="nextSection" />
      <ContactSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, provide, computed, watchEffect, toRef, ref } from 'vue'
import { useGameStore } from './stores/gameStore'
import Character from './components/Character.vue'
import Coffee from './components/Coffee.vue'
import Bug from './components/Bug.vue'
import CoffeeSplash from './components/CoffeeSplash.vue'
import GameUI from './components/GameUI.vue'
import IntroSection from './components/sections/IntroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import SkillsSection from './components/sections/SkillsSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import ContactSection from './components/sections/ContactSection.vue'
import { useKeyboardControls } from './composables/useKeyboardControls'
import { useGameNavigation } from './composables/useGameNavigation'
import { useGameMechanics } from './composables/useGameMechanics'

const { currentSection, currentLevel, nextSection } = useGameNavigation()

// Use Pinia store for state management
const gameStore = useGameStore()

console.log('App.vue - gameStore object:', gameStore)
console.log('App.vue - gameStore.score:', gameStore.score)
console.log('App.vue - gameStore.isThrowingCoffee:', gameStore.isThrowingCoffee)

// Create local reactive refs that sync with store
const score = ref(0)
const isPortalActive = ref(false)
const isThrowingCoffee = ref(false)

// Sync local refs with store - store returns primitive values, not refs!
watchEffect(() => {
  console.log('Raw store values:', {
    rawScore: gameStore.score,
    rawPortal: gameStore.isPortalActive,
    rawThrowing: gameStore.isThrowingCoffee
  })
  
  score.value = gameStore.score || 0
  isPortalActive.value = gameStore.isPortalActive || false
  isThrowingCoffee.value = gameStore.isThrowingCoffee || false
  
  console.log('App.vue - Synced values:', {
    score: score.value,
    isPortalActive: isPortalActive.value,
    isThrowingCoffee: isThrowingCoffee.value
  })
})

const {
  throwCoffee,
  gameLoop,
  checkPortalCollision
} = useGameMechanics(currentLevel)

const { position: characterPosition, currentLeg, facingDirection } = useKeyboardControls(
  { x: 0, y: 0 },
  () => {
    throwCoffee(characterPosition, facingDirection.value)
  },
  (position) => {
    if (checkPortalCollision(position)) {
      nextSection()
      return true
    }
    return false
  }
)

// Provide portal state to child components
provide('isPortalActive', isPortalActive)

// Cheat code handler
const handleCheatCode = () => {
  console.log('Cheat code activated! Skipping to next section...')
  nextSection()
}

let gameLoopInterval: number

onMounted(() => {
  // Start game loop
  gameLoopInterval = window.setInterval(gameLoop, 1000 / 60) // 60 FPS
})

onUnmounted(() => {
  if (gameLoopInterval) {
    clearInterval(gameLoopInterval)
  }
})
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.scroll-container {
  display: flex;
  height: 100vh;
  width: 500vw;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
