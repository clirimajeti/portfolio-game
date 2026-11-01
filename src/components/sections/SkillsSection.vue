<template>
  <section class="game-section skills-section">
    <div class="skills-content">
      <h2 class="skills-title level-title" data-stage="Stage 3">Skill tree</h2>
      <p class="skills-subtitle">Frontend first. Hover or focus a talent to inspect it.</p>

      <div class="talent-frame" :class="{ 'trees-visible': skillTreeVisible }">
        <div class="talent-window">
          <div class="portrait" role="img" aria-label="Player character" />

          <header class="title-bar">
            <h3 class="title-text">Talents</h3>
            <span class="close-deco" aria-hidden="true" />
          </header>

          <div class="pane-shell" :class="`scene-${active.key}`" :data-emblem="active.icon">
            <div
              :id="`panel-${active.key}`"
              class="talent-pane"
              role="tabpanel"
              :aria-labelledby="`tab-${active.key}`"
            >
              <div class="talent-grid" :style="{ width: `${GRID_W}px`, height: `${GRID_H}px` }">
                <svg
                  class="talent-arrows"
                  :width="GRID_W"
                  :height="GRID_H"
                  :viewBox="`0 0 ${GRID_W} ${GRID_H}`"
                  aria-hidden="true"
                >
                  <g v-for="arrow in active.arrows" :key="arrow.id" :class="{ lit: arrow.lit }">
                    <path class="arrow-casing" :d="arrow.d" />
                    <path class="arrow-line" :d="arrow.d" />
                    <polygon class="arrow-head" :points="arrow.head" />
                  </g>
                </svg>

                <div
                  v-for="skill in active.skills"
                  :key="skill.id"
                  class="talent-slot"
                  :class="[`col-${skill.position}`, { 'tip-up': skill.tier > 2 }]"
                  :style="{ left: `${cellX(skill.position)}px`, top: `${cellY(skill.tier)}px` }"
                >
                  <button
                    type="button"
                    class="talent-btn"
                    :class="skill.state"
                    :aria-label="`${skill.name}, rank ${skill.currentRank} of ${skill.maxRank}`"
                    :aria-describedby="`tt-${active.key}-${skill.id}`"
                  >
                    <img v-if="skill.icon.includes('.svg')" :src="skill.icon" alt="" />
                    <span v-else class="talent-emoji" aria-hidden="true">{{ skill.icon }}</span>
                    <span class="talent-rank" aria-hidden="true">
                      {{ skill.currentRank }}/{{ skill.maxRank }}
                    </span>
                  </button>

                  <div :id="`tt-${active.key}-${skill.id}`" role="tooltip" class="talent-tooltip">
                    <strong class="tt-name">{{ skill.name }}</strong>
                    <span class="tt-rank">Rank {{ skill.currentRank }}/{{ skill.maxRank }}</span>
                    <span class="tt-desc">{{ skill.description }}</span>
                    <span v-if="skill.state === 'locked' && skill.requires" class="tt-requires">
                      Requires {{ skill.requires }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer class="window-footer">
            <span>{{ active.name }} talents: {{ active.points }}</span>
            <span>Total points: {{ totalPoints }}</span>
          </footer>
        </div>

        <div class="talent-tabs" role="tablist" aria-label="Talent trees">
          <button
            v-for="tree in trees"
            :id="`tab-${tree.key}`"
            :key="tree.key"
            type="button"
            role="tab"
            class="talent-tab"
            :aria-selected="tree.key === activeKey"
            :aria-controls="`panel-${tree.key}`"
            @click="activeKey = tree.key"
          >
            {{ tree.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="portal" :class="{ 'portal-active': isPortalActive }" @click="$emit('next')" />
  </section>
</template>

<script setup lang="ts">
import { computed, inject, ref, onMounted } from 'vue'
import { WOW_SKILL_TREES } from '../../constants'

defineEmits<{
  next: []
}>()

const isPortalActive = inject('isPortalActive', ref(false))
const skillTreeVisible = ref(false)

// Fixed cell geometry: icons and the arrow SVG share these coordinates, no DOM measuring.
const COLS = 4
const COL_W = 78
const ROW_H = 90
const ICON = 46
const ROWS = Math.max(...Object.values(WOW_SKILL_TREES).map((t) => t.tiers.length))
const GRID_W = COL_W * COLS
const GRID_H = ROW_H * ROWS
const cellX = (position: number) => position * COL_W + (COL_W - ICON) / 2
const cellY = (tier: number) => (tier - 1) * ROW_H + (ROW_H - ICON) / 2

type TalentSkill = (typeof WOW_SKILL_TREES)[keyof typeof WOW_SKILL_TREES]['tiers'][number][number]

const stateOf = (s: TalentSkill) =>
  !s.unlocked || s.currentRank === 0 ? 'locked' : s.currentRank >= s.maxRank ? 'maxed' : 'partial'

const trees = Object.entries(WOW_SKILL_TREES).map(([key, tree]) => {
  const flat: TalentSkill[] = tree.tiers.flat()
  const byId = new Map(flat.map((s) => [s.id, s]))

  const occupied = new Set(flat.map((s) => `${s.tier}:${s.position}`))
  const clear = (col: number, from: number, to: number) => {
    for (let t = from; t <= to; t++) if (occupied.has(`${t}:${col}`)) return false
    return true
  }

  // Orthogonal connector: down from the parent, across in the gap below some tier g, down into the child.
  // Prefer the gap right above the child; move it up if a vertical leg would cross an icon.
  const arrows = flat
    .flatMap((to) =>
      to.prerequisites.flatMap((pid) => {
        const from = byId.get(pid)
        if (!from) return []
        const fx = cellX(from.position) + ICON / 2
        const tx = cellX(to.position) + ICON / 2
        const fy = cellY(from.tier) + ICON + 2
        const ty = cellY(to.tier) - 2
        let d = `M${fx} ${fy} V${ty - 8}`
        if (fx !== tx) {
          let g = to.tier - 1
          while (
            g > from.tier &&
            !(clear(from.position, from.tier + 1, g) && clear(to.position, g + 1, to.tier - 1))
          )
            g--
          const gy = g * ROW_H
          d = `M${fx} ${fy} V${gy} H${tx} V${ty - 8}`
        }
        return [
          {
            id: `${pid}-${to.id}`,
            d,
            head: `${tx - 7},${ty - 9} ${tx + 7},${ty - 9} ${tx},${ty}`,
            lit: from.currentRank > 0,
          },
        ]
      }),
    )
    // Lit connectors last so gold wins where paths share a segment.
    .sort((x, y) => Number(x.lit) - Number(y.lit))

  return {
    key,
    name: tree.name,
    icon: tree.icon,
    points: flat.reduce((sum, s) => sum + s.currentRank, 0),
    arrows,
    skills: flat.map((s) => ({
      ...s,
      state: stateOf(s),
      requires: s.prerequisites.map((p) => byId.get(p)?.name ?? p).join(', '),
    })),
  }
})

const totalPoints = trees.reduce((sum, t) => sum + t.points, 0)

const activeKey = ref(trees[0].key)
const active = computed(() => trees.find((t) => t.key === activeKey.value) ?? trees[0])


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
  overflow: hidden;
  /* Torch-lit stone hall: warm glow, dark vignette, mortar lines of offset stone blocks */
  background:
    radial-gradient(ellipse 60% 45% at 50% 42%, rgba(255, 170, 60, 0.16), transparent 70%),
    radial-gradient(ellipse 100% 90% at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.85) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112'%3E%3Cpath d='M0 1H112M0 57H112M1 0V56M57 56V112' stroke='%23000' stroke-opacity='.55' stroke-width='2'/%3E%3Cpath d='M0 3H112M0 59H112' stroke='%23fff' stroke-opacity='.04' stroke-width='1'/%3E%3C/svg%3E"),
    linear-gradient(180deg, #2a2119 0%, #1a1410 55%, #0f0b08 100%);
  /* Talent window palette: aged gold and bronze on near-black */
  --tt-gold: #f2c14e;
  --tt-gold-hi: #ffe9a8;
  --tt-gold-mid: #c08a2c;
  --tt-gold-lo: #6b4a14;
  --tt-green: #5be37a;
  --tt-grey: #8a8a96;
  --tt-red: #ff5d5d;
  --tt-serif: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
}

.skills-content {
  max-width: 1200px;
  height: 100vh;
  padding: 64px 24px 20px;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skills-title {
  margin-bottom: 0.6rem;
  /* Fantasy MMO title: engraved gold serif instead of the arcade pixel font */
  font-family: var(--tt-serif);
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--tt-gold);
  text-shadow:
    0 1px 0 var(--tt-gold-hi),
    0 2px 0 var(--tt-gold-lo),
    0 4px 12px rgba(0, 0, 0, 0.9);
}

.skills-title::before {
  font-family: var(--tt-serif);
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  color: var(--tt-gold-mid);
}

.skills-subtitle {
  color: #d8c9a3;
  margin-bottom: 1.6rem;
  text-align: center;
}

/* Window + tabs column: fills the space left under the title */
.talent-frame {
  flex: 1;
  min-height: 0;
  width: min(500px, 100%);
  max-height: 640px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.4s steps(4);
  /* One shadow for window and tabs together, so it never darkens the tabs */
  filter: drop-shadow(8px 10px 0 rgba(0, 0, 0, 0.5));
}

.talent-frame.trees-visible {
  opacity: 1;
}

/* The window: dark stone body inside a beveled gold frame */
.talent-window {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 10px 8px;
  border: 3px solid;
  border-color: var(--tt-gold-hi) var(--tt-gold-lo) var(--tt-gold-lo) var(--tt-gold-mid);
  border-radius: 6px;
  background:
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0 2px, transparent 2px 7px),
    repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.22) 0 2px, transparent 2px 7px),
    linear-gradient(#2b2722, #171411);
  box-shadow:
    inset 0 0 0 1px #000,
    inset 0 0 0 2px rgba(255, 233, 168, 0.15),
    inset 0 0 30px rgba(0, 0, 0, 0.8),
    0 0 0 2px #000;
}

/* Character portrait in a heavy gold ring, overlapping the top-left corner */
.portrait {
  position: absolute;
  z-index: 3;
  left: -26px;
  top: -26px;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background:
    url('../../assets/idle_stand.png') 50% 8px / 84% auto no-repeat,
    radial-gradient(circle at 50% 35%, #3a3550, #0b0a12 70%);
  image-rendering: pixelated;
  border: 4px solid var(--tt-gold-mid);
  box-shadow:
    inset 0 0 0 2px #000,
    inset 0 0 14px rgba(0, 0, 0, 0.9),
    0 0 0 2px var(--tt-gold-lo),
    0 0 0 4px #120c02,
    0 0 0 5px var(--tt-gold-hi),
    0 0 0 7px #000,
    4px 6px 10px rgba(0, 0, 0, 0.8);
}

.title-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  margin: 6px 0 8px 58px;
  background: linear-gradient(#3b342c, #1a1612);
  border: 2px solid;
  border-color: #5a4c38 #0c0a08 #0c0a08 #4a3e2e;
  box-shadow: 0 0 0 1px #000;
}

.title-text {
  margin: 0;
  font-family: var(--tt-serif);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--tt-gold);
  text-shadow: 1px 1px 0 #000;
}

.close-deco {
  position: absolute;
  right: 4px;
  top: 50%;
  width: 20px;
  height: 20px;
  transform: translateY(-50%);
  border: 2px solid var(--tt-gold-mid);
  border-radius: 3px;
  box-shadow: 0 0 0 1px #000;
  /* A small x drawn as an inline SVG on a red plate */
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 4L12 12M12 4L4 12' stroke='%23ffd27a' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E")
      center / 14px no-repeat,
    linear-gradient(#c8321e, #6e1208);
}

/* Recessed scene behind the talents; the per-tree scene is set by the scene-* class */
.pane-shell {
  position: relative;
  flex: 1;
  min-height: 0;
  border: 2px solid;
  border-color: #000 #3a3128 #3a3128 #000;
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.8),
    inset 0 0 28px rgba(0, 0, 0, 0.9);
  background: var(--scene);
}

/* Faint emblem from the tree's own icon */
.pane-shell::before {
  content: attr(data-emblem);
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  font-size: 180px;
  line-height: 1;
  opacity: 0.07;
  filter: grayscale(1) sepia(1) brightness(1.4);
  pointer-events: none;
}

/* Night sky over an arched library hall */
.scene-frontend {
  --scene:
    radial-gradient(ellipse 40% 26% at 50% 0%, rgba(160, 200, 255, 0.28), transparent 70%),
    radial-gradient(circle at 22% 14%, rgba(255, 255, 255, 0.5) 0 1px, transparent 2px),
    radial-gradient(circle at 71% 9%, rgba(255, 255, 255, 0.45) 0 1px, transparent 2px),
    radial-gradient(circle at 84% 24%, rgba(255, 255, 255, 0.35) 0 1px, transparent 2px),
    radial-gradient(ellipse 46% 60% at 50% 100%, transparent 96%, rgba(150, 190, 255, 0.12) 97% 99%, transparent 100%),
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.35) 0 3px, transparent 3px 22px) 0 72% / 100% 28% no-repeat,
    linear-gradient(transparent 70%, rgba(40, 28, 18, 0.75) 71%, #120c08),
    linear-gradient(#0d1c3e, #142a5a 40%, #0a1630);
}

/* Ember-lit forge */
.scene-backend {
  --scene:
    radial-gradient(ellipse 50% 30% at 50% 100%, rgba(255, 120, 40, 0.45), transparent 75%),
    radial-gradient(circle at 30% 70%, rgba(255, 170, 70, 0.5) 0 1px, transparent 2px),
    radial-gradient(circle at 64% 58%, rgba(255, 150, 60, 0.45) 0 1px, transparent 2px),
    radial-gradient(circle at 52% 40%, rgba(255, 200, 90, 0.35) 0 1px, transparent 2px),
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0 2px, transparent 2px 38px),
    linear-gradient(#1a0806, #3a110a 55%, #5a1a0c);
}

/* Lantern-lit workshop */
.scene-tools {
  --scene:
    radial-gradient(ellipse 34% 26% at 78% 22%, rgba(200, 255, 200, 0.18), transparent 70%),
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.28) 0 4px, transparent 4px 64px),
    linear-gradient(transparent 76%, rgba(30, 20, 10, 0.7) 77%, #0d0a06),
    linear-gradient(#08201f, #0f3a33 50%, #0a2622);
}

.talent-pane {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 18px 0;
}

/* Period scrollbar: dark track, bronze thumb */
.talent-pane::-webkit-scrollbar {
  width: 12px;
}

.talent-pane::-webkit-scrollbar-track {
  background: #0b0907;
  border-left: 1px solid #3a3128;
}

.talent-pane::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, var(--tt-gold-hi), var(--tt-gold-mid) 40%, var(--tt-gold-lo));
  border: 2px solid #0b0907;
  border-radius: 6px;
}

