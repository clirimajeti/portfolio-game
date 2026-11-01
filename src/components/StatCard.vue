<template>
  <div class="stat-card" :class="{ 'hero-hover': isHeroHovering }" ref="cardElement">
    <div class="stat-number">{{ number }}</div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{
  number: string
  label: string
}>()

const isHeroHovering = ref(false)
const cardElement = ref<HTMLElement>()

// Function to trigger hero hover effect
const triggerHeroHover = () => {
  isHeroHovering.value = true
  setTimeout(() => {
    isHeroHovering.value = false
  }, 300)
}

// Listen for custom event to trigger hover
onMounted(() => {
  if (cardElement.value) {
    cardElement.value.addEventListener('hero-collision', triggerHeroHover)
  }
})

// Expose the trigger function for parent components
defineExpose({
  triggerHeroHover,
  cardElement
})
</script>

<style scoped>
/* Gel button tile: top-half gloss, chrome number, soft blue glow (tokens from AboutSection) */
.stat-card {
  position: relative;
  overflow: hidden;
  padding: 1.2rem 0.75rem 1.1rem;
  text-align: center;
  border: 1px solid var(--y2k-edge, rgba(150, 205, 255, 0.55));
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(150, 205, 255, 0.28) 0%, rgba(150, 205, 255, 0.08) 49%, transparent 50%),
    linear-gradient(180deg, #1a4a92 0%, #0d2b63 60%, #081f4c 100%);
  box-shadow: var(--y2k-shadow, 0 8px 20px rgba(0, 0, 0, 0.5));
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* Hover sheen: a diagonal light streak that slides across once */
.stat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.18) 50%, transparent 65%);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
  pointer-events: none;
}

.stat-card:hover,
.stat-card.hero-hover {
  transform: translateY(-2px);
  box-shadow: var(--y2k-shadow-hover, 0 10px 26px rgba(0, 0, 0, 0.6));
}

.stat-card:hover::after,
.stat-card.hero-hover::after {
  transform: translateX(100%);
}

.stat-number {
  font-family: var(--y2k-font, 'Trebuchet MS', Verdana, Tahoma, sans-serif);
  font-size: 2rem;
  font-weight: 700;
  font-style: italic;
  line-height: 1.15;
  letter-spacing: 0.02em;
  color: var(--y2k-cyan, #5fd6ff);
  text-shadow:
    0 1px 0 #021030,
    0 0 12px rgba(95, 214, 255, 0.55);
  margin-bottom: 0.35rem;
}

.stat-label {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--y2k-muted, #a9c2e8);
}
</style>
