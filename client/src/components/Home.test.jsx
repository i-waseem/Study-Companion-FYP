import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Home from './Home'
import { BrowserRouter } from 'react-router-dom'

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      studyStreak: 5,
      quizHistory: [1, 2, 3]
    }
  })
}))

// Mock gemini util
vi.mock('../utils/gemini', () => ({
  getGeminiResponse: vi.fn().mockResolvedValue({
    quote: 'Test quote',
    source: 'Test source',
    isGemini: true,
    error: false
  })
}))

// Mock image import
vi.mock('../assets/SC2.png', () => ({ default: 'mocked-image-path' }))

const MockHome = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
)

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders basic structure', async () => {
    render(<MockHome />)
    
    await waitFor(() => {
      expect(screen.getByText('Study Companion')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText("Today's Motivation")).toBeInTheDocument()
    })
  })

  it('renders action cards', async () => {
    render(<MockHome />)
    
    await waitFor(() => {
      expect(screen.getByText('Take a Quiz')).toBeInTheDocument()
      expect(screen.getByText('Flashcards')).toBeInTheDocument()
      expect(screen.getByText('Provide Feedback')).toBeInTheDocument()
    })
  })

  it('renders statistics', async () => {
    render(<MockHome />)
    
    await waitFor(() => {
      expect(screen.getByText('Study Streak')).toBeInTheDocument()
      expect(screen.getByText('Quizzes Taken')).toBeInTheDocument()
      expect(screen.getByText('Average Score')).toBeInTheDocument()
    })
  })

  it('renders activity section', async () => {
    render(<MockHome />)
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    })
  })
})
