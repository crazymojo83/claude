import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReminderItem from './ReminderItem'

const baseReminder = {
  id: '1',
  title: 'Call dentist',
  category: 'Health',
  dueDate: null,
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('ReminderItem', () => {
  it('renders reminder title and category', () => {
    render(
      <ReminderItem reminder={baseReminder} onToggle={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText('Call dentist')).toBeInTheDocument()
    expect(screen.getByText('Health')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <ReminderItem reminder={baseReminder} onToggle={onToggle} onDelete={() => {}} />
    )

    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('1')
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <ReminderItem reminder={baseReminder} onToggle={() => {}} onDelete={onDelete} />
    )

    await user.click(screen.getByLabelText('Delete "Call dentist"'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('shows completed styling when completed', () => {
    const completed = { ...baseReminder, completed: true }
    render(
      <ReminderItem reminder={completed} onToggle={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByTestId('reminder-item')).toHaveClass('completed')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('displays due date when provided', () => {
    const withDate = { ...baseReminder, dueDate: '2026-12-25' }
    render(
      <ReminderItem reminder={withDate} onToggle={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText(/Dec 25, 2026/)).toBeInTheDocument()
  })
})
