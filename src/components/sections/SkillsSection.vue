<template>
  <section class="game-section skills-section">
    <Particles />
    <div class="skills-content">
      <h2 class="skills-title">// My Arsenal</h2>
      <div class="skills-grid">
        <SkillCategory 
          title="Frontend" 
          :skills="frontendSkills"
          icon="fas fa-laptop-code"
        />
        <SkillCategory 
          title="Backend" 
          :skills="backendSkills"
          icon="fas fa-server"
        />
        <SkillCategory 
          title="Database" 
          :skills="databaseSkills"
          icon="fas fa-database"
        />
        <SkillCategory 
          title="Tools & Other" 
          :skills="toolsSkills"
          icon="fas fa-tools"
        />
      </div>
    </div>
    <div class="portal" @click="$emit('next')" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Particles from '../Particles.vue'
import SkillCategory from '../SkillCategory.vue'
import { SKILLS_DATA } from '../../constants'

defineEmits<{
  next: []
}>()

const frontendSkills = ref(SKILLS_DATA.frontend)
const backendSkills = ref(SKILLS_DATA.backend)
const databaseSkills = ref(SKILLS_DATA.database)
const toolsSkills = ref(SKILLS_DATA.tools)
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

.skills-section {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%);
}

.skills-content {
  max-width: 1200px;
  padding: 0 20px;
  z-index: 2;
  width: 100%;
}

.skills-title {
  font-size: 3rem;
  color: var(--accent-color);
  text-shadow: 0 0 20px var(--accent-color);
  margin-bottom: 3rem;
  text-align: center;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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