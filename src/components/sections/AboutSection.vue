<template>
  <section class="game-section about-section">
    <Particles />
    <div class="about-content">
      <h2 class="about-title">// About Me</h2>
      <div class="about-grid">
        <div class="about-text" :class="{ 'hero-hover': isHeroHovering }" ref="aboutElement">
          <p>I'm a passionate developer who loves creating interactive experiences and building robust applications. With expertise in both frontend and backend technologies, I enjoy tackling complex challenges and turning ideas into reality.</p>
        </div>
        <div class="stats-grid">
          <StatCard number="50+" label="Projects Completed" />
          <StatCard number="3+" label="Years Experience" />
          <StatCard number="15+" label="Technologies" />
          <StatCard number="100%" label="Coffee Powered" />
        </div>
      </div>
    </div>
    <div class="portal" @click="$emit('next')" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Particles from '../Particles.vue'
import StatCard from '../StatCard.vue'

defineEmits<{
  next: []
}>()

const isHeroHovering = ref(false)
const aboutElement = ref<HTMLElement>()

// Function to trigger hero hover effect
const triggerHeroHover = () => {
  isHeroHovering.value = true
  setTimeout(() => {
    isHeroHovering.value = false
  }, 300)
}

// Listen for custom event to trigger hover
onMounted(() => {
  if (aboutElement.value) {
    aboutElement.value.addEventListener('hero-collision', triggerHeroHover)
  }
})
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

.about-section {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%);
}

.about-content {
  max-width: 1000px;
  padding: 0 20px;
  z-index: 2;
}

.about-title {
  font-size: 3rem;
  color: var(--accent-color);
  text-shadow: 0 0 20px var(--accent-color);
  margin-bottom: 2rem;
  text-align: center;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.about-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text-light);
  background: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 10px;
  border: 2px solid var(--accent-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-text:hover,
.about-text.hero-hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

@keyframes pulse {
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>