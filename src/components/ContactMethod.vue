<template>
  <a 
    :href="href"
    class="contact-method"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="method-icon">
      <i :class="icon" />
    </div>
    <div class="method-info">
      <div class="method-label">{{ label }}</div>
      <div class="method-value">{{ value }}</div>
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string
  href: string
}>()
</script>

<style scoped>
.contact-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  border: 2px solid var(--accent-color);
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-method:hover {
  transform: translateX(10px);
  box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
}

.method-icon {
  width: 50px;
  height: 50px;
  background: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 1.2rem;
  flex-shrink: 0;
}

.method-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.method-label {
  color: var(--accent-color);
  font-weight: bold;
  font-size: 0.9rem;
}

.method-value {
  color: var(--text-light);
  font-size: 1rem;
}
</style>