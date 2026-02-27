import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ZendeskDashboard from './ZendeskDashboard'

// Mock localStorage
const mockStorage = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, val) => { mockStorage[key] = val }),
  removeItem: vi.fn((key) => { delete mockStorage[key] }),
})

describe('ZendeskDashboard', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k])
  })

  it('shows settings panel when no credentials', () => {
    render(
      <MemoryRouter>
        <ZendeskDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText('Zendesk Connection')).toBeTruthy()
  })

  it('shows settings form fields', () => {
    render(
      <MemoryRouter>
        <ZendeskDashboard />
      </MemoryRouter>
    )
    expect(screen.getByLabelText('Subdomain')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('API Token')).toBeTruthy()
  })

  it('shows Test & Connect button', () => {
    render(
      <MemoryRouter>
        <ZendeskDashboard />
      </MemoryRouter>
    )
    expect(screen.getByText('Test & Connect')).toBeTruthy()
  })
})
