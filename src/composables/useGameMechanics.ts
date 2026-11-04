import { computed, watch, type Ref } from 'vue'
import type { Position, CoffeeProjectile } from '../types'
import { GAME_CONFIG } from '../constants'
import { useGameStore } from '../stores/gameStore'
import { useScoringSystem } from './useScoringSystem'

export function useGameMechanics(currentLevel?: Ref<number>) {
  const gameStore = useGameStore()
  const scoring = useScoringSystem()

  // Access store state and actions directly instead of destructuring
  const coffeeProjectiles = computed(() => gameStore.coffeeProjectiles)
  const bugEnemies = computed(() => gameStore.bugEnemies)
  const coffeeSplashes = computed(() => gameStore.coffeeSplashes)
  const score = computed(() => gameStore.score)
  const isThrowingCoffee = computed(() => gameStore.isThrowingCoffee)
  const totalBugsSpawned = computed(() => gameStore.totalBugsSpawned)
  const isPortalActive = computed(() => gameStore.isPortalActive)
  const addCoffeeProjectile = gameStore.addCoffeeProjectile
  const removeCoffeeProjectile = gameStore.removeCoffeeProjectile
  const updateCoffeeProjectile = gameStore.updateCoffeeProjectile
  const addBugEnemy = gameStore.addBugEnemy
  const removeBugEnemy = gameStore.removeBugEnemy
  const updateBugEnemy = gameStore.updateBugEnemy
  const addCoffeeSplash = gameStore.addCoffeeSplash
  const removeCoffeeSplash = gameStore.removeCoffeeSplash
  const setThrowingCoffee = gameStore.setThrowingCoffee
  const setPortalActive = gameStore.setPortalActive
  const resetLevel = gameStore.resetLevel


  const throwCoffee = (playerPosition: Position, facingDirection: 'left' | 'right' = 'right') => {
    if (isThrowingCoffee.value) {
      return
    }

    setThrowingCoffee(true)

    // One mug, or three in a row with the rapid_fire console cheat
    const mugs = gameStore.rapidFire ? 3 : 1
    for (let i = 0; i < mugs; i++) {
      setTimeout(() => {
        addCoffeeProjectile({
          position: { x: playerPosition.x + 35, y: playerPosition.y + 20 },
          velocity: { x: facingDirection === 'right' ? 8 : -8, y: 0 },
          rotation: 0
        })
      }, 50 + i * 150)
    }

    // Reset throwing state after animation - increased duration to see the animation
    setTimeout(() => {
      setThrowingCoffee(false)
    }, 1000) // Increased from 500ms to 1000ms
  }

  const spawnBug = () => {
    // Progressive speed based on level
    const level = currentLevel?.value || 1
    const baseSpeed = getBugSpeedForLevel(level)

    addBugEnemy({
      position: {
        x: Math.random() * (window.innerWidth - GAME_CONFIG.BUG_SIZE),
        y: Math.random() * (window.innerHeight - 100) + 50
      },
      velocity: {
        x: (Math.random() - 0.5) * baseSpeed,
        y: (Math.random() - 0.5) * baseSpeed
      },
      isHit: false
    })
  }

  const getBugSpeedForLevel = (level: number): number => {
    // Level 1: Very slow (0.5x), Level 2: Slow (0.8x), Level 3+: Progressive increase
    switch (level) {
      case 1: return 1.0  // Very slow for first level
      case 2: return 1.6  // Slightly faster
      case 3: return 2.0  // Normal speed
      case 4: return 2.4  // Faster
      case 5: return 2.8  // Very fast
      default: return Math.min(3.0 + (level - 5) * 0.2, 4.0) // Cap at 4.0 speed
    }
  }

  const   updateCoffeeProjectiles = () => {
    // Track coffee projectiles to remove after collision
    const coffeesToRemove: number[] = []

    // Check if coffeeProjectiles exists and has values
    if (!coffeeProjectiles.value || !Array.isArray(coffeeProjectiles.value)) {
      return
    }

    // COLLISION FIX: Calculate new positions for all coffee projectiles WITHOUT updating them yet
    // This prevents visual/collision desync and tunneling issues
    const coffeeUpdates = coffeeProjectiles.value.map(coffee => ({
      id: coffee.id,
      currentPosition: coffee.position,
      newPosition: {
        x: coffee.position.x + coffee.velocity.x,
        y: coffee.position.y + coffee.velocity.y
      },
      newRotation: coffee.rotation + 15
    }))

    coffeeUpdates.forEach(update => {
      // Check collision with bugs using new coffee position and current bug positions
      const wasCollision = checkImprovedCollision(update, bugEnemies.value)
      if (wasCollision) {
        coffeesToRemove.push(update.id)
      }

      // Remove coffee projectiles that are off screen
      if (update.newPosition.x >= window.innerWidth + 50 || update.newPosition.x <= -50) {
        coffeesToRemove.push(update.id)
      }
    })

    // Now update all coffee positions that weren't removed
    coffeeUpdates.forEach(update => {
      if (!coffeesToRemove.includes(update.id)) {
        updateCoffeeProjectile(update.id, {
          position: update.newPosition,
          rotation: update.newRotation
        })
      }
    })

    // Remove collided or off-screen coffee projectiles
    coffeesToRemove.forEach(coffeeId => {
      removeCoffeeProjectile(coffeeId)
    })
  }

  const updateBugEnemies = () => {
    // Check if bugEnemies exists and has values
    if (!bugEnemies.value || !Array.isArray(bugEnemies.value)) {
      return
    }

    bugEnemies.value.forEach(bug => {
      if (bug.isHit) return

      // Calculate new position
      let newX = bug.position.x + bug.velocity.x
      let newY = bug.position.y + bug.velocity.y
      let newVelX = bug.velocity.x
      let newVelY = bug.velocity.y

      // Bounce off walls
      if (newX <= 0 || newX >= window.innerWidth - GAME_CONFIG.BUG_SIZE) {
        newVelX *= -1
      }
      if (newY <= 0 || newY >= window.innerHeight - GAME_CONFIG.BUG_SIZE) {
        newVelY *= -1
      }

      // Keep bugs within bounds
      newX = Math.max(0, Math.min(window.innerWidth - GAME_CONFIG.BUG_SIZE, newX))
      newY = Math.max(0, Math.min(window.innerHeight - GAME_CONFIG.BUG_SIZE, newY))

      // Update position and velocity using store action to ensure reactivity
      updateBugEnemy(bug.id, {
        position: { x: newX, y: newY },
        velocity: { x: newVelX, y: newVelY }
      })
    })
  }

  // Improved collision detection with larger collision boxes and better positioning
  const checkImprovedCollision = (coffeeUpdate: any, bugs: any[]): boolean => {
    if (!bugs || !Array.isArray(bugs)) {
      return false
    }

    // Use collision-specific sizes to prevent tunneling
    const coffeeSize = GAME_CONFIG.COFFEE_COLLISION_SIZE
    const bugSize = GAME_CONFIG.BUG_COLLISION_SIZE

    // Collision boxes are centered on the visuals so the margin applies on every side
    const coffeeOffset = (coffeeSize - GAME_CONFIG.COFFEE_SIZE) / 2
    const bugOffset = (bugSize - GAME_CONFIG.BUG_SIZE) / 2

    const coffeeLeft = coffeeUpdate.newPosition.x - coffeeOffset
    const coffeeRight = coffeeLeft + coffeeSize
    const coffeeTop = coffeeUpdate.newPosition.y - coffeeOffset
    const coffeeBottom = coffeeTop + coffeeSize
    const coffeeCenterX = coffeeLeft + coffeeSize / 2
    const coffeeCenterY = coffeeTop + coffeeSize / 2

    for (const bug of bugs) {
      if (bug.isHit) continue

      // Use current bug position (they haven't moved yet in this frame)
      const bugLeft = bug.position.x - bugOffset
      const bugRight = bugLeft + bugSize
      const bugTop = bug.position.y - bugOffset
      const bugBottom = bugTop + bugSize

      // AABB collision detection with larger collision boxes
      const isColliding = (
        coffeeLeft < bugRight &&
        coffeeRight > bugLeft &&
        coffeeTop < bugBottom &&
        coffeeBottom > bugTop
      )

      if (isColliding) {

        // Mark bug as hit using store action
        updateBugEnemy(bug.id, { isHit: true })
        setTimeout(() => removeBugEnemy(bug.id), 500)

        // Add score using the current page's scoring style
        scoring.registerKill(currentLevel?.value || 1)

        // Create splash effect at collision center
        const splashId = addCoffeeSplash({
          position: {
            x: coffeeCenterX - 20,
            y: coffeeCenterY - 20
          }
        })

        // Auto-remove splash after animation
        setTimeout(() => removeCoffeeSplash(splashId), 800)

        return true // Collision detected, stop checking other bugs
      }
    }

    return false // No collision detected
  }

  // Keep the old function for backwards compatibility but mark as deprecated
  const checkCoffeeCollisionAtPosition = (coffee: CoffeeProjectile, position: Position): boolean => {
    // This function is now deprecated - use checkImprovedCollision instead
    return checkImprovedCollision(
      { newPosition: position, id: coffee.id },
      bugEnemies.value || []
    )
  }

  const checkCollisions = () => {
    // Collision detection is now handled in updateCoffeeProjectiles for continuous detection
  }

  const removeSplash = (splashId: number) => {
    removeCoffeeSplash(splashId)
  }

  const checkPortalStatus = () => {
    // Check if bugEnemies exists and has values
    if (!bugEnemies.value || !Array.isArray(bugEnemies.value)) {
      return
    }

    // Activate portal if all bugs are killed and we've spawned the max for this level
    const maxBugs = getMaxBugsForLevel(currentLevel?.value || 1)
    const allBugsSpawned = totalBugsSpawned.value >= maxBugs
    const allBugsKilled = bugEnemies.value.length === 0
    const shouldActivate = allBugsSpawned && allBugsKilled
    const wasActive = isPortalActive.value

    setPortalActive(shouldActivate)

    // Once the objective is cleared on the final level, bank the speed bonus and
    // freeze the timer so walking to the portal doesn't keep draining it.
    if (shouldActivate && !wasActive && (currentLevel?.value || 1) === 5) {
      scoring.awardSpeedBonus(5)
    }
  }


  const gameLoop = () => {
    updateCoffeeProjectiles()
    updateBugEnemies()
    checkCollisions()
    checkPortalStatus()
    scoring.tickTimer()
  }

  const getMaxBugsForLevel = (level: number) => {
    switch (level) {
      case 1: return GAME_CONFIG.MAX_BUGS_LEVEL_1 // 2 bugs for section 1
      case 2: return GAME_CONFIG.MAX_BUGS_LEVEL_2 // 3 bugs for section 2
      case 3: return GAME_CONFIG.MAX_BUGS_LEVEL_3 // 4 bugs for section 3
      case 4: return GAME_CONFIG.MAX_BUGS_LEVEL_4 // 5 bugs for section 4
      default: return 5 // Default for any additional levels
    }
  }

  // Reset bug count when level changes
  if (currentLevel) {
    watch(currentLevel, (newLevel) => {
      resetLevel()
      scoring.resetForLevel(newLevel)

      // Spawn initial bugs for the new level after a short delay
      setTimeout(() => {
        const maxBugs = getMaxBugsForLevel(newLevel)
        for (let i = 0; i < Math.min(maxBugs, 1); i++) {
          spawnBug()
        }
      }, 500)
    })
  }

  // Auto-spawn bugs periodically, but only up to the max for this level (don't replace killed bugs)
  const bugSpawnInterval = setInterval(() => {
    if (!totalBugsSpawned.value || !bugEnemies.value) return

    const maxBugs = getMaxBugsForLevel(currentLevel?.value || 1)
    if (totalBugsSpawned.value < maxBugs) {
      spawnBug()
    }
  }, 3000)

  // Initial bug spawn to start the game
  setTimeout(() => {
    const maxBugs = getMaxBugsForLevel(currentLevel?.value || 1)
    for (let i = 0; i < Math.min(maxBugs, 1); i++) {
      spawnBug()
    }
  }, 1000)

  const checkPortalCollision = (playerPosition: Position) => {
    if (!isPortalActive.value) return false

    // Check collision with portal in current section
    // Portal is positioned at bottom: 50px, right: 100px with 80px size
    const portalLeft = window.innerWidth - 180 // right: 100px + 80px width
    const portalRight = window.innerWidth - 100
    const portalTop = window.innerHeight - 130 // bottom: 50px + 80px height
    const portalBottom = window.innerHeight - 50

    const playerSize = GAME_CONFIG.CHARACTER_SIZE
    const playerLeft = playerPosition.x
    const playerRight = playerPosition.x + playerSize
    const playerTop = playerPosition.y
    const playerBottom = playerPosition.y + playerSize

    // Check if player overlaps with portal
    const isColliding = (
      playerLeft < portalRight &&
      playerRight > portalLeft &&
      playerTop < portalBottom &&
      playerBottom > portalTop
    )


    return isColliding
  }

  return {
    coffeeProjectiles: computed(() => coffeeProjectiles.value),
    bugEnemies: computed(() => bugEnemies.value),
    coffeeSplashes: computed(() => coffeeSplashes.value),
    score: computed(() => score.value),
    isThrowingCoffee: computed(() => isThrowingCoffee.value),
    isPortalActive: computed(() => isPortalActive.value),
    throwCoffee,
    spawnBug,
    gameLoop,
    removeSplash,
    checkPortalCollision,
    awardSpeedBonus: scoring.awardSpeedBonus
  }
}
