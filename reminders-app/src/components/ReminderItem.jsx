export default function ReminderItem({ reminder, onToggle, onDelete }) {
  const isOverdue =
    reminder.dueDate &&
    !reminder.completed &&
    new Date(reminder.dueDate) < new Date(new Date().toDateString())

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div
      className={`reminder-item${reminder.completed ? ' completed' : ''}`}
      data-testid="reminder-item"
    >
      <input
        type="checkbox"
        checked={reminder.completed}
        onChange={() => onToggle(reminder.id)}
        aria-label={`Mark "${reminder.title}" as ${reminder.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="content">
        <div className="title">{reminder.title}</div>
        <div className="meta">
          <span className="category-badge">{reminder.category}</span>
          {reminder.dueDate && (
            <span className={`due-date${isOverdue ? ' overdue' : ''}`}>
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {formatDate(reminder.dueDate)}
            </span>
          )}
        </div>
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(reminder.id)}
        aria-label={`Delete "${reminder.title}"`}
      >
        &times;
      </button>
    </div>
  )
}
