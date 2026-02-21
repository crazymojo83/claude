import { render, screen } from '@testing-library/react'
import ReminderList from './ReminderList'

const mockReminders = [
  {
    id: '1',
    title: 'Buy milk',
    category: 'Shopping',
    dueDate: null,
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Team standup',
    category: 'Work',
    dueDate: '2026-03-01',
    completed: true,
    createdAt: '2026-01-02T00:00:00.000Z',
  },
]

describe('ReminderList', () => {
  it('shows empty state when no reminders', () => {
    render(<ReminderList reminders={[]} onToggle={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('No reminders found')).toBeInTheDocument()
  })

  it('renders all reminders', () => {
    render(
      <ReminderList
        reminders={mockReminders}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    )
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText('Team standup')).toBeInTheDocument()
  })

  it('renders a list role container', () => {
    render(
      <ReminderList
        reminders={mockReminders}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    )
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})
