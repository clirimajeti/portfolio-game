import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Coffee from '../Coffee.vue'

describe('Coffee', () => {
  it('renders coffee projectile with correct position', () => {
    const position = { x: 100, y: 200 }
    const wrapper = mount(Coffee, {
      props: { position }
    })
    
    const coffee = wrapper.find('.coffee-projectile')
    expect(coffee.exists()).toBe(true)
    expect(coffee.attributes('style')).toContain('left: 100px')
    expect(coffee.attributes('style')).toContain('top: 200px')
  })

  it('applies rotation when provided', () => {
    const position = { x: 0, y: 0 }
    const rotation = 45
    const wrapper = mount(Coffee, {
      props: { position, rotation }
    })
    
    const coffee = wrapper.find('.coffee-projectile')
    expect(coffee.attributes('style')).toContain('rotate(45deg)')
  })

  it('updates position when props change', async () => {
    const position = { x: 50, y: 100 }
    const wrapper = mount(Coffee, {
      props: { position }
    })
    
    await wrapper.setProps({ position: { x: 150, y: 250 } })
    
    const coffee = wrapper.find('.coffee-projectile')
    expect(coffee.attributes('style')).toContain('left: 150px')
    expect(coffee.attributes('style')).toContain('top: 250px')
  })
})