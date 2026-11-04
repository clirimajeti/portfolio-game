<template>
  <div
    class="game-project-card"
    :class="{ 'hero-hover': isHeroHovering }"
    :data-status="project.status || 'Completed'"
    ref="cardElement"
  >
    <div class="game-banner">
      <div class="status-badge">
        {{ project.status || 'Completed' }}
      </div>

      <div class="quest-type-badge">
        {{ project.questType || 'Main Quest' }}
      </div>
    </div>

    <!-- Game Info -->
    <div class="game-info">
      <div class="game-header">
        <h3 class="game-title">{{ project.title }}</h3>
        <div class="game-genre">{{ project.category || 'Project' }}</div>
      </div>

      <p class="game-description">{{ project.description }}</p>

      <!-- Tech Stack -->
      <div class="tech-stack">
        <div class="tech-label">Tech stack</div>
        <div class="tech-tags">
          <span v-for="tech in project.tech" :key="tech" class="tech-tag">{{ tech }}</span>
        </div>
      </div>

      <div v-if="project.github || project.demo" class="project-links">
        <a v-if="project.github" :href="project.github" target="_blank" rel="noopener">GitHub</a>
        <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener">Live site</a>
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
  image?: string
  github?: string
  demo?: string
  category?: string
  status?: string
  achievements?: string[]
  questType?: string
}

defineProps<{
  project: Project
}>()

const isHeroHovering = ref(false)
const cardElement = ref<HTMLElement>()

// Function to trigger hero hover effect with throttling
let hoverTimeout: number | null = null
const triggerHeroHover = () => {
  // Prevent rapid successive hovers that could affect game performance
  if (hoverTimeout) return
  
  isHeroHovering.value = true
  hoverTimeout = window.setTimeout(() => {
    isHeroHovering.value = false
    hoverTimeout = null
  }, 250)
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
  cardElement,
})
</script>

<style scoped>
/* Angled panel: ::before is the 1px frame, ::after the fill, both share the cut shape
   so the card itself stays unclipped (focus rings on the links remain visible) */
.game-project-card {
  --cut: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
  --rarity: #8a919c;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease-out;
}

/* Item-rarity edge keyed by project status */
.game-project-card[data-status='Completed'] {
  --rarity: #4fd17a;
}
.game-project-card[data-status='Open Source'] {
  --rarity: #3d9bff;
}
.game-project-card[data-status='Released'] {
  --rarity: #b57aff;
}
.game-project-card[data-status='Live'] {
  --rarity: #ff6b1a;
}
.game-project-card[data-status='Current Build'] {
  --rarity: #f5c542;
}

.game-project-card::before,
.game-project-card::after {
  content: '';
  position: absolute;
  z-index: -1;
  clip-path: var(--cut);
}

.game-project-card::before {
  inset: 0;
  background: var(--m-line, #2a2e36);
  transition: background-color 0.15s ease-out;
}

.game-project-card::after {
  inset: 1px;
  background:
    linear-gradient(90deg, var(--rarity) 0 3px, transparent 3px),
    radial-gradient(120% 55% at 0% 0%, color-mix(in srgb, var(--rarity) 16%, transparent), transparent 65%),
    linear-gradient(180deg, #181b21, #101216);
}

.game-project-card:hover,
.game-project-card.hero-hover {
  transform: translateY(-3px);
  z-index: 10;
}

.game-project-card:hover::before,
.game-project-card.hero-hover::before {
  background: var(--m-accent, #ff6b1a);
}

/* Badge row: quest type label left, rarity status chip right */
.game-banner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 1.5rem 0 1.4rem;
}

.status-badge,
.quest-type-badge {
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  white-space: nowrap;
}

.quest-type-badge {
  order: 1;
  color: var(--m-dim, #8a919c);
}

.status-badge {
  order: 2;
  margin-left: auto;
  padding: 0.3rem 0.55rem 0.3rem 0.75rem;
  color: var(--rarity);
  background: color-mix(in srgb, var(--rarity) 12%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--rarity) 55%, transparent);
}

/* Info */
.game-info {
  padding: 0.8rem 1.5rem 1.25rem 1.4rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.game-header {
  margin-bottom: 0.7rem;
}

.game-title {
  font-family: inherit;
  font-weight: 800;
  font-size: 1.15rem;
  line-height: 1.25;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--m-text, #f2f3f5);
  margin: 0 0 0.3rem;
}

.game-genre {
  color: var(--m-accent, #ff6b1a);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.game-description {
  color: var(--m-muted, #a7adb8);
  line-height: 1.55;
  margin-bottom: 0.9rem;
  font-size: 0.88rem;
}

.tech-stack {
  margin-top: auto;
}

/* Tiny label trailed by a hairline */
.tech-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--m-dim, #8a919c);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  margin-bottom: 0.55rem;
}

.tech-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--m-line, #2a2e36);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tech-tag {
  padding: 0.2rem 0.55rem;
  font-size: 0.74rem;
  letter-spacing: 0.03em;
  color: #d3d7de;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.project-links {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}

/* Corner-cut buttons drawn with a gradient, not clip-path, so the focus ring is not clipped */
.project-links a {
  --btn: var(--m-accent, #ff6b1a);
  padding: 0.6rem 1.1rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  color: #0b0c0f;
  background: linear-gradient(-45deg, transparent 8px, var(--btn) 8px);
  transition: transform 0.15s ease-out;
}

.project-links a + a {
  --btn: rgba(255, 255, 255, 0.1);
  color: var(--m-text, #f2f3f5);
}

.project-links a:hover {
  --btn: var(--m-accent-hi, #ff8c4a);
  color: #0b0c0f;
  transform: translateY(-1px);
}

.project-links a:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}
</style>
