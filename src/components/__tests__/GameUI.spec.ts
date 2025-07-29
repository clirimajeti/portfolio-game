import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameUI from '../GameUI.vue'

describe('GameUI', () => {
  it('displays correct level', () => {
    const wrapper = mount(GameUI, {
      props: { level: 3 }
    })
    
    expect(wrapper.text()).toContain('Level: 3 / 5')
  })

  it('shows control instructions', () => {
    const wrapper = mount(GameUI, {
      props: { level: 1 }
    })
    
    expect(wrapper.text()).toContain('Use ← → ↑ ↓ keys to move')
    expect(wrapper.text()).toContain('Press Space to throw coffee')
  })

  it('updates level when prop changes', async () => {
    const wrapper = mount(GameUI, {
      props: { level: 1 }
    })
    
    await wrapper.setProps({ level: 4 })
    
    expect(wrapper.text()).toContain('Level: 4 / 5')
  })
})