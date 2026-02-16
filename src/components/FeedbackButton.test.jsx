import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import FeedbackButton from './FeedbackButton'

describe('FeedbackButton', () => {
  it('renders the feedback button', () => {
    render(<FeedbackButton />)
    expect(screen.getByText('Give Feedback')).toBeInTheDocument()
  })

  it('opens the feedback form when clicked', async () => {
    const user = userEvent.setup()
    render(<FeedbackButton />)

    await user.click(screen.getByText('Give Feedback'))

    expect(screen.getByLabelText('Your feedback:')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('submits feedback and shows confirmation', async () => {
    const user = userEvent.setup()
    render(<FeedbackButton />)

    await user.click(screen.getByText('Give Feedback'))
    await user.type(screen.getByLabelText('Your feedback:'), 'Great app!')
    await user.click(screen.getByText('Submit'))

    expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument()
  })

  it('closes the form when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<FeedbackButton />)

    await user.click(screen.getByText('Give Feedback'))
    await user.click(screen.getByText('Cancel'))

    expect(screen.getByText('Give Feedback')).toBeInTheDocument()
  })

  it('returns to initial state after closing confirmation', async () => {
    const user = userEvent.setup()
    render(<FeedbackButton />)

    await user.click(screen.getByText('Give Feedback'))
    await user.type(screen.getByLabelText('Your feedback:'), 'Nice!')
    await user.click(screen.getByText('Submit'))
    await user.click(screen.getByText('Close'))

    expect(screen.getByText('Give Feedback')).toBeInTheDocument()
  })
})
