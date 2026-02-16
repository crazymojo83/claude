import { useState } from 'react'

function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setMessage('')
  }

  function handleClose() {
    setIsOpen(false)
    setSubmitted(false)
    setMessage('')
  }

  if (submitted) {
    return (
      <div>
        <p>Thank you for your feedback!</p>
        <button onClick={handleClose}>Close</button>
      </div>
    )
  }

  if (isOpen) {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="feedback-message">Your feedback:</label>
        <br />
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          cols={40}
        />
        <br />
        <button type="submit">Submit</button>
        <button type="button" onClick={handleClose}>Cancel</button>
      </form>
    )
  }

  return (
    <button onClick={() => setIsOpen(true)}>Give Feedback</button>
  )
}

export default FeedbackButton
