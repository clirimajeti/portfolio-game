# Interactive Game Portfolio

A Vue 3 interactive portfolio application with game-like navigation and animations, built with TypeScript and tested with Vitest.

## Features

- 🎮 Game-like interactive navigation
- ⌨️ Keyboard controls (arrow keys + space)
- 🎨 Modern animated UI with particle effects
- 📱 Responsive design
- 🧪 Comprehensive unit tests
- 📦 TypeScript for type safety
- ⚡ Built with Vite for fast development

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for build tooling
- **Vitest** for unit testing
- **ESLint** and **Prettier** for code quality
- **CSS3** with modern animations

## Project Structure

```
src/
├── components/           # Vue components
│   ├── sections/        # Page sections (Intro, About, Skills, etc.)
│   └── __tests__/       # Unit tests
├── composables/         # Vue composables for reusable logic
├── constants/           # Application constants
├── types/              # TypeScript type definitions
└── assets/             # Static assets and styles
```

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:unit

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Game Controls

- **Arrow Keys**: Move character around (very fast movement with animated walking legs!)
- **Space**: Throw coffee projectiles at bugs
- **Click Portal**: Navigate to next section

## Game Mechanics

- **Character Animation**: Larger character (70x70px) with complete images that alternate between walking poses and throwing pose
- **Coffee Throwing**: Straight horizontal projectile physics with rotation (no gravity)
- **Bug Enemies**: Larger bugs (45x45px) with finite spawning (3 bugs in level 1, no respawning when killed)
- **Progressive Difficulty**: Bug count increases with each portfolio section/level (bugs don't respawn)
- **Precise Collision Detection**: Accurate center-point based collision using sprite dimensions
- **Scoring System**: Earn points by hitting bugs with coffee
- **Particle Effects**: Coffee splash animations on impact
- **60 FPS Game Loop**: Smooth gameplay with continuous updates

## Sections

1. **Intro**: Welcome and game instructions
2. **About**: Personal information and stats
3. **Skills**: Technical skills with progress bars
4. **Projects**: Portfolio projects with links
5. **Contact**: Contact form and social links

## Clean Code Principles Applied

- **Separation of Concerns**: Components, composables, constants, and types are properly separated
- **Single Responsibility**: Each component has a single, well-defined purpose
- **DRY (Don't Repeat Yourself)**: Reusable logic extracted to composables
- **Type Safety**: Full TypeScript coverage with proper type definitions
- **Testable Code**: Components designed for easy unit testing
- **Consistent Naming**: Clear, descriptive names throughout the codebase

## Testing

The project includes comprehensive unit tests covering:

- Component rendering and props
- User interactions and animations
- Game mechanics (character movement, coffee throwing, bug behavior)
- Form validation and submission
- Component state management

Run tests with:
```bash
npm run test:unit
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) for the best development experience.