.talent-grid {
  position: relative;
  margin: 0 auto;
}

.talent-arrows {
  position: absolute;
  inset: 0;
  overflow: visible;
}

.arrow-casing {
  fill: none;
  stroke: #000;
  stroke-width: 8;
}

.arrow-line {
  fill: none;
  stroke: #7a7a82;
  stroke-width: 4;
}

.arrow-head {
  fill: #7a7a82;
  stroke: #000;
  stroke-width: 1.5;
}

.lit .arrow-line {
  stroke: var(--tt-gold);
}

.lit .arrow-head {
  fill: var(--tt-gold);
}

.talent-slot {
  position: absolute;
  width: 46px;
  height: 46px;
}

.talent-slot:hover,
.talent-slot:focus-within {
  z-index: 5;
}

.talent-btn {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
  background: radial-gradient(circle at 50% 40%, #3a3a40, #0a0a0c 80%);
  border: 2px solid #1a1a1e;
  box-shadow:
    0 0 0 1px #000,
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 0 10px rgba(0, 0, 0, 0.9),
    2px 3px 4px rgba(0, 0, 0, 0.7);
}

/* Glossy top edge */
.talent-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: linear-gradient(rgba(255, 255, 255, 0.16), transparent 45%);
  pointer-events: none;
}

.talent-btn img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.talent-emoji {
  font-size: 1.45rem;
  line-height: 1;
}

