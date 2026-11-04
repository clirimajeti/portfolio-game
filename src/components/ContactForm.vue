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
  background: var(--surface);
  padding: 2rem;
  box-shadow: var(--panel-shadow);
}

.form-title {
  color: var(--yellow);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--text-muted);
  font-family: var(--font-pixel);
  font-size: 0.6rem;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  background: var(--ink);
  border: 3px solid var(--border);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--yellow);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: var(--yellow);
  color: var(--ink);
  border: none;
  box-shadow:
    0 0 0 var(--px) var(--ink),
    6px 6px 0 var(--px) var(--ink);
  font-family: var(--font-pixel);
  font-size: 0.75rem;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.submit-button:hover:not(:disabled) {
  transform: translate(-2px, -2px);
}

.submit-button:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 var(--px) var(--ink);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
