import { useGameStore } from '../stores/gameStore'
import { SCORING_CONFIG } from '../constants'

const multiKillWindowForChain = (chain: number): number => {
  const config = SCORING_CONFIG.MULTI_KILL.find(step => step.chain === chain)
  return config?.windowMs ?? SCORING_CONFIG.MULTI_KILL_DEFAULT_WINDOW_MS
}

export function useScoringSystem() {
  const gameStore = useGameStore()

  let eventTimers: number[] = []

  const scheduleEventRemoval = (id: number) => {
    const timer = window.setTimeout(() => {
      gameStore.removeScoringEvent(id)
      eventTimers = eventTimers.filter(t => t !== timer)
    }, SCORING_CONFIG.POPUP_DURATION_MS)
    eventTimers.push(timer)
  }

  const pushPopup = (label: string, points: number) => {
    const id = gameStore.pushScoringEvent(label, points)
    scheduleEventRemoval(id)
  }

  // Level 2 - combo multiplier: consecutive kills inside the window raise the multiplier
  const registerComboKill = (now: number) => {
    const last = gameStore.lastKillAt
    const withinWindow = last !== null && now - last <= SCORING_CONFIG.COMBO_WINDOW_MS
    const next = withinWindow ? gameStore.currentMultiplier + 1 : 1
    gameStore.comboCount = Math.min(next, SCORING_CONFIG.COMBO_MAX_MULTIPLIER)
    gameStore.lastKillAt = now

    const multiplier = gameStore.currentMultiplier
    const points = SCORING_CONFIG.BASE_POINTS * multiplier
    gameStore.addScore(points)

    if (multiplier > 1) {
      pushPopup(`COMBO x${multiplier}`, points)
    }
  }

  // Level 3 - multi-kill: escalating chain within a per-step time window
  const registerMultiKill = (now: number) => {
    const last = gameStore.lastKillAt
    const previousChain = gameStore.multiKillChain
    const tentativeChain = Math.min(previousChain + 1, SCORING_CONFIG.MULTI_KILL_CHAIN_MAX)
    const withinWindow =
      last !== null && now - last <= multiKillWindowForChain(tentativeChain)
    const chain = withinWindow ? tentativeChain : 1

    gameStore.multiKillChain = chain
    gameStore.lastKillAt = now

    let points = SCORING_CONFIG.BASE_POINTS
    const step = SCORING_CONFIG.MULTI_KILL.find(entry => entry.chain === chain)
    if (step) {
      points += step.bonus
      pushPopup(`${step.label} +${step.bonus}`, points)
    }
    gameStore.addScore(points)
  }

  // Level 4 - killing spree: flat bonuses at streak milestones, no time pressure
  const registerSpreeKill = () => {
    gameStore.killStreak += 1
    const streak = gameStore.killStreak

    let points = SCORING_CONFIG.BASE_POINTS
    const milestone = SCORING_CONFIG.SPREE_MILESTONES.find(entry => entry.streak === streak)
    if (milestone) {
      points += milestone.bonus
      pushPopup(`${milestone.label} +${milestone.bonus}`, points)
    }
    gameStore.addScore(points)
  }

  const registerKill = (level: number) => {
    const now = Date.now()
    switch (level) {
      case 2:
        registerComboKill(now)
        return
      case 3:
        registerMultiKill(now)
        return
      case 4:
        registerSpreeKill()
        return
      default:
        gameStore.addScore(SCORING_CONFIG.BASE_POINTS)
    }
  }

  const resetForLevel = (level: number) => {
    gameStore.resetScoringForLevel()
    if (level === 5) {
      gameStore.startLevelTimer()
    }
  }

  // Level 5 - speed bonus for reaching the portal before par time
  const awardSpeedBonus = (level: number): number => {
    if (level !== 5 || gameStore.levelStartTime === null) {
      return 0
    }

    const elapsed = Date.now() - gameStore.levelStartTime
    const remaining = Math.max(0, SCORING_CONFIG.LEVEL_5_PAR_TIME_MS - elapsed)
    const bonus = Math.floor(remaining * SCORING_CONFIG.SPEED_BONUS_POINTS_PER_MS)

    gameStore.levelStartTime = null
    gameStore.levelElapsed = elapsed

    if (bonus > 0) {
      gameStore.addScore(bonus)
      pushPopup(`SPEED BONUS +${bonus}`, bonus)
    }
    return bonus
  }

  // Keeps the live level timer in the HUD up to date
  const tickTimer = () => {
    if (gameStore.levelStartTime === null) return
    gameStore.levelElapsed = Date.now() - gameStore.levelStartTime
  }

  return {
    registerKill,
    resetForLevel,
    awardSpeedBonus,
    tickTimer
  }
}
