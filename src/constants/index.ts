export const GAME_CONFIG = {
  MAX_SECTIONS: 5,
  CHARACTER_SPEED: 20, // Increased from 10 to 20 for much faster movement
  CHARACTER_SIZE: 70, // Increased from 50 to 70
  BUG_SIZE: 45, // New config for bug size (increased from 30)
  MAX_BUGS_LEVEL_1: 3, // Only 3 bugs in first level
  ANIMATION_DURATION: 0.5,
  SPRITE_SIZE: 200
} as const

export const PORTFOLIO_DATA = {
  name: 'Alex Dev',
  title: 'Full-Stack Developer & Game Creator',
  email: 'alex@example.com',
  social: {
    linkedin: 'https://linkedin.com/in/alexdev',
    github: 'https://github.com/alexdev',
    twitter: 'https://twitter.com/alexdev'
  }
} as const

export const SKILLS_DATA = {
  frontend: [
    { name: 'Vue.js', level: 90 },
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 88 },
    { name: 'CSS/SASS', level: 90 }
  ],
  backend: [
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'Express', level: 85 },
    { name: 'FastAPI', level: 75 }
  ],
  database: [
    { name: 'PostgreSQL', level: 85 },
    { name: 'MongoDB', level: 80 },
    { name: 'Redis', level: 70 },
    { name: 'SQLite', level: 85 }
  ],
  tools: [
    { name: 'Git', level: 90 },
    { name: 'Docker', level: 75 },
    { name: 'AWS', level: 70 },
    { name: 'Figma', level: 80 }
  ]
}

export const PROJECTS_DATA = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with modern UI and secure payment processing.',
    tech: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    image: '/project1.svg',
    github: 'https://github.com/username/ecommerce',
    demo: 'https://demo.example.com'
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates and team features.',
    tech: ['React', 'Express', 'MongoDB', 'Socket.io'],
    image: '/project2.svg',
    github: 'https://github.com/username/taskapp'
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'Beautiful weather app with forecasts, maps, and location-based services.',
    tech: ['Vue.js', 'TypeScript', 'OpenWeather API'],
    image: '/project3.svg',
    github: 'https://github.com/username/weather',
    demo: 'https://weather.example.com'
  }
]