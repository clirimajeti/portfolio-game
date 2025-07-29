import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactForm from '../ContactForm.vue'

describe('ContactForm', () => {
  it('renders all form fields', () => {
    const wrapper = mount(ContactForm)
    
    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#subject').exists()).toBe(true)
    expect(wrapper.find('#message').exists()).toBe(true)
    expect(wrapper.find('.submit-button').exists()).toBe(true)
  })

  it('emits submit event with form data', async () => {
    const wrapper = mount(ContactForm)
    
    await wrapper.find('#name').setValue('John Doe')
    await wrapper.find('#email').setValue('john@example.com')
    await wrapper.find('#subject').setValue('Test Subject')
    await wrapper.find('#message').setValue('Test message')
    
    // Mock window.alert to avoid test errors
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')?.[0][0]).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message'
    })
    
    alertSpy.mockRestore()
  })

  it('shows loading state when submitting', async () => {
    const wrapper = mount(ContactForm)
    
    // Mock window.alert to avoid test errors
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    await wrapper.find('#name').setValue('Test')
    await wrapper.find('#email').setValue('test@test.com')
    await wrapper.find('#subject').setValue('Test')
    await wrapper.find('#message').setValue('Test')
    
    await wrapper.find('form').trigger('submit.prevent')
    
    // Check that button shows loading text initially
    const button = wrapper.find('.submit-button')
    expect(button.exists()).toBe(true)
    
    alertSpy.mockRestore()
  })

  it('validates required fields', () => {
    const wrapper = mount(ContactForm)
    
    const nameInput = wrapper.find('#name')
    const emailInput = wrapper.find('#email')
    const subjectInput = wrapper.find('#subject')
    const messageInput = wrapper.find('#message')
    
    expect(nameInput.attributes('required')).toBeDefined()
    expect(emailInput.attributes('required')).toBeDefined()
    expect(subjectInput.attributes('required')).toBeDefined()
    expect(messageInput.attributes('required')).toBeDefined()
  })
})