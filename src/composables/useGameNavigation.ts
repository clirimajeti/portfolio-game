import { ref } from 'vue'
import { GAME_CONFIG } from '../constants'

export function useGameNavigation() {
  const currentSection = ref(0)
  const currentLevel = ref(1)
  const maxSections = GAME_CONFIG.MAX_SECTIONS

  const nextSection = () => {
    if (currentSection.value < maxSections - 1) {
      currentSection.value++
      currentLevel.value++
    }
  }

  const goToSection = (sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < maxSections) {
      currentSection.value = sectionIndex
      currentLevel.value = sectionIndex + 1
    }
  }

  const previousSection = () => {
    if (currentSection.value > 0) {
      currentSection.value--
      currentLevel.value--
    }
  }

  const isFirstSection = () => currentSection.value === 0
  const isLastSection = () => currentSection.value === maxSections - 1

  return {
    currentSection,
    currentLevel,
    nextSection,
    goToSection,
    previousSection,
    isFirstSection,
    isLastSection,
    maxSections
  }
}