export default function CategoryFilter({ categories, selectedCategory, onSelect }) {
  return (
    <div className="category-filter" aria-label="Filter by category">
      <button type="button" className={selectedCategory === 'all' ? 'category-pill is-selected' : 'category-pill'} onClick={() => onSelect('all')}>All products</button>
      {categories.map((category) => (
        <button
          type="button"
          key={category.slug}
          className={selectedCategory === category.slug ? 'category-pill is-selected' : 'category-pill'}
          onClick={() => onSelect(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
