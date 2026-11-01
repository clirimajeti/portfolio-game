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
    <span
      class="method-tag"
      aria-hidden="true"
    >{{ label.slice(0, 2) }}-0{{ label.length }}</span>
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
/* Data shard: ::before is the 1px frame, ::after the fill with the yellow corner notch.
   Both share the cut shape so the link itself stays unclipped and its focus ring shows. */
.contact-method {
  --cut: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  position: relative;
  isolation: isolate;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem 1rem 1.4rem;
  text-decoration: none;
  text-align: left;
  transition:
    transform 0.12s ease-out,
    filter 0.12s ease-out;
}

.contact-method::before,
.contact-method::after {
  content: '';
  position: absolute;
  z-index: -1;
  clip-path: var(--cut);
}

.contact-method::before {
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.55), var(--cp-line, #2c2c3a) 40%);
  transition: background 0.12s ease-out;
}

/* Fill layers, top first: yellow notch along the cut, red tick at the bottom left,
   cyan rail on the left edge, faint scanlines, panel colour */
.contact-method::after {
  inset: 1px;
  background:
    linear-gradient(225deg, transparent 11px, var(--cp-yellow, #fcee0a) 11px 16px, transparent 16px),
    linear-gradient(var(--cp-red, #ff003c), var(--cp-red, #ff003c)) left 14px bottom 0 / 28px 2px no-repeat,
    linear-gradient(var(--cp-cyan, #00f0ff), var(--cp-cyan, #00f0ff)) left 0 top 12px / 2px 22px no-repeat,
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px),
    linear-gradient(180deg, #15151f, #0d0d14);
}

.contact-method:hover,
.contact-method:focus-visible {
  transform: translate(-3px, -3px);
  filter:
    drop-shadow(3px 3px 0 var(--cp-red, #ff003c))
    drop-shadow(0 0 10px rgba(252, 238, 10, 0.35));
}

.contact-method:hover::before,
.contact-method:focus-visible::before {
  background: var(--cp-yellow, #fcee0a);
}

.contact-method:focus-visible {
  outline: 2px solid var(--cp-cyan, #00f0ff);
  outline-offset: 4px;
}

.method-icon {
  width: 42px;
  height: 42px;
  clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 0 100%);
  background:
    linear-gradient(var(--cp-yellow, #fcee0a), var(--cp-yellow, #fcee0a)) left bottom / 100% 2px no-repeat,
    rgba(252, 238, 10, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cp-yellow, #fcee0a);
  font-size: 1.05rem;
  flex-shrink: 0;
  transition:
    background-color 0.12s ease-out,
    color 0.12s ease-out;
}

.contact-method:hover .method-icon,
.contact-method:focus-visible .method-icon {
  background: var(--cp-yellow, #fcee0a);
  color: #0a0a0f;
}

.method-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.method-label {
  font-family: var(--cp-mono, ui-monospace, Menlo, Consolas, monospace);
  color: var(--cp-cyan, #00f0ff);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.method-value {
  color: var(--cp-text, #e8e8ee);
  font-size: 0.95rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.method-tag {
  position: absolute;
  top: 6px;
  right: 26px;
  font-family: var(--cp-mono, ui-monospace, Menlo, Consolas, monospace);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8d90a0;
}

.contact-method:hover .method-tag,
.contact-method:focus-visible .method-tag {
  color: var(--cp-red, #ff003c);
}

@media (prefers-reduced-motion: reduce) {
  .contact-method,
  .contact-method::before,
  .method-icon {
    transition: none;
  }
}
</style>
