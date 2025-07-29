<template>
  <div class="particles">
    <div 
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        animationDelay: `${particle.delay}s`,
        animationDuration: `${particle.duration}s`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
}

const particles = ref<Particle[]>([])

const createParticles = () => {
  const particleCount = 50
  const newParticles: Particle[] = []
  
  for (let i = 0; i < particleCount; i++) {
    newParticles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    })
  }
  
  particles.value = newParticles
}

onMounted(createParticles)
</script>

<style scoped>
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: float infinite linear;
}

@keyframes float {
  0% {
    opacity: 0;
    transform: translateY(100vh) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-10vh) rotate(360deg);
  }
}
</style>