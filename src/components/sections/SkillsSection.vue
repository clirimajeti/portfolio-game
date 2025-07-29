<template>
  <section class="game-section skills-section">
    <Particles />
    <div class="skills-content">
      <h2 class="skills-title">// Developer Talent Trees</h2>

      <div class="wow-talent-trees" :class="{ 'trees-visible': skillTreeVisible }">
        <!-- Frontend Tree -->
        <div class="talent-tree frontend-tree">
          <div class="tree-header">
            <div class="tree-icon">{{ skillTrees.frontend.icon }}</div>
            <h3 class="tree-title">{{ skillTrees.frontend.name }}</h3>
          </div>

          <div class="talent-grid frontend-connections">
            <div
              v-for="(tier, tierIndex) in skillTrees.frontend.tiers"
              :key="`frontend-tier-${tierIndex}`"
              class="talent-tier"
              :style="{ '--tier': tierIndex }"
            >
              <div
                v-for="skill in tier"
                :key="skill.id"
                class="talent-slot"
                :style="{ '--position': skill.position }"
              >
                <div
                  class="talent-node"
                  :class="{
                    unlocked: skill.unlocked,
                    locked: !skill.unlocked,
                    maxed: skill.currentRank === skill.maxRank,
                    selected: selectedSkill?.id === skill.id,
                  }"
                  @click="selectSkill(skill)"
                >
                  <div class="talent-icon">
                    <img v-if="skill.icon.includes('.svg')" :src="skill.icon" :alt="skill.name" />
                    <span v-else>{{ skill.icon }}</span>
                  </div>
                  <div class="talent-ranks">{{ skill.currentRank }}/{{ skill.maxRank }}</div>
                </div>

                <!-- Individual connection line for this skill -->
                <div
                  v-if="skill.prerequisites.length > 0"
                  class="skill-connection-line frontend-line"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Backend Tree -->
        <div class="talent-tree backend-tree">
          <div class="tree-header">
            <div class="tree-icon">{{ skillTrees.backend.icon }}</div>
            <h3 class="tree-title">{{ skillTrees.backend.name }}</h3>
          </div>

          <div class="talent-grid backend-connections">
            <div
              v-for="(tier, tierIndex) in skillTrees.backend.tiers"
              :key="`backend-tier-${tierIndex}`"
              class="talent-tier"
              :style="{ '--tier': tierIndex }"
            >
              <div
                v-for="skill in tier"
                :key="skill.id"
                class="talent-slot"
                :style="{ '--position': skill.position }"
              >
                <div
                  class="talent-node"
                  :class="{
                    unlocked: skill.unlocked,
                    locked: !skill.unlocked,
                    maxed: skill.currentRank === skill.maxRank,
                    selected: selectedSkill?.id === skill.id,
                  }"
                  @click="selectSkill(skill)"
                >
                  <div class="talent-icon">
                    <img v-if="skill.icon.includes('.svg')" :src="skill.icon" :alt="skill.name" />
                    <span v-else>{{ skill.icon }}</span>
                  </div>
                  <div class="talent-ranks">{{ skill.currentRank }}/{{ skill.maxRank }}</div>
                </div>

                <!-- Individual connection line for this skill -->
                <div
                  v-if="skill.prerequisites.length > 0"
                  class="skill-connection-line backend-line"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tools Tree -->
        <div class="talent-tree tools-tree">
          <div class="tree-header">
            <div class="tree-icon">{{ skillTrees.tools.icon }}</div>
            <h3 class="tree-title">{{ skillTrees.tools.name }}</h3>
          </div>

          <div class="talent-grid tools-connections">
            <div
              v-for="(tier, tierIndex) in skillTrees.tools.tiers"
              :key="`tools-tier-${tierIndex}`"
              class="talent-tier"
              :style="{ '--tier': tierIndex }"
            >
              <div
                v-for="skill in tier"
                :key="skill.id"
                class="talent-slot"
                :style="{ '--position': skill.position }"
              >
                <div
                  class="talent-node"
                  :class="{
                    unlocked: skill.unlocked,
                    locked: !skill.unlocked,
                    maxed: skill.currentRank === skill.maxRank,
                    selected: selectedSkill?.id === skill.id,
                  }"
                  @click="selectSkill(skill)"
                >
                  <div class="talent-icon">{{ skill.icon }}</div>
                  <div class="talent-ranks">{{ skill.currentRank }}/{{ skill.maxRank }}</div>
                </div>

                <!-- Individual connection line for this skill -->
                <div
                  v-if="skill.prerequisites.length > 0"
                  class="skill-connection-line tools-line"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Skill Information Panel -->
      <div
        v-if="selectedSkill"
        class="skill-info-panel"
        :class="{ 'panel-visible': selectedSkill }"
      >
        <div class="skill-info-content">
          <div class="skill-info-header">
            <div class="skill-info-icon">
              <img
                v-if="selectedSkill.icon.includes('.svg')"
                :src="selectedSkill.icon"
                :alt="selectedSkill.name"
              />
              <span v-else>{{ selectedSkill.icon }}</span>
            </div>
            <div class="skill-info-title-section">
              <h3 class="skill-info-title">{{ selectedSkill.name }}</h3>
              <div class="skill-info-rank">
                Rank {{ selectedSkill.currentRank }}/{{ selectedSkill.maxRank }}
              </div>
            </div>
            <button class="close-panel-btn" @click="selectedSkill = null">×</button>
          </div>

          <div class="skill-info-body">
            <div class="skill-info-section">
              <h4 class="section-label">Description:</h4>
              <p class="skill-description">{{ selectedSkill.description }}</p>
            </div>

            <div v-if="selectedSkill.prerequisites.length > 0" class="skill-info-section">
              <h4 class="section-label">Prerequisites:</h4>
              <div class="prerequisites-list">
                <span
                  v-for="(prereq, index) in selectedSkill.prerequisites"
                  :key="prereq"
                  class="prerequisite-item"
                >
                  {{ prereq }}{{ index < selectedSkill.prerequisites.length - 1 ? ', ' : '' }}
                </span>
              </div>
            </div>

            <div class="skill-info-section">
              <h4 class="section-label">Status:</h4>
              <div class="skill-status">
                <span
                  class="status-badge"
                  :class="{
                    'status-unlocked': selectedSkill.unlocked,
                    'status-locked': !selectedSkill.unlocked,
                    'status-maxed': selectedSkill.currentRank === selectedSkill.maxRank,
                  }"
                >
                  {{
                    selectedSkill.unlocked
                      ? selectedSkill.currentRank === selectedSkill.maxRank
                        ? 'Mastered'
                        : 'Unlocked'
                      : 'Locked'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="portal" @click="$emit('next')" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Particles from '../Particles.vue'
import { WOW_SKILL_TREES } from '../../constants'

defineEmits<{
  next: []
}>()

const skillTrees = ref(WOW_SKILL_TREES)
const skillTreeVisible = ref(false)
const selectedSkill = ref(null as any)

const selectSkill = (skill: any) => {
  selectedSkill.value = skill
}

onMounted(() => {
  setTimeout(() => {
    skillTreeVisible.value = true
  }, 500)
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

.skills-section {
  background: linear-gradient(135deg, #2d1810 0%, #1a1a1a 50%, #0f0f0f 100%);
  overflow: hidden;
}

.skills-content {
  max-width: 1600px;
  height: 100vh;
  padding: 20px;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skills-title {
  font-size: 3rem;
  color: #d4af37;
  text-shadow: 0 0 20px #d4af37;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: bold;
}

.wow-talent-trees {
  display: flex;
  gap: 3rem;
  flex: 1;
  align-items: flex-start;
  opacity: 0;
  transform: scale(0.9);
  transition: all 1s ease-out;
}

.wow-talent-trees.trees-visible {
  opacity: 1;
  transform: scale(1);
}

.talent-tree {
  flex: 1;
  background: linear-gradient(180deg, rgba(139, 69, 19, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%);
  border: 2px solid #8b4513;
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 30px rgba(139, 69, 19, 0.3);
}

.frontend-tree {
  border-color: #61dafb;
  background: linear-gradient(180deg, rgba(97, 218, 251, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
}

.backend-tree {
  border-color: #68d391;
  background: linear-gradient(180deg, rgba(104, 211, 145, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
}

.tools-tree {
  border-color: #fbb6ce;
  background: linear-gradient(180deg, rgba(251, 182, 206, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
}

.tree-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
}

.tree-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 10px currentColor);
}

.tree-title {
  color: #d4af37;
  font-size: 1.3rem;
  margin: 0;
  text-shadow: 0 0 10px #d4af37;
}

.talent-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-height: 300px;
  position: relative;
  padding: 0.5rem 0;
}

.talent-tier {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  position: relative;
  animation: tierFadeIn 0.8s ease-out calc(var(--tier) * 0.3s) both;
  z-index: 2;
}

/* Individual Skill Connection Lines */
.skill-connection-line {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 13px;
  border-radius: 1px;
  z-index: -14;
  animation: connectionPulse-92fab1fa 2s ease-in-out infinite;
}

.frontend-line {
  background: linear-gradient(to bottom, #61dafb, rgba(97, 218, 251, 0.6));
}

.backend-line {
  background: linear-gradient(to bottom, #68d391, rgba(104, 211, 145, 0.6));
}

.tools-line {
  background: linear-gradient(to bottom, #fbb6ce, rgba(251, 182, 206, 0.6));
}

@keyframes connectionPulse {
  0%,
  100% {
    opacity: 0.7;
    transform: translateX(-50%) scaleY(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scaleY(1.1);
  }
}

.talent-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  grid-column: calc(var(--position) + 1);
  position: relative;
  z-index: 2;
}

.talent-node {
  width: 45px;
  height: 45px;
  border: 2px solid #444;
  border-radius: 6px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.9) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.8);
}

.talent-node.unlocked {
  border-color: #d4af37;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(40, 35, 20, 0.9) 100%);
  box-shadow:
    0 0 15px rgba(212, 175, 55, 0.4),
    inset 0 0 10px rgba(212, 175, 55, 0.2);
}

.talent-node.maxed {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(60, 50, 10, 0.9) 100%);
  border-color: #ffd700;
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.6),
    inset 0 0 15px rgba(255, 215, 0, 0.3);
}

.talent-node.locked {
  background: radial-gradient(circle, rgba(50, 50, 50, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%);
  border-color: #666;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.9);
  cursor: not-allowed;
  filter: grayscale(1) brightness(0.6);
}

.talent-node.locked .talent-icon {
  filter: grayscale(1) brightness(0.5) contrast(0.8);
  opacity: 0.6;
}

.talent-node.locked .talent-ranks {
  background: rgba(30, 30, 30, 0.9);
  color: #999;
  border-color: #666;
}

.talent-node.locked + .talent-name {
  color: #666;
  text-decoration: line-through;
  opacity: 0.7;
}

.talent-node.locked:hover {
  transform: none;
  border-color: #666;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.9);
}

.talent-node.selected {
  transform: scale(1.1);
  border-color: #ff6b35;
  box-shadow: 0 0 25px rgba(255, 107, 53, 0.8);
}

.talent-node:hover {
  transform: scale(1.05);
  border-color: #d4af37;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
}

.talent-icon {
  font-size: 1.8rem;
  line-height: 1;
  filter: drop-shadow(0 0 3px currentColor);
  display: flex;
  align-items: center;
  justify-content: center;
}

.talent-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.6));
}

.talent-ranks {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: rgba(0, 0, 0, 0.9);
  color: #d4af37;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 1px 3px;
  border-radius: 3px;
  border: 1px solid #d4af37;
  line-height: 1;
}

.talent-name {
  font-size: 0.7rem;
  color: #ccc;
  text-align: center;
  max-width: 70px;
  line-height: 1.1;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  margin-top: 0.2rem;
}

.talent-node.unlocked + .talent-name {
  color: #d4af37;
}

.talent-node.maxed + .talent-name {
  color: #ffd700;
  font-weight: bold;
}

/* Enhanced Skill Information Panel */
.skill-info-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
  border-top: 3px solid #d4af37;
  backdrop-filter: blur(15px);
  z-index: 1000;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
}

.skill-info-panel.panel-visible {
  opacity: 1;
  transform: translateY(0);
}

.skill-info-content {
  padding: 1.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.skill-info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
}

.skill-info-icon {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 60px;
  min-height: 60px;
}

.skill-info-icon img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.6));
}

.skill-info-title-section {
  flex: 1;
}

.skill-info-title {
  color: #d4af37;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.skill-info-rank {
  color: #ffd700;
  font-size: 1.1rem;
  font-weight: bold;
}

.close-panel-btn {
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
  color: #ff6b6b;
  font-size: 2rem;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-panel-btn:hover {
  background: rgba(255, 107, 107, 0.4);
  transform: scale(1.1);
}

.skill-info-body {
  display: grid;
  grid-template-columns: 1fr 1fr 200px;
  gap: 2rem;
  align-items: start;
}

.skill-info-section {
  background: rgba(40, 40, 40, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 6px;
  padding: 1rem;
}

.section-label {
  color: #d4af37;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 0.8rem 0;
  text-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
}

.skill-description {
  color: #ccc;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.prerequisites-list {
  color: #ff6b6b;
  font-size: 1rem;
  line-height: 1.4;
}

.prerequisite-item {
  color: #ff9999;
  font-weight: 500;
}

.skill-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-unlocked {
  background: rgba(104, 211, 145, 0.2);
  color: #68d391;
  border: 2px solid #68d391;
}

.status-locked {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 2px solid #ff6b6b;
}

.status-maxed {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  border: 2px solid #ffd700;
}

@keyframes tierFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  z-index: 10;
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

@media (max-width: 1200px) {
  .wow-talent-trees {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }

  .talent-tree {
    width: 100%;
    max-width: 400px;
  }

  .skill-info-body {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .skill-info-content {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .skills-title {
    font-size: 2.5rem;
  }

  .talent-node {
    width: 40px;
    height: 40px;
  }

  .talent-icon {
    font-size: 1.4rem;
  }

  .talent-name {
    font-size: 0.7rem;
    max-width: 60px;
  }

  .skill-info-title {
    font-size: 1.5rem;
  }

  .skill-info-icon {
    min-width: 50px;
    min-height: 50px;
  }

  .skill-info-icon img {
    width: 30px;
    height: 30px;
  }

  .close-panel-btn {
    width: 35px;
    height: 35px;
    font-size: 1.5rem;
  }
}
</style>
