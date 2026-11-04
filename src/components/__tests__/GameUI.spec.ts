import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import GameUI from '../GameUI.vue'

const global = { plugins: [createPinia()] }

describe('GameUI', () => {
  it('displays correct level', () => {
    const wrapper = mount(GameUI, {
      props: { level: 3 },
      global
    })
    
    expect(wrapper.text()).toContain('Level: 3 / 5')
  })

  it('shows control instructions', () => {
    const wrapper = mount(GameUI, {
      props: { level: 1 },
      global
    })
    
    expect(wrapper.text()).toContain('Use ← → ↑ ↓ keys to move')
    expect(wrapper.text()).toContain('Press Space to throw coffee')
  })

  it('updates level when prop changes', async () => {
    const wrapper = mount(GameUI, {
      props: { level: 1 },
      global
    })
    
    await wrapper.setProps({ level: 4 })
    
    expect(wrapper.text()).toContain('Level: 4 / 5')
  })

  it('opens the console with the backquote key and runs cl_level', async () => {
    const wrapper = mount(GameUI, { props: { level: 1 }, global, attachTo: document.body })

    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Backquote', key: 'Dead' }))
    await wrapper.vm.$nextTick()

    const input = wrapper.get('#dev-console-input')
    await input.setValue('cl_level 3')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('goToLevel')).toEqual([[3]])
    expect(wrapper.get('[role=log]').text()).toContain('] cl_level 3')
    wrapper.unmount()
  })
})
