<template>
  <section class="game-section about-section">
    <div class="about-content">
      <h2 class="about-title level-title" data-stage="Stage 2">About me</h2>
      <div class="about-grid">
        <div class="about-text" :class="{ 'hero-hover': isHeroHovering }" ref="aboutElement">
          <p>
            I'm a senior frontend developer from the Munich area, building large web applications
            on enterprise platforms. Lately that means frontend architecture: migrations from Vue 2
            to Vue 3, Vite upgrades, protection against supply chain attacks and performance
            optimization.
          </p>
          <p>
            I have worked for companies and clients in Kosovo, the USA, Switzerland and Germany,
            also as a contractor on small and medium-sized projects, including mobile apps and projects for
            non-profit organizations.
          </p>
          <p>
            Outside of work I love gaming, hiking and creating apps that solve everyday problems.
          </p>
        </div>
        <div class="stats-grid">
          <StatCard number="9" label="Years experience" />
          <StatCard number="50+" label="Projects worked on" />
          <StatCard number="4" label="Countries worked for" />
          <StatCard number="100%" label="Coffee powered" />
        </div>
      </div>
    </div>
    <div class="portal" :class="{ 'portal-active': isPortalActive }" @click="$emit('next')" />
  </section>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'
import StatCard from '../StatCard.vue'

defineEmits<{
  next: []
}>()

const isPortalActive = inject('isPortalActive', ref(false))

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

