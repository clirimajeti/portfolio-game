<template>
  <section class="game-section projects-section">
    <Particles />
    <div class="projects-content">
      <h2 class="projects-title">// Game Portfolio</h2>
      <div class="projects-grid">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
    <div class="portal" @click="$emit('next')" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Particles from '../Particles.vue'
import ProjectCard from '../ProjectCard.vue'
import { PROJECTS_DATA } from '../../constants'

defineEmits<{
  next: []
}>()

const projects = ref(PROJECTS_DATA)
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

.projects-section {
  background: linear-gradient(135deg, #1a202c 0%, #4a5568 50%, #2d3748 100%);
}

.projects-content {
  max-width: 1400px;
  padding: 20px;
  z-index: 2;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10vh;
}

.projects-title {
  font-size: 2.5rem;
  color: var(--accent-color);
  text-shadow: 0 0 20px var(--accent-color);
  margin: 0 0 1.5rem 0;
  text-align: center;
  flex-shrink: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 0 auto;
  max-height: 65vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 30px 10px 20px 10px;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) rgba(255, 255, 255, 0.1);
}

.projects-grid::-webkit-scrollbar {
  width: 8px;
}

.projects-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.projects-grid::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

.projects-grid::-webkit-scrollbar-thumb:hover {
  background: #ffd700;
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
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .projects-title {
    font-size: 2rem;
    margin: 1.5rem 0 1rem 0;
  }
}

@media (max-width: 768px) {
  .projects-content {
    padding: 15px;
  }

  .projects-title {
    font-size: 1.8rem;
    margin: 1rem 0;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 5px 80px 5px;
  }
}

@media (max-width: 480px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .projects-title {
    font-size: 1.5rem;
  }
}
</style>
