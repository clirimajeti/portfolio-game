<template>
  <div class="game-ui">
    <button type="button" class="level-indicator" title="Open console (~)" @click="openConsole">
      Level: {{ level }} / 5
    </button>
    <div class="score-indicator">Score: {{ String(score || 0).padStart(5, '0') }}</div>
    <div v-if="level === 2" class="mechanic-indicator">
      Combo <span class="mechanic-value">x{{ gameStore.currentMultiplier }}</span>
    </div>
    <div v-else-if="level === 3" class="mechanic-indicator">
      Multi-kill <span class="mechanic-value">{{ gameStore.multiKillChain > 1 ? `x${gameStore.multiKillChain}` : 'ready' }}</span>
    </div>
    <div v-else-if="level === 4" class="mechanic-indicator">
      Streak <span class="mechanic-value">{{ gameStore.killStreak }}</span>
    </div>
    <div v-else-if="level === 5" class="mechanic-indicator">
      Time <span class="mechanic-value">{{ formattedTime }}</span> | Bonus <span class="mechanic-value">+{{ projectedBonus }}</span>
    </div>
    <div class="controls-hint">
      Use ← → ↑ ↓ keys to move<br>
      Press Space to throw coffee<br>
      Hit bugs to earn points!<br>
      ~ console
    </div>
  </div>

  <div class="scoring-popups" aria-live="polite">
    <TransitionGroup name="score-pop">
      <div v-for="event in gameStore.scoringEvents" :key="event.id" class="scoring-popup">
        {{ event.label }}
      </div>
    </TransitionGroup>
  </div>

  <Transition name="console-drop">
    <section v-if="isConsoleOpen" class="dev-console" role="dialog" aria-label="Console">
      <header class="dev-console__title">
        <span>Console</span>
        <button type="button" class="dev-console__close" aria-label="Close console" @click="closeConsole">×</button>
      </header>
      <div ref="logRef" class="dev-console__log" role="log" aria-live="polite">
        <div v-for="(line, i) in lines" :key="i" class="dev-console__line">{{ line }}</div>
      </div>
      <form class="dev-console__input-row" @submit.prevent="submit">
        <label for="dev-console-input" class="visually-hidden">Console command</label>
        <input
          id="dev-console-input"
          ref="inputRef"
          v-model="command"
          class="dev-console__input"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown.up.prevent="recall(-1)"
          @keydown.down.prevent="recall(1)"
        />
        <button type="submit" class="dev-console__submit">Submit</button>
      </form>
    </section>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { SCORING_CONFIG } from '../constants'
import { runCommand, BANNER, type ConsoleState } from '../composables/consoleCommands'

const { level, score } = defineProps<{
  level: number
  score?: number
}>()

const emit = defineEmits<{
  goToLevel: [level: number]
}>()

