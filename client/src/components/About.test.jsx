import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from './About'

describe('About Component', () => {
  beforeEach(() => {
    render(<About />)
  })

  it('renders header section', () => {
    const title = screen.getByText('About Study Companion')
    const intro = screen.getByText(/Study Companion is your personal AI-powered learning assistant/i)
    
    expect(title).toBeInTheDocument()
    expect(intro).toBeInTheDocument()
  })

  it('displays all feature cards', () => {
    const features = [
      { title: 'Smart Learning', desc: 'AI-powered learning experience' },
      { title: 'Progress Tracking', desc: 'Monitor your learning journey' },
      { title: 'Career Guidance', desc: 'Get personalized career advice' },
      { title: 'Interactive Learning', desc: 'Engage with quizzes' }
    ]

    features.forEach(({ title, desc }) => {
      const titleElement = screen.getByText(title)
      const descElement = screen.getByText(new RegExp(desc, 'i'))
      expect(titleElement).toBeInTheDocument()
      expect(descElement).toBeInTheDocument()
    })
  })

  it('shows mission section', () => {
    const missionTitle = screen.getByText('Our Mission')
    const missionText = screen.getByText(/To revolutionize education for O-level students/i)

    expect(missionTitle).toBeInTheDocument()
    expect(missionText).toBeInTheDocument()
  })

  it('displays technology and benefits sections', () => {
    // Technology section
    const techTitle = screen.getByText('Technology')
    expect(techTitle).toBeInTheDocument()
    expect(screen.getByText(/Google's Gemini AI/i)).toBeInTheDocument()

    // Benefits section
    const benefitsTitle = screen.getByText('Benefits')
    expect(benefitsTitle).toBeInTheDocument()
    expect(screen.getByText(/Personalized learning paths/i)).toBeInTheDocument()
  })
})
