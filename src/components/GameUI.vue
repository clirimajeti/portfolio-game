<template>
  <div class="game-ui">
    <div class="level-indicator" @click="toggleCheatInput">
      Level: {{ level }} / 5
      <input 
        v-if="showCheatInput"
        v-model="cheatCode"
        @keyup.enter="checkCheatCode"
        @blur="hideCheatInput"
        class="cheat-input"
        type="text"
        placeholder="Enter cheat..."
        ref="cheatInputRef"
      />
    </div>
    <div class="score-indicator">Score: {{ score || 0 }}</div>
    <div class="controls-hint">
      Use ← → ↑ ↓ keys to move<br>
      Press Space to throw coffee<br>
      Hit bugs to earn points!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watchEffect } from 'vue'

const { level, score } = defineProps<{
  level: number
  score?: number
}>()

const emit = defineEmits<{
  cheatActivated: []
}>()

const showCheatInput = ref(false)
const cheatCode = ref('')
const cheatInputRef = ref<HTMLInputElement>()

const toggleCheatInput = async () => {
  showCheatInput.value = !showCheatInput.value
  if (showCheatInput.value) {
    await nextTick()
    cheatInputRef.value?.focus()
  }
}

const hideCheatInput = () => {
  showCheatInput.value = false
  cheatCode.value = ''
}

const checkCheatCode = () => {
  if (cheatCode.value.toLowerCase() === 'cliaj') {
    console.log('Cheat code activated!')
    emit('cheatActivated')
    hideCheatInput()
  } else {
    // Invalid cheat code, clear input
    cheatCode.value = ''
  }
}

// Debug: Watch score changes
watchEffect(() => {
  console.log('GameUI - Score updated:', score)
})
</script>

<style scoped>
.game-ui {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 999;
  color: var(--accent-color);
  font-family: var(--pixel-font);
}

.level-indicator {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  position: relative;
  user-select: none;
}

.level-indicator:hover {
  opacity: 0.8;
}

.cheat-input {
  position: absolute;
  top: 25px;
  left: 0;
  background: rgba(0, 0, 0, 0.9);
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 14px;
  font-family: var(--pixel-font);
  outline: none;
  width: 150px;
  z-index: 1000;
}

.cheat-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.score-indicator {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--success-color);
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
}


.controls-hint {
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-light);
  background: rgba(0, 0, 0, 0.7);
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--accent-color);
}

</style>