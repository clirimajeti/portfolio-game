import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import Coffee from '../Coffee.vue'

describe('Coffee', () => {
  it('renders coffee component', () => {
    const pinia = createPinia()
    const wrapper = mount(Coffee, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})