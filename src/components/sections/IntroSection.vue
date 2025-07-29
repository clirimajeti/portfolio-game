<template>
  <section class="game-section intro-section">
    <Particles />
    <div class="intro-content">
      <h1 class="intro-title">Alex Dev</h1>
      <p class="intro-subtitle">Full-Stack Developer & Game Creator</p>
      <div class="game-instructions" :class="{ 'hero-hover': isHeroHovering }" ref="instructionsElement">
        <p>Welcome to my interactive portfolio!</p>
        <p>Navigate through the levels to learn more about me.</p>
        <p>Click the portal or press → to continue</p>
      </div>
    </div>
    <div class="portal" :class="{ 'portal-active': isPortalActive }" />
  </section>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'
import Particles from '../Particles.vue'

const emit = defineEmits<{
  next: []
}>()

const isPortalActive = inject('isPortalActive', ref(false))

const isHeroHovering = ref(false)
const instructionsElement = ref<HTMLElement>()

// Function to trigger hero hover effect
const triggerHeroHover = () => {
  isHeroHovering.value = true
  setTimeout(() => {
    isHeroHovering.value = false
  }, 300)
}

// Listen for custom event to trigger hover
onMounted(() => {
  if (instructionsElement.value) {
    instructionsElement.value.addEventListener('hero-collision', triggerHeroHover)
  }
})

// Portal collision will be handled by the main game logic
</script>

<style scoped>
.game-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
}

.intro-section {
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%);
}

.intro-content {
  text-align: center;
  z-index: 2;
  max-width: 800px;
  padding: 0 20px;
}

.intro-title {
  font-size: 4rem;
  color: var(--accent-color);
  text-shadow: 0 0 20px var(--accent-color);
  margin-bottom: 1rem;
  animation: glow 2s ease-in-out infinite alternate;
}

.intro-subtitle {
  font-size: 1.5rem;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.game-instructions {
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  border: 2px solid var(--accent-color);
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-instructions:hover,
.game-instructions.hero-hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
}

.game-instructions p {
  margin-bottom: 10px;
  color: var(--white);
}

.portal {
  position: absolute;
  bottom: 50px;
  right: 100px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
  border-radius: 50%;
  cursor: pointer;
  animation: pulse 2s infinite;
  transition: transform 0.3s ease;
}

.portal:hover {
  transform: scale(1.2);
}

.portal-active {
  background: radial-gradient(circle, var(--success-color) 0%, transparent 70%) !important;
  box-shadow: 0 0 20px var(--success-color);
  animation: activePortalPulse 1s infinite;
}

@keyframes activePortalPulse {
  0% { 
    opacity: 0.8; 
    transform: scale(1);
    box-shadow: 0 0 20px var(--success-color);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.1);
    box-shadow: 0 0 30px var(--success-color);
  }
  100% { 
    opacity: 0.8; 
    transform: scale(1);
    box-shadow: 0 0 20px var(--success-color);
  }
}

@keyframes glow {
  0% { text-shadow: 0 0 20px var(--accent-color); }
  100% { text-shadow: 0 0 30px var(--accent-color), 0 0 40px var(--accent-color); }
}

@keyframes pulse {
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
}
</style>