.talent-btn.maxed,
.talent-btn.partial {
  background: radial-gradient(circle at 50% 40%, #4e4a66, #15141e 80%);
}

.talent-btn.maxed {
  border-color: var(--tt-gold);
  box-shadow:
    0 0 0 1px #000,
    0 0 8px rgba(242, 193, 78, 0.45),
    inset 0 0 0 1px #000,
    inset 0 0 10px rgba(0, 0, 0, 0.9);
}

.talent-btn.partial {
  border-color: #3fd060;
  box-shadow:
    0 0 0 1px #000,
    0 0 8px rgba(91, 227, 122, 0.4),
    inset 0 0 0 1px #000,
    inset 0 0 10px rgba(0, 0, 0, 0.9);
}

.talent-btn.locked img,
.talent-btn.locked .talent-emoji {
  filter: grayscale(1) brightness(0.75) contrast(0.9);
}

.talent-btn:hover {
  filter: brightness(1.25);
}

.talent-btn:focus-visible {
  outline: 3px solid var(--cyan);
  outline-offset: 3px;
}

.talent-rank {
  position: absolute;
  right: -10px;
  bottom: -9px;
  z-index: 1;
  min-width: 26px;
  padding: 1px 3px;
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  color: var(--tt-grey);
  background: #08080b;
  border: 1px solid #3a3a44;
  border-radius: 3px;
}

.maxed .talent-rank {
  color: var(--tt-gold);
  border-color: var(--tt-gold-lo);
}

.partial .talent-rank {
  color: var(--tt-green);
  border-color: #1f7a35;
}

/* Tooltip: hidden until the icon is hovered or focused */
.talent-tooltip {
  display: none;
  position: absolute;
  top: calc(100% + 14px);
  z-index: 20;
  width: 232px;
  padding: 8px 10px;
  flex-direction: column;
  gap: 3px;
  font-size: 0.78rem;
  line-height: 1.35;
  background: rgba(6, 6, 18, 0.96);
  border: 1px solid #c9c9dc;
  border-radius: 4px;
  box-shadow:
    0 0 0 1px #000,
    4px 4px 0 rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

/* Lower tiers open upward so the tooltip stays inside the scroll pane */
.tip-up .talent-tooltip {
  top: auto;
  bottom: calc(100% + 14px);
}

.col-0 .talent-tooltip,
.col-1 .talent-tooltip {
  left: -6px;
}
.col-2 .talent-tooltip,
.col-3 .talent-tooltip {
  right: -6px;
}

.talent-btn:hover + .talent-tooltip,
.talent-btn:focus + .talent-tooltip {
  display: flex;
}

.tt-name {
  color: var(--tt-gold);
  font-size: 0.85rem;
}

.tt-rank {
  color: var(--text);
}

.tt-desc {
  color: #f0e2b6;
}

.tt-requires {
  color: var(--tt-red);
}

.window-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
  padding: 4px 10px;
  font-family: var(--tt-serif);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--tt-gold);
  text-shadow: 1px 1px 0 #000;
  background: linear-gradient(#0c0a08, #1c1813);
  border: 1px solid;
  border-color: #000 var(--tt-gold-lo) var(--tt-gold-lo) #000;
}

/* Tabs hang off the window's bottom-left edge */
.talent-tabs {
  display: flex;
  gap: 4px;
  padding-left: 18px;
}

.talent-tab {
  position: relative;
  margin-top: -3px;
  padding: 8px 14px 6px;
  font-family: var(--tt-serif);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--tt-gold-mid);
  cursor: pointer;
  background: linear-gradient(#1a1612, #0c0a08);
  border: 2px solid var(--tt-gold-lo);
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow:
    0 0 0 1px #000,
    3px 4px 0 rgba(0, 0, 0, 0.5);
}

.talent-tab:hover {
  color: var(--tt-gold);
}

/* Active tab: brighter and fused with the window above it */
.talent-tab[aria-selected='true'] {
  z-index: 2;
  padding-top: 11px;
  padding-bottom: 8px;
  color: var(--tt-gold-hi);
  background: linear-gradient(#171411, #2b2520);
  border-color: var(--tt-gold-mid);
}

.talent-tab:focus-visible {
  outline: 3px solid var(--cyan);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .skills-content {
    /* Bottom room keeps the window clear of the EXIT gate */
    padding: 110px 16px 175px;
  }

  .talent-frame {
    padding-top: 22px;
  }

  .portrait {
    left: -8px;
    top: -26px;
    width: 70px;
    height: 70px;
  }

  .title-bar {
    margin-left: 62px;
  }

  .window-footer {
    font-size: 0.75rem;
  }
}

/* Bronze stone gate instead of the arcade portal; geometry comes from the global .portal */
.skills-section .portal {
  background:
    radial-gradient(ellipse at 50% 60%, #120d08 0 45%, transparent 46%),
    linear-gradient(180deg, #4a3a26, #2a2015);
  border: 3px solid var(--tt-gold-mid);
  border-radius: 40px 40px 4px 4px;
  box-shadow:
    inset 0 0 0 2px var(--tt-gold-lo),
    0 0 0 2px #000,
    0 6px 14px rgba(0, 0, 0, 0.8);
}

.skills-section .portal::before {
  inset: 18px 22px 10px;
  border-radius: 20px 20px 0 0;
  background: #0b0805;
}

.skills-section .portal-active {
  border-color: var(--tt-gold-hi);
  box-shadow:
    inset 0 0 0 2px var(--tt-gold),
    0 0 0 2px #000,
    0 0 28px rgba(255, 190, 80, 0.75);
}

.skills-section .portal-active::before {
  background: radial-gradient(ellipse at 50% 70%, #fff3c4, #ffb84d 45%, #7a3d0a 100%);
}

.skills-section .portal::after {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: var(--tt-gold-mid);
}

.skills-section .portal-active::after {
  color: var(--tt-gold-hi);
}
</style>
