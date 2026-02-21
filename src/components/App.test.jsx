import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders the profile page with key sections', () => {
    render(<App />)
    expect(screen.getByText('Your Name')).toBeInTheDocument()
    expect(screen.getByText('Director by Day, Developer by Night')).toBeInTheDocument()
    expect(screen.getByText("What I'm Building")).toBeInTheDocument()
    expect(screen.getByText('Technical Toolkit')).toBeInTheDocument()
    expect(screen.getByText('From the Terminal')).toBeInTheDocument()
    expect(screen.getByText('The Path So Far')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<App />)
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getAllByText('Skills').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Thoughts')).toBeInTheDocument()
  })
})
