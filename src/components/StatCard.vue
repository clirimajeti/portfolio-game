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
.stat-card {
  background: rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid var(--accent-color);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover,
.stat-card.hero-hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px var(--accent-color);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>