/* Early 2000s console dashboard: deep blue void, soft light rings, glossy gel panels */
.about-section {
  --y2k-font: 'Trebuchet MS', Verdana, Tahoma, sans-serif;
  --y2k-text: #e4eeff;
  --y2k-muted: #a9c2e8;
  --y2k-cyan: #5fd6ff;
  --y2k-lime: #b4f24a;
  --y2k-edge: rgba(150, 205, 255, 0.55);
  --y2k-panel:
    linear-gradient(180deg, rgba(120, 180, 255, 0.2) 0%, rgba(120, 180, 255, 0) 38%),
    linear-gradient(180deg, #123a7a 0%, #0b2659 55%, #071a40 100%);
  --y2k-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -12px 24px rgba(0, 8, 30, 0.45),
    0 0 0 1px rgba(0, 10, 35, 0.9),
    0 10px 28px rgba(0, 0, 0, 0.55),
    0 0 22px rgba(70, 170, 255, 0.22);
  --y2k-shadow-hover:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 -12px 24px rgba(0, 8, 30, 0.45),
    0 0 0 1px rgba(0, 10, 35, 0.9),
    0 12px 32px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(95, 214, 255, 0.45);

  overflow: hidden;
  font-family: var(--y2k-font);
  background:
    radial-gradient(ellipse 55% 40% at 50% 38%, rgba(95, 200, 255, 0.22), transparent 70%),
    conic-gradient(
      from 200deg at 50% -10%,
      transparent 0deg,
      rgba(140, 210, 255, 0.07) 8deg,
      transparent 18deg,
      transparent 34deg,
      rgba(140, 210, 255, 0.05) 42deg,
      transparent 52deg,
      transparent 360deg
    ),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000' preserveAspectRatio='xMidYMid slice'%3E%3Cg fill='none' stroke='%2380c8ff'%3E%3Cellipse cx='800' cy='1180' rx='1100' ry='520' stroke-opacity='.10' stroke-width='2'/%3E%3Cellipse cx='800' cy='1180' rx='900' ry='420' stroke-opacity='.08' stroke-width='1.5'/%3E%3Cellipse cx='800' cy='1180' rx='700' ry='320' stroke-opacity='.06'/%3E%3C/g%3E%3C/svg%3E")
      center / cover no-repeat,
    radial-gradient(ellipse 120% 90% at 50% 110%, #0d3a7a 0%, transparent 60%),
    radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.6) 100%),
    linear-gradient(180deg, #03112c 0%, #061d47 55%, #04153a 100%);
}

.about-content {
  max-width: 1000px;
  padding: 0 20px;
  z-index: 2;
}

/* Chrome title with a gel "Stage 2" badge, overriding the global pixel heading */
.about-title {
  margin-bottom: 2.25rem;
  font-family: var(--y2k-font);
  font-size: clamp(1.9rem, 4.6vw, 3rem);
  font-weight: 700;
  font-style: italic;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.1;
  color: #dfe9f7;
  background: linear-gradient(180deg, #ffffff 0%, #f0f5ff 46%, #a3b8d8 52%, #f2f7ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 2px 0 #021030) drop-shadow(0 0 14px rgba(95, 214, 255, 0.45));
}

.about-title::before {
  display: table;
  margin: 0 auto 0.9rem;
  padding: 0.3rem 0.9rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #06230a;
  -webkit-text-fill-color: #06230a;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 51%),
    linear-gradient(180deg, #c8ff6a 0%, #8ad62a 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 0 0 1px #2d5a0a,
    0 0 12px rgba(180, 242, 74, 0.5);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.about-text {
  position: relative;
  overflow: hidden;
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--y2k-text);
  background: var(--y2k-panel);
  border: 1px solid var(--y2k-edge);
  border-radius: 14px;
  box-shadow: var(--y2k-shadow);
  padding: 1.75rem 1.9rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* Glass sheen across the top of the panel */
.about-text::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 48px;
  border-radius: 14px 14px 50% 50% / 14px 14px 18px 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.about-text p {
  position: relative;
}

.about-text p + p {
  margin-top: 1rem;
}

.about-text:hover,
.about-text.hero-hover {
  transform: translateY(-2px);
  box-shadow: var(--y2k-shadow-hover);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

/* Portal: chrome bezel around a gel orb. Geometry is inherited from the global .portal. */
.portal {
  border-radius: 18px;
  background:
    radial-gradient(circle at 50% 50%, #1a2c4a 0 22px, transparent 23px),
    linear-gradient(160deg, #f2f6fc 0%, #9fb0c8 40%, #5b6b86 60%, #c6d3e6 100%);
  box-shadow:
    inset 0 1px 0 #ffffff,
    inset 0 -2px 4px rgba(0, 0, 0, 0.4),
    0 0 0 1px #01081c,
    0 8px 18px rgba(0, 0, 0, 0.6);
  image-rendering: auto;
}

.portal::before {
  inset: 22px;
  border-radius: 50%;
  background:
    radial-gradient(ellipse 60% 40% at 50% 22%, rgba(255, 255, 255, 0.55), transparent 70%),
    radial-gradient(circle at 50% 65%, #50627e 0%, #23324c 70%, #121c30 100%);
  box-shadow: inset 0 -3px 6px rgba(0, 0, 0, 0.5);
}

.portal::after {
  font-family: var(--y2k-font);
  font-size: 0.8rem;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 0.2em;
  color: var(--y2k-muted);
}

.portal.portal-active {
  background:
    radial-gradient(circle at 50% 50%, #0c2a06 0 22px, transparent 23px),
    linear-gradient(160deg, #f2f6fc 0%, #9fb0c8 40%, #5b6b86 60%, #c6d3e6 100%);
  box-shadow:
    inset 0 1px 0 #ffffff,
    inset 0 -2px 4px rgba(0, 0, 0, 0.4),
    0 0 0 1px #01081c,
    0 8px 18px rgba(0, 0, 0, 0.6),
    0 0 26px rgba(180, 242, 74, 0.65);
}

.portal.portal-active::before {
  inset: 20px;
  background:
    radial-gradient(ellipse 60% 40% at 50% 22%, rgba(255, 255, 255, 0.75), transparent 70%),
    radial-gradient(circle at 50% 65%, #e4ff9a 0%, #9be22d 45%, #3f8a10 100%);
  box-shadow:
    inset 0 -3px 6px rgba(20, 60, 0, 0.5),
    0 0 18px rgba(180, 242, 74, 0.9);
}

.portal.portal-active::after {
  color: var(--y2k-lime);
  text-shadow: 0 0 10px rgba(180, 242, 74, 0.6);
}

@media (max-width: 768px) {
  .about-content {
    align-self: stretch;
    overflow-y: auto;
    padding: 110px 20px 150px;
  }

  /* Gel scrollbar: rounded chrome-blue thumb in a dark recessed track */
  .about-content::-webkit-scrollbar {
    width: 12px;
  }

  .about-content::-webkit-scrollbar-track {
    background: #031030;
    border: 0;
    border-radius: 6px;
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.8);
  }

  .about-content::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #bfe6ff 0%, #4aa8ec 50%, #1d5fae 100%);
    border: 2px solid #031030;
    border-radius: 6px;
    box-shadow: none;
  }

  .about-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, #e2f6ff 0%, #6cc4ff 50%, #2a75c8 100%);
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-text {
    padding: 1.25rem 1.3rem;
    font-size: 0.95rem;
  }
}
</style>
