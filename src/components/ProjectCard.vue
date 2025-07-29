<template>
  <div class="project-card" :class="{ 'hero-hover': isHeroHovering }" ref="cardElement">
    <div class="project-image">
      <img :src="project.image" :alt="project.title" />
      <div class="project-overlay">
        <div class="project-links">
          <a 
            v-if="project.github" 
            :href="project.github" 
            target="_blank"
            class="project-link"
          >
            <i class="fab fa-github" />
          </a>
          <a 
            v-if="project.demo" 
            :href="project.demo" 
            target="_blank"
            class="project-link"
          >
            <i class="fas fa-external-link-alt" />
          </a>
        </div>
      </div>
    </div>
    <div class="project-info">
      <h3 class="project-title">{{ project.title }}</h3>
      <p class="project-description">{{ project.description }}</p>
      <div class="project-tech">
        <span 
          v-for="tech in project.tech"
          :key="tech"
          class="tech-tag"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Project {
  id: number
  title: string
  description: string
  tech: string[]
  image: string
  github?: string
  demo?: string
}

defineProps<{
  project: Project
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
.project-card {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  border: 2px solid var(--accent-color);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover,
.project-card.hero-hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 212, 255, 0.3);
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img,
.project-card.hero-hover .project-image img {
  transform: scale(1.1);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay,
.project-card.hero-hover .project-overlay {
  opacity: 1;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-link {
  width: 50px;
  height: 50px;
  background: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 1.2rem;
  transition: transform 0.3s ease, background 0.3s ease;
}

.project-link:hover {
  transform: scale(1.2);
  background: var(--white);
}

.project-info {
  padding: 1.5rem;
}

.project-title {
  color: var(--accent-color);
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.project-description {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: rgba(0, 212, 255, 0.2);
  color: var(--accent-color);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  border: 1px solid var(--accent-color);
}
</style>