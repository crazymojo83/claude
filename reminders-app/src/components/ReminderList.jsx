import ReminderItem from './ReminderItem'

export default function ReminderList({ reminders, onToggle, onDelete }) {
  if (reminders.length === 0) {
    return (
      <div className="empty-state">
        <p>No reminders found</p>
        <p>Add one above to get started</p>
      </div>
    )
  }

  return (
    <div className="reminder-list" role="list">
      {reminders.map((reminder) => (
        <ReminderItem
          key={reminder.id}
          reminder={reminder}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
