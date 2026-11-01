<template>
  <section class="game-section intro-section">
    <div class="intro-content">
      <p class="intro-eyebrow">Player 1 - Hi, I'm</p>
      <h1 class="intro-title">{{ PORTFOLIO_DATA.name }}</h1>
      <p class="intro-subtitle">{{ PORTFOLIO_DATA.title }}</p>
      <p class="intro-tagline">{{ PORTFOLIO_DATA.tagline }}</p>
      <div class="game-instructions" :class="{ 'hero-hover': isHeroHovering }" ref="instructionsElement">
        <p>This portfolio is a small game.</p>
        <p>Move with the arrow keys and press Space to throw coffee.</p>
        <p>Squash every bug to open the portal to the next level.</p>
        <span class="dialog-cursor" aria-hidden="true" />
      </div>
    </div>
    <div class="portal" :class="{ 'portal-active': isPortalActive }" />
  </section>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'
import { PORTFOLIO_DATA } from '../../constants'

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
}

.intro-content {
  text-align: center;
  z-index: 2;
  max-width: 760px;
  padding: 0 20px;
}

.intro-eyebrow {
  color: var(--cyan);
  font-family: var(--font-pixel);
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}

.intro-title {
  font-size: clamp(1.6rem, 6vw, 3.5rem);
  color: var(--yellow);
  text-shadow:
    4px 4px 0 var(--magenta),
    8px 8px 0 var(--ink);
  margin-bottom: 1.5rem;
}

.intro-subtitle {
  font-family: var(--font-pixel);
  font-size: clamp(0.8rem, 2.2vw, 1.1rem);
  color: var(--text);
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.intro-tagline {
  font-size: 1.05rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
}

/* RPG dialog box */
.game-instructions {
  position: relative;
  background: var(--surface);
  box-shadow: var(--panel-shadow);
  padding: 1.25rem 1.5rem 1.5rem;
  text-align: left;
  transition:
    transform 0.12s steps(2),
    box-shadow 0.12s steps(2);
}

.game-instructions:hover,
.game-instructions.hero-hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--panel-shadow-hover);
}

.game-instructions p {
  color: var(--text-muted);
}

.game-instructions p + p {
  margin-top: 0.4rem;
}

.game-instructions p:first-child {
  font-family: var(--font-pixel);
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--yellow);
  margin-bottom: 0.9rem;
}

/* The one blinking element: classic "more text" arrow */
.dialog-cursor {
  position: absolute;
  right: 14px;
  bottom: 10px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid var(--yellow);
  animation: blink 1.2s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dialog-cursor {
    animation: none;
  }
}
</style>
