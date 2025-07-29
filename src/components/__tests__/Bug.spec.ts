import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Bug from '../Bug.vue'

describe('Bug', () => {
  it('renders bug enemy with correct position', () => {
    const position = { x: 100, y: 200 }
    const wrapper = mount(Bug, {
      props: { position }
    })
    
    const bug = wrapper.find('.bug-enemy')
    expect(bug.exists()).toBe(true)
    expect(bug.attributes('style')).toContain('left: 100px')
    expect(bug.attributes('style')).toContain('top: 200px')
  })

  it('applies hit animation when hit', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Bug, {
      props: { position, isHit: true }
    })
    
    const bug = wrapper.find('.bug-enemy')
    expect(bug.classes()).toContain('hit')
  })

  it('does not apply hit class when not hit', () => {
    const position = { x: 0, y: 0 }
    const wrapper = mount(Bug, {
      props: { position, isHit: false }
    })
    
    const bug = wrapper.find('.bug-enemy')
    expect(bug.classes()).not.toContain('hit')
  })

  it('updates position when props change', async () => {
    const position = { x: 50, y: 100 }
    const wrapper = mount(Bug, {
      props: { position }
    })
    
    await wrapper.setProps({ position: { x: 150, y: 250 } })
    
    const bug = wrapper.find('.bug-enemy')
    expect(bug.attributes('style')).toContain('left: 150px')
    expect(bug.attributes('style')).toContain('top: 250px')
  })
})