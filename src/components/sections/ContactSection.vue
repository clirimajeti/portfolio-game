<template>
  <section class="game-section contact-section">
    <div class="contact-content">
      <h2 class="contact-title level-title" data-stage="Final stage">Let's connect</h2>
      <p class="contact-description">
        Thanks for playing! I'm always happy to talk about frontend work, Vue or a tricky UI
        problem. Reach out through any of these channels.
      </p>
      <div class="contact-methods">
        <ContactMethod 
          icon="fas fa-envelope"
          label="Email"
          value="clirimajeti@gmail.com"
          href="mailto:clirimajeti@gmail.com"
        />
        <ContactMethod 
          icon="fab fa-linkedin"
          label="LinkedIn"
          value="linkedin.com/in/clirim-ajeti"
          href="https://www.linkedin.com/in/clirim-ajeti/"
        />
        <ContactMethod 
          icon="fab fa-github"
          label="GitHub"
          value="github.com/clirimajeti"
          href="https://github.com/clirimajeti"
        />
      </div>
      <div class="game-complete">
        <h3>Level complete!</h3>
        <p>All bugs squashed. Thanks for exploring my portfolio!</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ContactMethod from '../ContactMethod.vue'
</script>

<style scoped>
.game-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Neon-noir finale: scanlines, two diagonal slashes, a skyline silhouette and a
   perspective grid floor (::before). Static on purpose: no looping animation. */
.contact-section {
  --cp-font: system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --cp-display: 'Avenir Next Condensed', 'Roboto Condensed', 'Arial Narrow', 'Helvetica Neue', system-ui, sans-serif;
  --cp-mono: ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  --cp-bg: #0a0a0f;
  --cp-panel: #12121a;
  --cp-line: #2c2c3a;
  --cp-text: #e8e8ee;
  --cp-muted: #b3b6c2;
  --cp-yellow: #fcee0a;
  --cp-red: #ff003c;
  --cp-cyan: #00f0ff;
  overflow: hidden;
  overflow: clip;
  isolation: isolate;
  font-family: var(--cp-font);
  background:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.028) 0 1px, transparent 1px 3px),
    linear-gradient(112deg, transparent 71%, rgba(255, 0, 60, 0.16) 71% 74.5%, transparent 74.5%),
    linear-gradient(112deg, transparent 76%, rgba(252, 238, 10, 0.1) 76% 76.6%, transparent 76.6%),
    linear-gradient(112deg, transparent 9%, rgba(252, 238, 10, 0.06) 9% 13%, transparent 13%),
    /* City of lights: lit windows, neon sign strips and rooftop beacons (generated SVG tile) */
    url('../../assets/skyline.svg') bottom left / 960px 240px repeat-x,
    /* Light haze the city throws into the night sky */
    radial-gradient(ellipse 60% 30% at 25% 100%, rgba(255, 63, 164, 0.22), transparent 70%),
    radial-gradient(ellipse 60% 30% at 75% 100%, rgba(0, 240, 255, 0.16), transparent 70%),
    radial-gradient(ellipse 90% 40% at 50% 100%, rgba(255, 211, 107, 0.12), transparent 75%),
    radial-gradient(ellipse 90% 80% at 50% 40%, transparent 45%, rgba(0, 0, 0, 0.7) 100%),
    linear-gradient(180deg, #0e0e16 0%, var(--cp-bg) 60%);
}

