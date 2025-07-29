<template>
  <form class="contact-form" @submit.prevent="handleSubmit">
    <h3 class="form-title">Send Message</h3>
    
    <div class="form-group">
      <label for="name">Name</label>
      <input 
        id="name"
        v-model="form.name"
        type="text"
        required
        placeholder="Your Name"
      />
    </div>
    
    <div class="form-group">
      <label for="email">Email</label>
      <input 
        id="email"
        v-model="form.email"
        type="email"
        required
        placeholder="your@email.com"
      />
    </div>
    
    <div class="form-group">
      <label for="subject">Subject</label>
      <input 
        id="subject"
        v-model="form.subject"
        type="text"
        required
        placeholder="What's this about?"
      />
    </div>
    
    <div class="form-group">
      <label for="message">Message</label>
      <textarea 
        id="message"
        v-model="form.message"
        required
        rows="5"
        placeholder="Your message here..."
      />
    </div>
    
    <button type="submit" class="submit-button" :disabled="isSubmitting">
      <i class="fas fa-paper-plane" />
      {{ isSubmitting ? 'Sending...' : 'Send Message' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const emit = defineEmits<{
  submit: [formData: any]
}>()

const isSubmitting = ref(false)

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    emit('submit', { ...form })
    
    // Reset form after successful submission
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    
    // Show success message (you can implement a toast system)
    alert('Message sent successfully!')
  } catch (error) {
    console.error('Error sending message:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-form {
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 10px;
  border: 2px solid var(--accent-color);
}

.form-title {
  color: var(--accent-color);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 5px;
  color: var(--white);
  font-family: var(--pixel-font);
  font-size: 1rem;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.15);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-light);
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: var(--accent-color);
  color: var(--primary-color);
  border: none;
  border-radius: 5px;
  font-family: var(--pixel-font);
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>