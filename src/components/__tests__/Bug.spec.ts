import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import Bug from '../Bug.vue'

describe('Bug', () => {
  it('renders bug component', () => {
    const pinia = createPinia()
    const wrapper = mount(Bug, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})