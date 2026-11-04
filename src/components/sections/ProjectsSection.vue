<template>
  <section class="game-section projects-section">
    <div class="projects-content">
      <h2 class="projects-title level-title" data-stage="Stage 4">Projects</h2>
      <div class="projects-grid">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
    <div class="portal" :class="{ 'portal-active': isPortalActive }" @click="$emit('next')" />
  </section>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import ProjectCard from '../ProjectCard.vue'
import { PROJECTS_DATA } from '../../constants'

defineEmits<{
  next: []
}>()

const isPortalActive = inject('isPortalActive', ref(false))
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

/* Current-gen menu: graphite, faint hex lattice, one soft beam of accent light */
.projects-section {
  --m-font: system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --m-bg: #0b0c0f;
  --m-line: #2a2e36;
  --m-text: #f2f3f5;
  --m-muted: #a7adb8;
  --m-dim: #8a919c;
  --m-accent: #ff6b1a;
  --m-accent-hi: #ff8c4a;
  overflow: hidden;
  font-family: var(--m-font);
  background:
    radial-gradient(ellipse 55% 45% at 78% 0%, rgba(255, 107, 26, 0.14), transparent 70%),
    linear-gradient(112deg, transparent 38%, rgba(255, 255, 255, 0.025) 46%, transparent 56%),
    radial-gradient(ellipse 90% 80% at 50% 45%, transparent 40%, rgba(0, 0, 0, 0.8) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='69.28' height='120'%3E%3Cpath d='M0 20L34.64 0L69.28 20M0 20V60M69.28 20V60M0 60L34.64 80L69.28 60M34.64 80V120' fill='none' stroke='%23fff' stroke-opacity='.06'/%3E%3C/svg%3E")
      0 0 / 69.28px 120px,
    linear-gradient(180deg, #121419 0%, var(--m-bg) 70%);
}

.projects-content {
  max-width: 1400px;
  /* Bottom padding keeps the cards above the character and EXIT portal lane */
  padding: 10vh 20px 150px;
  z-index: 2;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.projects-title {
  margin: 0 0 1.4rem;
  flex-shrink: 0;
  font-family: var(--m-font);
  font-weight: 800;
  font-size: clamp(1.6rem, 3.4vw, 2.4rem);
  line-height: 1.1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--m-text);
  text-shadow: none;
}

/* Kicker: tiny accent label between two hairlines */
.projects-title::before {
  width: fit-content;
  margin: 0 auto 0.7rem;
  padding: 0 34px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.35em;
  color: var(--m-accent);
  background:
    linear-gradient(var(--m-accent), var(--m-accent)) left center / 22px 1px no-repeat,
    linear-gradient(var(--m-accent), var(--m-accent)) right center / 22px 1px no-repeat;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: max-content;
  gap: 1.5rem;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* Fade the bottom edge so the next row reads as "scroll for more"; the scrollbar
     column (last 10px) stays fully opaque */
  mask-image:
    linear-gradient(to bottom, #000 calc(100% - 48px), transparent),
    linear-gradient(#000, #000);
  mask-size:
    calc(100% - 10px) 100%,
    10px 100%;
  mask-position:
    left top,
    right top;
  mask-repeat: no-repeat;
  overflow-x: hidden;
  /* Room for the hover lift so it is not clipped */
  padding: 12px 20px 24px 12px;
}

/* HUD scrollbar: thin accent thumb on a dark rail (Chrome ignores these if
   scrollbar-color/scrollbar-width are set here, so they are not) */
.projects-grid::-webkit-scrollbar {
  width: 10px;
}

.projects-grid::-webkit-scrollbar-track {
  background: #0d0f12;
  border: 0;
  box-shadow: inset 1px 0 0 var(--m-line);
}

.projects-grid::-webkit-scrollbar-thumb {
  background: var(--m-accent);
  border: 3px solid #0d0f12;
  border-left-width: 4px;
  box-shadow: none;
}

.projects-grid::-webkit-scrollbar-thumb:hover {
  background: var(--m-accent-hi);
}

/* Exit gate: HUD corner brackets around a hex core; dim when locked, lit when open */
.portal {
  --pc: #5b616c;
  background:
    linear-gradient(var(--pc), var(--pc)) left top / 16px 2px no-repeat,
    linear-gradient(var(--pc), var(--pc)) left top / 2px 16px no-repeat,
    linear-gradient(var(--pc), var(--pc)) right top / 16px 2px no-repeat,
    linear-gradient(var(--pc), var(--pc)) right top / 2px 16px no-repeat,
    linear-gradient(var(--pc), var(--pc)) left bottom / 16px 2px no-repeat,
    linear-gradient(var(--pc), var(--pc)) left bottom / 2px 16px no-repeat,
    linear-gradient(var(--pc), var(--pc)) right bottom / 16px 2px no-repeat,
    linear-gradient(var(--pc), var(--pc)) right bottom / 2px 16px no-repeat,
    rgba(11, 12, 15, 0.6);
  box-shadow: none;
  image-rendering: auto;
}

.portal::before {
  inset: 16px;
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  background:
    radial-gradient(circle, #4a505a 0 4px, transparent 5px),
    linear-gradient(180deg, #2a2e36, #1a1d23);
}

.portal::after {
  bottom: calc(100% + 10px);
  font-family: var(--m-font);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  padding-left: 0.3em;
  color: var(--m-dim);
}

.portal-active {
  --pc: var(--m-accent);
  background-color: rgba(255, 107, 26, 0.12);
  box-shadow: 0 0 28px rgba(255, 107, 26, 0.35);
}

.portal-active::before {
  inset: 16px;
  background:
    radial-gradient(circle, #fff 0 5px, transparent 6px),
    radial-gradient(circle, rgba(255, 255, 255, 0.45), transparent 70%),
    var(--m-accent);
}

.portal-active::after {
  color: var(--m-accent);
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .projects-content {
    padding: 110px 12px 0;
  }

  .projects-grid {
    gap: 1.25rem;
    padding: 12px 14px 140px 8px;
    mask-image: none;
  }
}
</style>
