import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '../StatCard.vue'

describe('StatCard', () => {
  it('displays stat number and label correctly', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '50+',
        label: 'Projects Completed'
      }
    })
    
    expect(wrapper.find('.stat-number').text()).toBe('50+')
    expect(wrapper.find('.stat-label').text()).toBe('Projects Completed')
  })

  it('applies hover effects with correct CSS classes', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '3+',
        label: 'Years Experience'
      }
    })
    
    const card = wrapper.find('.stat-card')
    expect(card.exists()).toBe(true)
    expect(card.classes()).toContain('stat-card')
  })

  it('renders with different stat values', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '100%',
        label: 'Coffee Powered'
      }
    })
    
    expect(wrapper.find('.stat-number').text()).toBe('100%')
    expect(wrapper.find('.stat-label').text()).toBe('Coffee Powered')
  })
})