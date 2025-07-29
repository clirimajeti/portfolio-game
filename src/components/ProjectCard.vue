<template>
  <div class="game-project-card" :class="{ 'hero-hover': isHeroHovering }" ref="cardElement">
    <!-- Game Screenshot/Banner -->
    <div class="game-banner">
      <!-- Status Badge -->
      <div
        class="status-badge"
        :class="`status-${project.status?.toLowerCase().replace(' ', '-')}`"
      >
        {{ project.status || 'Mission Complete' }}
      </div>

      <!-- Difficulty Badge -->
      <div class="difficulty-badge" :class="getDifficultyClass(project.difficulty)">
        {{ project.difficulty || 'Intermediate Level' }}
      </div>

      <!-- Quest Type Badge -->
      <div class="quest-type-badge">
        {{ project.questType || 'Main Quest' }}
      </div>
    </div>

    <!-- Game Info -->
    <div class="game-info">
      <div class="game-header">
        <h3 class="game-title">{{ project.title }}</h3>
        <div class="game-genre">{{ project.category || 'Indie Game' }}</div>
      </div>

      <p class="game-description">{{ project.description }}</p>

      <!-- Tech Stack -->
      <div class="tech-stack">
        <div class="tech-label">⚡ Power-ups Used:</div>
        <div class="tech-tags">
          <span
            v-for="tech in project.tech"
            :key="tech"
            class="tech-tag"
            :class="getTechClass(tech)"
          >
            {{ tech }}
          </span>
        </div>
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
  category?: string
  status?: string
  achievements?: string[]
  difficulty?: string
  questType?: string
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

// Function to get tech-specific styling
const getTechClass = (tech: string) => {
  const techMap: Record<string, string> = {
    Unity: 'tech-unity',
    'Unreal Engine': 'tech-unreal',
    Godot: 'tech-godot',
    'Vue.js': 'tech-vue',
    React: 'tech-react',
    TypeScript: 'tech-typescript',
    'C#': 'tech-csharp',
    'C++': 'tech-cpp',
    GDScript: 'tech-gdscript',
    'Three.js': 'tech-threejs',
    WebSocket: 'tech-websocket',
    Firebase: 'tech-firebase',
    MySQL: 'tech-mysql',
    PostgreSQL: 'tech-postgresql',
    MongoDB: 'tech-mongodb',
    Express: 'tech-express',
    'Node.js': 'tech-nodejs',
    'Socket.io': 'tech-socketio',
    'Stripe API': 'tech-stripe',
    'OpenWeather API': 'tech-openweather',
    Mapbox: 'tech-mapbox',
    'CSS Animations': 'tech-css',
    Pinia: 'tech-pinia',
    Redis: 'tech-redis',
  }
  return techMap[tech] || 'tech-default'
}

// Function to get difficulty-specific styling
const getDifficultyClass = (difficulty?: string) => {
  const difficultyMap: Record<string, string> = {
    'Beginner Level': 'difficulty-beginner',
    'Intermediate Level': 'difficulty-intermediate',
    'Advanced Level': 'difficulty-advanced',
    'Expert Level': 'difficulty-expert',
    'Legendary Level': 'difficulty-legendary',
  }
  return difficultyMap[difficulty || 'Intermediate Level'] || 'difficulty-intermediate'
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
/* Gaming-themed Project Card */
.game-project-card {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%);
  border-radius: 12px;
  border: 2px solid #d4af37;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  position: relative;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(5px);
}

.game-project-card:hover,
.game-project-card.hero-hover {
  transform: translateY(-5px) scale(1.005);
  box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4);
  border-color: #ffd700;
  z-index: 10;
  background: linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(25, 25, 25, 1) 100%);
}

/* Game Banner */
.game-banner {
  position: relative;
  height: 70px;
  overflow: hidden;
  background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
  flex-shrink: 0;
}

.game-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  filter: brightness(0.8);
}

