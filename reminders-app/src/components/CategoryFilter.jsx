export default function CategoryFilter({ categories, active, onSelect, counts }) {
  const allCategories = ['All', ...categories]

  return (
    <div className="category-filter" role="tablist" aria-label="Filter by category">
      {allCategories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          className={`category-chip${active === cat ? ' active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
          {counts[cat] > 0 && <span className="count">{counts[cat]}</span>}
        </button>
      ))}
    </div>
  )
}
