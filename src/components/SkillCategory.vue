<template>
  <div class="skill-category" :class="{ 'hero-hover': isHeroHovering }" ref="cardElement">
    <div class="category-header">
      <i :class="icon" />
      <h3>{{ title }}</h3>
    </div>
    <div class="skills-list">
      <div 
        v-for="skill in skills" 
        :key="skill.name"
        class="skill-item"
      >
        <div class="skill-info">
          <span class="skill-name">{{ skill.name }}</span>
          <span class="skill-percentage">{{ skill.level }}%</span>
        </div>
        <div class="skill-bar">
          <div 
            class="skill-progress"
            :style="{ width: `${skill.level}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Skill {
  name: string
  level: number
}

defineProps<{
  title: string
  skills: Skill[]
  icon: string
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
.skill-category {
  background: rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid var(--accent-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.skill-category:hover,
.skill-category.hero-hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--accent-color);
}

.category-header i {
  font-size: 1.5rem;
}

.category-header h3 {
  font-size: 1.3rem;
  margin: 0;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  color: var(--white);
  font-weight: 500;
}

.skill-percentage {
  color: var(--accent-color);
  font-size: 0.9rem;
}

.skill-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), var(--success-color));
  border-radius: 4px;
  transition: width 1s ease-in-out;
}
</style>