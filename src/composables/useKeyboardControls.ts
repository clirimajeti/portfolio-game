import { reactive, ref, onMounted, onUnmounted } from 'vue'
import type { Position } from '../types'
import { GAME_CONFIG } from '../constants'

export function useKeyboardControls(
  initialPosition: Position = { x: 0, y: 0 },
  onThrowCoffee?: () => void,
  onPortalCollision?: (position: Position) => boolean
) {
  const position = reactive<Position>({ ...initialPosition })
  const isMoving = ref(false)
  const currentLeg = ref<'right' | 'left' | 'idle'>('idle')
  const facingDirection = ref<'right' | 'left'>('right') // Default facing right
  let movementTimeout: number | null = null
  let movementInterval: number | null = null
  let legSwitchTimer = 0
  const keysPressed = ref(new Set<string>())
  const collidedCards = ref(new Set<HTMLElement>())

  const handleKeyDown = (event: KeyboardEvent) => {
    const wasEmpty = keysPressed.value.size === 0
    keysPressed.value.add(event.key)
    
    // Start continuous movement if this is the first movement key
    if (wasEmpty && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      startMovement()
    }
    
    if (event.key === ' ') {
      event.preventDefault()
      console.log('Space key pressed - throwing coffee')
      if (onThrowCoffee) {
        onThrowCoffee()
      } else {
        console.log('onThrowCoffee is not defined!')
      }
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed.value.delete(event.key)
    
    // If no movement keys are pressed, stop moving
    const movementKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    const hasMovementKeys = movementKeys.some(key => keysPressed.value.has(key))
    
    if (!hasMovementKeys) {
      stopMovement()
    }
  }

  const startMovement = () => {
    if (movementInterval) return // Already moving
    
    isMoving.value = true
    legSwitchTimer = 0
    
    // Start smooth continuous movement at 60 FPS
    movementInterval = window.setInterval(() => {
      updatePosition()
    }, 1000 / 60)
  }

  const stopMovement = () => {
    if (movementInterval) {
      clearInterval(movementInterval)
      movementInterval = null
    }
    
    isMoving.value = false
    if (movementTimeout) {
      clearTimeout(movementTimeout)
    }
    movementTimeout = window.setTimeout(() => {
      currentLeg.value = 'idle'
    }, 300)
  }

  const updatePosition = () => {
    const speed = GAME_CONFIG.CHARACTER_SPEED / 3 // Smoother movement with smaller steps
    let deltaX = 0
    let deltaY = 0
    let moved = false
    
    // Calculate movement deltas based on pressed keys
    if (keysPressed.value.has('ArrowLeft')) {
      deltaX -= speed
      facingDirection.value = 'left'
      moved = true
    }
    if (keysPressed.value.has('ArrowRight')) {
      deltaX += speed
      facingDirection.value = 'right'
      moved = true
    }
    if (keysPressed.value.has('ArrowUp')) {
      deltaY -= speed
      moved = true
    }
    if (keysPressed.value.has('ArrowDown')) {
      deltaY += speed
      moved = true
    }

    // Apply diagonal movement normalization for consistent speed
    if (deltaX !== 0 && deltaY !== 0) {
      // Normalize diagonal movement to maintain consistent speed
      const normalizer = Math.sqrt(2) / 2
      deltaX *= normalizer
      deltaY *= normalizer
    }

    // Update position with bounds checking
    if (moved) {
      position.x = Math.max(0, Math.min(window.innerWidth - GAME_CONFIG.CHARACTER_SIZE, position.x + deltaX))
      position.y = Math.max(0, Math.min(window.innerHeight - GAME_CONFIG.CHARACTER_SIZE, position.y + deltaY))
      
      // Check for portal collision after movement
      if (onPortalCollision && onPortalCollision(position)) {
        // Player walked through active portal - this will be handled by the parent component
      }
      
      // Check for card collisions
      checkCardCollisions()
      
      // Switch legs periodically for walking animation (every 10 frames = ~6 times per second)
      legSwitchTimer++
      if (legSwitchTimer >= 10) {
        currentLeg.value = currentLeg.value === 'right' ? 'left' : 'right'
        legSwitchTimer = 0
      }
    }
  }

  let collisionCheckCounter = 0
  const checkCardCollisions = () => {
    // Reduce collision detection frequency further to prevent frame drops
    collisionCheckCounter++
    
    // Check for project cards (section 4) less frequently
    const projectCards = document.querySelectorAll('.game-project-card')
    const isInProjectsSection = projectCards.length > 0
    
    // Only check collisions every 5th frame for projects section, 3rd frame for others
    const frameSkip = isInProjectsSection ? 5 : 3
    if (collisionCheckCounter % frameSkip !== 0) return
    
    // Find all interactive cards and elements on the page
    const cards = document.querySelectorAll('.stat-card, .skill-category, .game-project-card, .game-instructions, .about-text')
    
    cards.forEach((card) => {
      const cardElement = card as HTMLElement
      
      // Skip if already processing this card
      if (collidedCards.value.has(cardElement)) return
      
      const cardRect = cardElement.getBoundingClientRect()
      
      // Get character bounds
      const characterRect = {
        left: position.x,
        right: position.x + GAME_CONFIG.CHARACTER_SIZE,
        top: position.y,
        bottom: position.y + GAME_CONFIG.CHARACTER_SIZE
      }
      
      // Check if character overlaps with this card
      const isColliding = (
        characterRect.left < cardRect.right &&
        characterRect.right > cardRect.left &&
        characterRect.top < cardRect.bottom &&
        characterRect.bottom > cardRect.top
      )
      
      if (isColliding) {
        // Trigger hover effect
        cardElement.dispatchEvent(new CustomEvent('hero-collision'))
        
        // Add to collided set to prevent spam
        collidedCards.value.add(cardElement)
        
        // Longer delay for project cards to reduce frequency
        const collisionTimeout = isInProjectsSection ? 1000 : 800
        setTimeout(() => {
          collidedCards.value.delete(cardElement)
        }, collisionTimeout)
      }
    })
  }

  onMounted(() => {
    position.x = initialPosition.x || 100
    position.y = initialPosition.y || window.innerHeight - 150
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    if (movementTimeout) {
      clearTimeout(movementTimeout)
    }
    if (movementInterval) {
      clearInterval(movementInterval)
    }
  })

  return {
    position,
    isMoving,
    currentLeg,
    facingDirection
  }
}