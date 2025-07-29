import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Position, CoffeeProjectile, BugEnemy, CoffeeSplash } from '../types'

export const useGameStore = defineStore('game', () => {
  // Game state
  const coffeeProjectiles = ref<CoffeeProjectile[]>([])
  const bugEnemies = ref<BugEnemy[]>([])
  const coffeeSplashes = ref<CoffeeSplash[]>([])
  const score = ref(0)
  const isThrowingCoffee = ref(false)
  const totalBugsSpawned = ref(0)
  const isPortalActive = ref(false)
  
  // ID counters
  let nextCoffeeId = 1
  let nextBugId = 1
  let nextSplashId = 1

  // Actions
  const addCoffeeProjectile = (coffee: Omit<CoffeeProjectile, 'id'>) => {
    const newCoffee = {
      ...coffee,
      id: nextCoffeeId++
    }
    coffeeProjectiles.value.push(newCoffee)
  }

  const removeCoffeeProjectile = (id: number) => {
    const index = coffeeProjectiles.value.findIndex(c => c.id === id)
    if (index > -1) {
      coffeeProjectiles.value.splice(index, 1)
    }
  }

  const updateCoffeeProjectile = (id: number, updates: Partial<CoffeeProjectile>) => {
    const coffee = coffeeProjectiles.value.find(c => c.id === id)
    if (coffee) {
      Object.assign(coffee, updates)
    }
  }

  const addBugEnemy = (bug: Omit<BugEnemy, 'id'>) => {
    bugEnemies.value.push({
      ...bug,
      id: nextBugId++
    })
    totalBugsSpawned.value++
  }

  const removeBugEnemy = (id: number) => {
    const index = bugEnemies.value.findIndex(b => b.id === id)
    if (index > -1) {
      bugEnemies.value.splice(index, 1)
    }
  }

  const updateBugEnemy = (id: number, updates: Partial<BugEnemy>) => {
    const bug = bugEnemies.value.find(b => b.id === id)
    if (bug) {
      Object.assign(bug, updates)
    }
  }

  const addCoffeeSplash = (splash: Omit<CoffeeSplash, 'id'>) => {
    coffeeSplashes.value.push({
      ...splash,
      id: nextSplashId++
    })
  }

  const removeCoffeeSplash = (id: number) => {
    const index = coffeeSplashes.value.findIndex(s => s.id === id)
    if (index > -1) {
      coffeeSplashes.value.splice(index, 1)
    }
  }

  const addScore = (points: number) => {
    score.value += points
  }

  const setThrowingCoffee = (throwing: boolean) => {
    isThrowingCoffee.value = throwing
  }

  const setPortalActive = (active: boolean) => {
    isPortalActive.value = active
  }

  const resetLevel = () => {
    totalBugsSpawned.value = 0
    bugEnemies.value = []
    coffeeProjectiles.value = []
    coffeeSplashes.value = []
    isPortalActive.value = false
    isThrowingCoffee.value = false
  }

  const clearAllProjectiles = () => {
    coffeeProjectiles.value = []
  }

  const clearAllBugs = () => {
    bugEnemies.value = []
  }

  // Getters
  const getCoffeeProjectileById = computed(() => (id: number) => 
    coffeeProjectiles.value.find(c => c.id === id)
  )

  const getBugEnemyById = computed(() => (id: number) => 
    bugEnemies.value.find(b => b.id === id)
  )

  const activeBugs = computed(() => 
    bugEnemies.value.filter(b => !b.isHit)
  )

  const hitBugs = computed(() => 
    bugEnemies.value.filter(b => b.isHit)
  )

  const storeReturn = {
    // State - return reactive refs directly
    coffeeProjectiles,
    bugEnemies,
    coffeeSplashes,
    score,
    isThrowingCoffee,
    totalBugsSpawned,
    isPortalActive,
    
    // Actions
    addCoffeeProjectile,
    removeCoffeeProjectile,
    updateCoffeeProjectile,
    addBugEnemy,
    removeBugEnemy,
    updateBugEnemy,
    addCoffeeSplash,
    removeCoffeeSplash,
    addScore,
    setThrowingCoffee,
    setPortalActive,
    resetLevel,
    clearAllProjectiles,
    clearAllBugs,
    
    // Getters
    getCoffeeProjectileById,
    getBugEnemyById,
    activeBugs,
    hitBugs
  }
  
  return storeReturn
})