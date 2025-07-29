<template>
  <section class="game-section projects-section">
    <Particles />
    <div class="projects-content">
      <h2 class="projects-title">// My Creations</h2>
      <div class="projects-grid">
        <ProjectCard 
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
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
  max-width: 1200px;
  padding: 0 20px;
  z-index: 2;
  width: 100%;
}

.projects-title {
  font-size: 3rem;
  color: var(--accent-color);
  text-shadow: 0 0 20px var(--accent-color);
  margin-bottom: 3rem;
  text-align: center;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
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
</style>