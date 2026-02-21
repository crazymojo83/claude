import { useState } from 'react'
import { CATEGORIES } from '../App'

export default function ReminderForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Personal')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd({ title: trimmed, category, dueDate: dueDate || null })
    setTitle('')
    setDueDate('')
  }

  return (
    <form className="reminder-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Add a reminder..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Reminder title"
        />
        <button type="submit" disabled={!title.trim()}>
          Add
        </button>
      </div>
      <div className="form-row">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
        />
      </div>
    </form>
  )
}
