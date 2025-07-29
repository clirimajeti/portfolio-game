export interface Position {
  x: number
  y: number
}

export interface Skill {
  name: string
  level: number
}

export interface Project {
  id: number
  title: string
  description: string
  tech: string[]
  image: string
  github?: string
  demo?: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface Particle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
}

export interface SocialLinks {
  linkedin: string
  github: string
  twitter: string
}

export interface PortfolioData {
  name: string
  title: string
  email: string
  social: SocialLinks
}

export interface CoffeeProjectile {
  id: number
  position: Position
  velocity: { x: number; y: number }
  rotation: number
}

export interface BugEnemy {
  id: number
  position: Position
  velocity: { x: number; y: number }
  isHit: boolean
}

export interface CoffeeSplash {
  id: number
  position: Position
}