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
    
    expect(wrapper.find('.project-title').text()).toBe('Test Project')
    expect(wrapper.find('.project-description').text()).toBe('A test project description')
    expect(wrapper.find('img').attributes('src')).toBe('/test-image.jpg')
    expect(wrapper.find('img').attributes('alt')).toBe('Test Project')
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

  it('shows project links when available', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject }
    })
    
    const links = wrapper.findAll('.project-link')
    expect(links.length).toBe(2)
    
    const githubLink = links.find(link => link.attributes('href') === mockProject.github)
    const demoLink = links.find(link => link.attributes('href') === mockProject.demo)
    
    expect(githubLink?.exists()).toBe(true)
    expect(demoLink?.exists()).toBe(true)
  })

  it('handles project without demo link', () => {
    const projectWithoutDemo = { ...mockProject, demo: undefined }
    const wrapper = mount(ProjectCard, {
      props: { project: projectWithoutDemo }
    })
    
    const links = wrapper.findAll('.project-link')
    expect(links.length).toBe(1) // Only GitHub link
    
    const githubLink = links.find(link => link.attributes('href') === mockProject.github)
    expect(githubLink?.exists()).toBe(true)
  })

  it('handles project without GitHub link', () => {
    const projectWithoutGithub = { ...mockProject, github: undefined }
    const wrapper = mount(ProjectCard, {
      props: { project: projectWithoutGithub }
    })
    
    const links = wrapper.findAll('.project-link')
    expect(links.length).toBe(1) // Only demo link
    
    const demoLink = links.find(link => link.attributes('href') === mockProject.demo)
    expect(demoLink?.exists()).toBe(true)
  })
})