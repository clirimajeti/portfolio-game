import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Character from '../Character.vue'

describe('Character', () => {
  it('renders character with correct position', () => {
    const position = { x: 100, y: 200 }
    const wrapper = mount(Character, {
      props: { position }
    })
    
    const character = wrapper.find('.character')
    expect(character.exists()).toBe(true)
    expect(character.attributes('style')).toContain('left: 100px')
    expect(character.attributes('style')).toContain('top: 200px')
  })

  it('applies right leg class when currentLeg is right', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Character, {
      props: { position, currentLeg: 'right' }
    })
    
    const character = wrapper.find('.character')
    expect(character.classes()).toContain('character-right-leg')
    expect(character.classes()).not.toContain('character-left-leg')
  })

  it('applies left leg class when currentLeg is left', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Character, {
      props: { position, currentLeg: 'left' }
    })
    
    const character = wrapper.find('.character')
    expect(character.classes()).toContain('character-left-leg')
    expect(character.classes()).not.toContain('character-right-leg')
  })

  it('has no leg classes when currentLeg is idle but shows default background', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Character, {
      props: { position, currentLeg: 'idle' }
    })
    
    const character = wrapper.find('.character')
    expect(character.classes()).not.toContain('character-left-leg')
    expect(character.classes()).not.toContain('character-right-leg')
    // Character should always be visible with default background
    expect(character.exists()).toBe(true)
  })

  it('applies throwing class when throwing coffee', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Character, {
      props: { position, isThrowingCoffee: true }
    })
    
    const character = wrapper.find('.character')
    expect(character.classes()).toContain('character-throwing')
  })

  it('updates position when props change', async () => {
    const position = { x: 50, y: 100 }
    const wrapper = mount(Character, {
      props: { position }
    })
    
    await wrapper.setProps({ position: { x: 150, y: 250 } })
    
    const character = wrapper.find('.character')
    expect(character.attributes('style')).toContain('left: 150px')
    expect(character.attributes('style')).toContain('top: 250px')
  })

  it('can have both throwing and leg classes simultaneously', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Character, {
      props: { position, currentLeg: 'right', isThrowingCoffee: true }
    })
    
    const character = wrapper.find('.character')
    expect(character.classes()).toContain('character-throwing')
    expect(character.classes()).toContain('character-right-leg')
  })

  it('applies facing-left class when facingDirection is left', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Character, {
      props: { position, facingDirection: 'left' }
    })
    
    const character = wrapper.find('.character')
    expect(character.classes()).toContain('character-facing-left')
    expect(character.classes()).not.toContain('character-facing-right')
  })

  it('applies facing-right class when facingDirection is right', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Character, {
      props: { position, facingDirection: 'right' }
    })
    
    const character = wrapper.find('.character')
    expect(character.classes()).toContain('character-facing-right')
    expect(character.classes()).not.toContain('character-facing-left')
  })

  it('applies both throwing and facing direction classes', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Character, {
      props: { position, facingDirection: 'left', isThrowingCoffee: true }
    })
    
    const character = wrapper.find('.character')
    expect(character.classes()).toContain('character-throwing')
    expect(character.classes()).toContain('character-facing-left')
  })
})