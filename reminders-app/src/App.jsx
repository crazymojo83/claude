import { useState, useEffect, useCallback } from 'react'
import ReminderForm from './components/ReminderForm'
import ReminderList from './components/ReminderList'
import CategoryFilter from './components/CategoryFilter'
import './App.css'

const STORAGE_KEY = 'claude-reminders'

function loadReminders() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveReminders(reminders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
}

export const CATEGORIES = ['Personal', 'Work', 'Health', 'Shopping', 'Other']

export default function App() {
  const [reminders, setReminders] = useState(loadReminders)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    saveReminders(reminders)
  }, [reminders])

  const addReminder = useCallback((reminder) => {
    setReminders((prev) => [
      {
        id: crypto.randomUUID(),
        title: reminder.title,
        category: reminder.category,
        dueDate: reminder.dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }, [])

  const toggleComplete = useCallback((id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    )
  }, [])

  const deleteReminder = useCallback((id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const filteredReminders = reminders.filter((r) => {
    const matchesCategory =
      activeCategory === 'All' || r.category === activeCategory
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const counts = {
    All: reminders.length,
    ...Object.fromEntries(
      CATEGORIES.map((c) => [c, reminders.filter((r) => r.category === c).length])
    ),
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Reminders</h1>
        <p className="app-subtitle">
          {reminders.filter((r) => !r.completed).length} pending
        </p>
      </header>

      <ReminderForm onAdd={addReminder} />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search reminders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search reminders"
        />
      </div>

      <CategoryFilter
        categories={CATEGORIES}
        active={activeCategory}
        onSelect={setActiveCategory}
        counts={counts}
      />

      <ReminderList
        reminders={filteredReminders}
        onToggle={toggleComplete}
        onDelete={deleteReminder}
      />
    </div>
  )
}