/* Grid floor under the skyline, tilted back; edges tinted red/cyan for a chromatic fringe */
.contact-section::before {
  content: '';
  position: absolute;
  z-index: -1;
  left: -50%;
  right: -50%;
  bottom: 0;
  height: 42%;
  transform: perspective(320px) rotateX(58deg);
  transform-origin: bottom center;
  background:
    linear-gradient(90deg, rgba(255, 0, 60, 0.25), transparent 10%, transparent 90%, rgba(0, 240, 255, 0.25)),
    repeating-linear-gradient(90deg, rgba(252, 238, 10, 0.16) 0 1px, transparent 1px 64px),
    repeating-linear-gradient(0deg, rgba(252, 238, 10, 0.16) 0 1px, transparent 1px 48px);
  mask-image: linear-gradient(to top, #000 10%, transparent 85%);
  pointer-events: none;
}

.contact-content {
  max-width: 820px;
  padding: 0 20px;
  z-index: 2;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.contact-title {
  margin-bottom: 1.1rem;
  font-family: var(--cp-display);
  font-stretch: condensed;
  font-weight: 700;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cp-yellow);
  text-shadow:
    -3px 0 0 var(--cp-red),
    3px 0 0 var(--cp-cyan);
}

/* Kicker as a HUD tag: "// FINAL STAGE" in a cyan-edged box */
.contact-title::before {
  content: '// ' attr(data-stage);
  content: '// ' attr(data-stage) / attr(data-stage);
  width: fit-content;
  margin: 0 auto 1rem;
  padding: 0.3rem 0.7rem;
  font-family: var(--cp-mono);
  font-stretch: normal;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.25em;
  color: var(--cp-cyan);
  border: 1px solid rgba(0, 240, 255, 0.55);
  border-left: 3px solid var(--cp-red);
  background: rgba(0, 240, 255, 0.06);
}

@media (prefers-reduced-motion: no-preference) {
  .contact-title:hover {
    animation: cp-glitch 0.36s steps(1, end) 1;
  }
}

@keyframes cp-glitch {
  0% { text-shadow: -6px 0 0 var(--cp-red), 6px 0 0 var(--cp-cyan); transform: translateX(2px); }
  25% { text-shadow: 4px 0 0 var(--cp-red), -4px 0 0 var(--cp-cyan); transform: translateX(-3px) skewX(-6deg); }
  50% { text-shadow: -2px 2px 0 var(--cp-red), 2px -2px 0 var(--cp-cyan); transform: translateX(1px); }
  75% { text-shadow: 8px 0 0 var(--cp-red), -2px 0 0 var(--cp-cyan); transform: none; }
  100% { text-shadow: -3px 0 0 var(--cp-red), 3px 0 0 var(--cp-cyan); }
}

.contact-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--cp-muted);
  max-width: 600px;
  margin: 0 auto 2.25rem;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2.25rem;
}

/* Third tile (GitHub) spans the full row under Email and LinkedIn */
.contact-methods > :last-child {
  grid-column: 1 / -1;
}

/* Mission-complete banner: yellow bar with angled ends over a thin red data line */
.game-complete {
  padding: 0.5rem 0 0;
  background: linear-gradient(90deg, transparent, var(--cp-red) 20%, var(--cp-red) 80%, transparent) 0 1.67rem / 100% 1px no-repeat;
}

.game-complete h3 {
  display: inline-block;
  padding: 0.45rem 2.2rem 0.45rem 2.4rem;
  clip-path: polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
  background: var(--cp-yellow);
  font-family: var(--cp-display);
  font-stretch: condensed;
  font-weight: 700;
  font-size: 1.2rem;
  line-height: 1.2;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #0a0a0f;
  margin-bottom: 0.7rem;
}

.game-complete p {
  font-family: var(--cp-mono);
  font-size: 0.85rem;
  color: var(--cp-muted);
}

.contact-content::-webkit-scrollbar {
  width: 8px;
}

.contact-content::-webkit-scrollbar-track {
  background: #000;
  border: 0;
}

.contact-content::-webkit-scrollbar-thumb {
  background: var(--cp-yellow);
  border: 0;
  box-shadow: none;
}

.contact-content::-webkit-scrollbar-thumb:hover {
  background: var(--cp-cyan);
}

@media (max-width: 768px) {
  .contact-content {
    align-self: stretch;
    overflow-y: auto;
    padding: 110px 20px 40px;
  }

  .contact-methods {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .game-complete h3 {
    letter-spacing: 0.12em;
    padding: 0.45rem 1.6rem;
  }
}
</style>
