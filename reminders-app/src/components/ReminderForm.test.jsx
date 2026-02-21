import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReminderForm from './ReminderForm'

describe('ReminderForm', () => {
  it('renders the form with input and add button', () => {
    render(<ReminderForm onAdd={() => {}} />)
    expect(screen.getByLabelText('Reminder title')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('disables submit when input is empty', () => {
    render(<ReminderForm onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('calls onAdd with reminder data and clears input on submit', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<ReminderForm onAdd={onAdd} />)

    const input = screen.getByLabelText('Reminder title')
    await user.type(input, 'Buy groceries')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).toHaveBeenCalledWith({
      title: 'Buy groceries',
      category: 'Personal',
      dueDate: null,
    })
    expect(input).toHaveValue('')
  })

  it('allows selecting a category', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<ReminderForm onAdd={onAdd} />)

    await user.selectOptions(screen.getByLabelText('Category'), 'Work')
    await user.type(screen.getByLabelText('Reminder title'), 'Finish report')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Work' })
    )
  })

  it('does not submit when title is only whitespace', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<ReminderForm onAdd={onAdd} />)

    const input = screen.getByLabelText('Reminder title')
    await user.type(input, '   ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
  })
})