.game-project-card:hover .game-banner img,
.game-project-card.hero-hover .game-banner img {
  transform: scale(1.1);
  filter: brightness(1);
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 20, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.game-project-card:hover .game-overlay,
.game-project-card.hero-hover .game-overlay {
  opacity: 1;
}

.game-actions {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
}

.play-button,
.code-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.launch-button {
  background: linear-gradient(45deg, #ff6b35, #ff8c42);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

.launch-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
}

.code-button {
  background: linear-gradient(45deg, #4a90e2, #357abd);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
}

.code-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.6);
}

.launch-icon,
.code-icon {
  font-size: 1.1rem;
}

/* Status, Difficulty, and Quest Type Badges */
.status-badge,
.difficulty-badge,
.quest-type-badge {
  position: absolute;
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 0.55rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  backdrop-filter: blur(10px);
  border: 1px solid;
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  top: 15px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-color: #d4af37;
  color: #d4af37;
}

.status-mission-complete {
  background: rgba(76, 175, 80, 0.9);
  border-color: #4caf50;
  color: white;
}

.status-active-campaign {
  background: rgba(255, 193, 7, 0.9);
  border-color: #ffc107;
  color: #333;
}

.status-current-build {
  background: rgba(156, 39, 176, 0.9);
  border-color: #9c27b0;
  color: white;
}

.difficulty-badge {
  top: 45px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
}

.difficulty-beginner {
  border-color: #4caf50;
  color: #4caf50;
}

.difficulty-intermediate {
  border-color: #2196f3;
  color: #2196f3;
}

.difficulty-advanced {
  border-color: #ff9800;
  color: #ff9800;
}

.difficulty-expert {
  border-color: #f44336;
  color: #f44336;
}

.difficulty-legendary {
  border-color: #9c27b0;
  color: #9c27b0;
  background: linear-gradient(45deg, rgba(156, 39, 176, 0.2), rgba(233, 30, 99, 0.2));
}

.quest-type-badge {
  top: 15px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-color: #61dafb;
  color: #61dafb;
}

/* Game Info */
.game-info {
  padding: 0.8rem;
  background: linear-gradient(180deg, rgba(40, 40, 40, 0.3) 0%, rgba(20, 20, 20, 0.5) 100%);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.game-header {
  margin-bottom: 0.6rem;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
  padding-bottom: 0.6rem;
}

.game-title {
  color: #d4af37;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 0.4rem 0;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.game-genre {
  color: #61dafb;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.game-description {
  color: #ccc;
  line-height: 1.3;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
}

/* Tech Stack */
.tech-stack {
  margin-bottom: 0.6rem;
}

.tech-label {
  color: #d4af37;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 2px solid;
  transition: all 0.3s ease;
}

.tech-tag:hover {
  transform: scale(1.05);
}

/* Tech-specific colors */
.tech-unity {
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  border-color: #ffffff;
}
.tech-unreal {
  background: rgba(0, 0, 0, 0.8);
  color: #0e1128;
  border-color: #0e1128;
}
.tech-godot {
  background: rgba(71, 140, 224, 0.2);
  color: #478ce0;
  border-color: #478ce0;
}
.tech-vue {
  background: rgba(79, 192, 141, 0.2);
  color: #4fc08d;
  border-color: #4fc08d;
}
.tech-react {
  background: rgba(97, 218, 251, 0.2);
  color: #61dafb;
  border-color: #61dafb;
}
.tech-typescript {
  background: rgba(49, 120, 198, 0.2);
  color: #3178c6;
  border-color: #3178c6;
}
.tech-csharp {
  background: rgba(152, 104, 191, 0.2);
  color: #9865bf;
  border-color: #9865bf;
}
.tech-cpp {
  background: rgba(0, 89, 156, 0.2);
  color: #00599c;
  border-color: #00599c;
}
.tech-threejs {
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  border-color: #ffffff;
}
.tech-firebase {
  background: rgba(255, 203, 5, 0.2);
  color: #ffcb05;
  border-color: #ffcb05;
}
.tech-default {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  border-color: #d4af37;
}

/* Responsive */
@media (max-width: 768px) {
  .game-info {
    padding: 0.8rem;
  }

  .game-title {
    font-size: 1rem;
  }

  .game-actions {
    flex-direction: row;
    gap: 0.6rem;
  }

  .launch-button,
  .code-button {
    padding: 6px 12px;
    font-size: 0.7rem;
  }

  .tech-label {
    font-size: 0.7rem;
  }

  .tech-tag {
    padding: 3px 6px;
    font-size: 0.65rem;
  }
}
</style>
