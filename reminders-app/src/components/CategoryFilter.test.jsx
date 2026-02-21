import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryFilter from './CategoryFilter'

const categories = ['Personal', 'Work', 'Health']
const counts = { All: 5, Personal: 2, Work: 2, Health: 1 }

describe('CategoryFilter', () => {
  it('renders All plus each category', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="All"
        onSelect={() => {}}
        counts={counts}
      />
    )
    expect(screen.getByRole('tab', { name: /All/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Personal/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Work/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Health/ })).toBeInTheDocument()
  })

  it('marks the active category as selected', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="Work"
        onSelect={() => {}}
        counts={counts}
      />
    )
    expect(screen.getByRole('tab', { name: /Work/ })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: /All/ })).toHaveAttribute(
      'aria-selected',
      'false'
    )
  })

  it('calls onSelect when a category is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <CategoryFilter
        categories={categories}
        active="All"
        onSelect={onSelect}
        counts={counts}
      />
    )

    await user.click(screen.getByRole('tab', { name: /Health/ }))
    expect(onSelect).toHaveBeenCalledWith('Health')
  })

  it('displays counts for categories', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="All"
        onSelect={() => {}}
        counts={counts}
      />
    )
    expect(screen.getByRole('tab', { name: /All/ })).toHaveTextContent('5')
    expect(screen.getByRole('tab', { name: /Personal/ })).toHaveTextContent('2')
  })
})