const gameStore = useGameStore()

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(gameStore.levelElapsed / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const projectedBonus = computed(() => {
  const remaining = Math.max(0, SCORING_CONFIG.LEVEL_5_PAR_TIME_MS - gameStore.levelElapsed)
  return Math.floor(remaining * SCORING_CONFIG.SPEED_BONUS_POINTS_PER_MS)
})

const isConsoleOpen = ref(false)
const command = ref('')
const lines = ref<string[]>([])
const history: string[] = []
let historyIndex = 0
let consoleState: ConsoleState = { level: 1, bugs: 0, cheats: false, god: false, noclip: false, rapidFire: false }
const inputRef = ref<HTMLInputElement>()
const logRef = ref<HTMLElement>()

const scrollToBottom = async () => {
  await nextTick()
  if (logRef.value) logRef.value.scrollTop = logRef.value.scrollHeight
}

const openConsole = async () => {
  if (lines.value.length === 0) lines.value.push(...BANNER)
  isConsoleOpen.value = true
  await scrollToBottom()
  inputRef.value?.focus()
}

const closeConsole = () => {
  isConsoleOpen.value = false
}

const recall = (step: number) => {
  historyIndex = Math.max(0, Math.min(history.length, historyIndex + step))
  command.value = history[historyIndex] ?? ''
}

const submit = () => {
  const input = command.value.trim()
  command.value = ''
  if (!input) return
  history.push(input)
  historyIndex = history.length

  const result = runCommand(input, { ...consoleState, level, bugs: gameStore.bugEnemies.length, rapidFire: gameStore.rapidFire })
  consoleState = result.state
  lines.value.push(`] ${input}`, ...result.lines)

  const action = result.action
  if (action?.type === 'clear') lines.value = []
  else if (action?.type === 'close') closeConsole()
  else if (action?.type === 'goToLevel') emit('goToLevel', action.level)
  else if (action?.type === 'addScore') gameStore.addScore(action.points)
  else if (action?.type === 'setRapidFire') gameStore.setRapidFire(action.on)
  scrollToBottom()
}

// `~` like CS 1.6. event.code covers layouts where that key is a dead key (German `^`).
const onKeydown = (event: KeyboardEvent) => {
  if (event.code === 'Backquote' || event.key === '`' || event.key === '~') {
    event.preventDefault()
    if (isConsoleOpen.value) closeConsole()
    else openConsole()
  } else if (event.key === 'Escape' && isConsoleOpen.value) {
    closeConsole()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.game-ui {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 999;
  padding: 0.8rem 0.9rem;
  background: var(--surface);
  box-shadow: var(--panel-shadow);
  color: var(--text);
  font-family: var(--font-pixel);
  font-size: 0.65rem;
  line-height: 1.6;
}

.level-indicator {
  display: block;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 0.35rem;
  cursor: pointer;
  user-select: none;
}

.level-indicator:focus-visible {
  outline: 2px solid var(--yellow);
  outline-offset: 2px;
}

.level-indicator:hover {
  color: var(--yellow);
}

.score-indicator {
  text-transform: uppercase;
  color: var(--yellow);
  margin-bottom: 0.7rem;
}

.mechanic-indicator {
  text-transform: uppercase;
  color: var(--text-muted);
  margin: -0.35rem 0 0.7rem;
  letter-spacing: 0.03em;
}

.mechanic-value {
  color: var(--cyan);
}

.scoring-popups {
  position: fixed;
  top: 22%;
  left: 50%;
  z-index: 1500;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  pointer-events: none;
}

.scoring-popup {
  padding: 0.35rem 0.9rem;
  background: var(--surface);
  box-shadow: var(--panel-shadow);
  color: var(--yellow);
  font-family: var(--font-pixel);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
}

.score-pop-enter-active,
.score-pop-leave-active {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.score-pop-enter-from,
.score-pop-leave-to {
  transform: translateY(-10px) scale(0.9);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .score-pop-enter-active,
  .score-pop-leave-active {
    transition: none;
  }
}

.controls-hint {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-muted);
  padding-top: 0.6rem;
  border-top: 4px dotted var(--border);
}

/* Engine console: GoldSrc VGUI look, identical on every level */
.dev-console {
  --vgui-panel: rgba(76, 88, 68, 0.94);
  --vgui-dark: #3e4637;
  --vgui-title: #5a6a50;
  --vgui-light: #8c9880;
  --vgui-shadow: #292c21;
  --vgui-text: #dedfd6;
  --vgui-accent: #c4b550;

  position: fixed;
  top: 0;
  left: 50%;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  width: min(60vw, 720px);
  height: 45vh;
  min-height: 220px;
  transform: translateX(-50%);
  padding: 0 6px 6px;
  background: var(--vgui-panel);
  border: 1px solid;
  border-color: var(--vgui-light) var(--vgui-shadow) var(--vgui-shadow) var(--vgui-light);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
  color: var(--vgui-text);
  font-family: Tahoma, Verdana, 'Segoe UI', sans-serif;
  font-size: 12px;
}

.dev-console__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 -6px 6px;
  padding: 3px 4px 3px 8px;
  background: var(--vgui-title);
  border-bottom: 1px solid var(--vgui-shadow);
  font-weight: bold;
  letter-spacing: 0.02em;
}

.dev-console__close,
.dev-console__submit {
  background: var(--vgui-title);
  color: var(--vgui-text);
  border: 1px solid;
  border-color: var(--vgui-light) var(--vgui-shadow) var(--vgui-shadow) var(--vgui-light);
  font: inherit;
  cursor: pointer;
}

.dev-console__close {
  width: 18px;
  height: 18px;
  padding: 0;
  line-height: 1;
}

.dev-console__submit {
  padding: 2px 14px;
}

.dev-console__close:active,
.dev-console__submit:active {
  border-color: var(--vgui-shadow) var(--vgui-light) var(--vgui-light) var(--vgui-shadow);
}

.dev-console__log {
  flex: 1;
  overflow-y: auto;
  padding: 4px 6px;
  background: var(--vgui-dark);
  border: 1px solid;
  border-color: var(--vgui-shadow) var(--vgui-light) var(--vgui-light) var(--vgui-shadow);
  font-family: 'Lucida Console', Monaco, Consolas, 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.35;
  white-space: pre-wrap;
  word-break: break-word;
  scrollbar-color: var(--vgui-title) var(--vgui-dark);
}

.dev-console__input-row {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.dev-console__input {
  flex: 1;
  min-width: 0;
  padding: 2px 4px;
  background: var(--vgui-dark);
  color: var(--vgui-text);
  border: 1px solid;
  border-color: var(--vgui-shadow) var(--vgui-light) var(--vgui-light) var(--vgui-shadow);
  font-family: 'Lucida Console', Monaco, Consolas, 'Courier New', monospace;
  font-size: 12px;
  caret-color: var(--vgui-accent);
}

.dev-console__input:focus {
  outline: none;
}

.dev-console__input:focus-visible,
.dev-console__close:focus-visible,
.dev-console__submit:focus-visible {
  outline: 1px dotted var(--vgui-accent);
  outline-offset: 1px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.console-drop-enter-active,
.console-drop-leave-active {
  transition: transform 0.18s ease-out;
}

.console-drop-enter-from,
.console-drop-leave-to {
  transform: translate(-50%, -100%);
}

@media (prefers-reduced-motion: reduce) {
  .console-drop-enter-active,
  .console-drop-leave-active {
    transition: none;
  }
}

@media (max-width: 768px) {
  .dev-console {
    width: 100%;
  }
}

/* Keyboard hints are noise on touch screens; keep the HUD compact */
@media (max-width: 768px) {
  .score-indicator {
    margin-bottom: 0;
  }

  .controls-hint {
    display: none;
  }
}
</style>
