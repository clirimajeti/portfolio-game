import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameMechanics } from '../useGameMechanics'
import { useGameStore } from '../../stores/gameStore'

describe('useGameMechanics collision', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('scores a coffee that clips the top-left edge of the bug', () => {
    setActivePinia(createPinia())
    const store = useGameStore()
    const { gameLoop } = useGameMechanics()

    // Bug drawn at 100..145. The coffee ends at 75..95, but its spin (up to 4px) and
    // the bug's crawl rotate/scale (about 3px) make the two sprites visibly touch.
    store.addBugEnemy({ position: { x: 100, y: 100 }, velocity: { x: 0, y: 0 }, isHit: false })
    store.addCoffeeProjectile({ position: { x: 67, y: 75 }, velocity: { x: 8, y: 0 }, rotation: 0 })

    gameLoop()

    expect(store.score).toBe(10)
  })

  it('throws 3 mugs in a row with rapid_fire, 1 without', () => {
    setActivePinia(createPinia())
    const store = useGameStore()
    const { throwCoffee } = useGameMechanics()

    throwCoffee({ x: 0, y: 0 })
    vi.advanceTimersByTime(1000)
    expect(store.coffeeProjectiles).toHaveLength(1)

    store.coffeeProjectiles.splice(0)
    store.setRapidFire(true)
    throwCoffee({ x: 0, y: 0 })
    vi.advanceTimersByTime(1000)
    expect(store.coffeeProjectiles).toHaveLength(3)
  })
})
