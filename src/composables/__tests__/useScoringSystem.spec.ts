import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useScoringSystem } from '../useScoringSystem'
import { useGameStore } from '../../stores/gameStore'
import { SCORING_CONFIG } from '../../constants'

describe('useScoringSystem', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })
  afterEach(() => vi.useRealTimers())

  it('level 1 awards the flat base points per kill', () => {
    const store = useGameStore()
    const { registerKill } = useScoringSystem()

    registerKill(1)
    registerKill(1)

    expect(store.score).toBe(SCORING_CONFIG.BASE_POINTS * 2)
    expect(store.scoringEvents).toHaveLength(0)
  })

  it('level 2 raises the combo multiplier for consecutive fast kills', () => {
    const store = useGameStore()
    const { registerKill } = useScoringSystem()

    registerKill(2)
    expect(store.score).toBe(10)
    expect(store.currentMultiplier).toBe(1)

    vi.setSystemTime(1000)
    registerKill(2)
    expect(store.currentMultiplier).toBe(2)
    expect(store.score).toBe(30)

    vi.setSystemTime(2000)
    registerKill(2)
    expect(store.currentMultiplier).toBe(3)
    expect(store.score).toBe(60)
  })

  it('level 2 resets the combo after the window expires', () => {
    const store = useGameStore()
    const { registerKill } = useScoringSystem()

    registerKill(2)
    vi.setSystemTime(SCORING_CONFIG.COMBO_WINDOW_MS + 1)
    registerKill(2)

    expect(store.currentMultiplier).toBe(1)
    expect(store.score).toBe(20)
  })

  it('level 3 awards multi-kill bonuses while chaining inside the window', () => {
    const store = useGameStore()
    const { registerKill } = useScoringSystem()

    registerKill(3)
    expect(store.score).toBe(10)

    vi.setSystemTime(1000)
    registerKill(3)
    expect(store.multiKillChain).toBe(2)
    expect(store.score).toBe(10 + 10 + 20)

    vi.setSystemTime(2000)
    registerKill(3)
    expect(store.multiKillChain).toBe(3)
    expect(store.score).toBe(40 + 10 + 30)
  })

  it('level 3 breaks the chain when the window expires', () => {
    const store = useGameStore()
    const { registerKill } = useScoringSystem()

    registerKill(3)
    vi.setSystemTime(SCORING_CONFIG.MULTI_KILL_DEFAULT_WINDOW_MS + 1)
    registerKill(3)

    expect(store.multiKillChain).toBe(1)
    expect(store.score).toBe(20)
  })

  it('level 4 awards killing spree milestone bonuses', () => {
    const store = useGameStore()
    const { registerKill } = useScoringSystem()

    registerKill(4)
    registerKill(4)
    registerKill(4)

    expect(store.killStreak).toBe(3)
    expect(store.score).toBe(10 + 10 + 10 + 50)
  })

  it('level 5 awards a speed bonus based on remaining par time', () => {
    const store = useGameStore()
    const { resetForLevel, awardSpeedBonus } = useScoringSystem()

    resetForLevel(5)
    vi.setSystemTime(5000)

    const bonus = awardSpeedBonus(5)
    const expected = Math.floor(
      (SCORING_CONFIG.LEVEL_5_PAR_TIME_MS - 5000) * SCORING_CONFIG.SPEED_BONUS_POINTS_PER_MS,
    )

    expect(bonus).toBe(expected)
    expect(store.score).toBe(expected)
  })

  it('level 5 clamps the speed bonus at zero after par time', () => {
    const store = useGameStore()
    const { resetForLevel, awardSpeedBonus } = useScoringSystem()

    resetForLevel(5)
    vi.setSystemTime(SCORING_CONFIG.LEVEL_5_PAR_TIME_MS + 10000)

    expect(awardSpeedBonus(5)).toBe(0)
    expect(store.score).toBe(0)
  })

  it('does not award the speed bonus twice', () => {
    const { resetForLevel, awardSpeedBonus } = useScoringSystem()

    resetForLevel(5)
    vi.setSystemTime(1000)
    awardSpeedBonus(5)

    expect(awardSpeedBonus(5)).toBe(0)
  })
})
