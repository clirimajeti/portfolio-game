import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '../ProjectCard.vue'

const mockProject = {
  id: 1,
  title: 'Test Project',
  description: 'A test project description',
  tech: ['Vue.js', 'TypeScript', 'Vite'],
  image: '/test-image.jpg',
  github: 'https://github.com/test/project',
  demo: 'https://demo.test.com'
}

describe('ProjectCard', () => {
  it('displays project information correctly', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject }
    })
    
    expect(wrapper.find('.game-title').text()).toBe('Test Project')
    expect(wrapper.find('.game-description').text()).toBe('A test project description')
  })

  it('renders technology tags', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject }
    })
    
    const techTags = wrapper.findAll('.tech-tag')
    expect(techTags.length).toBe(3)
    expect(techTags[0].text()).toBe('Vue.js')
    expect(techTags[1].text()).toBe('TypeScript')
    expect(techTags[2].text()).toBe('Vite')
  })
})