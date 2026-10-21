import ProductCard from './ProductCard'

export default function ProductGrid({ products, cart, onChangeCart, isLoading, highlightedId }) {
  if (isLoading) {
    return <div className="product-grid" aria-label="Loading products">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="skeleton-card" />)}</div>
  }
  if (!products.length) {
    return <div className="empty-products"><span aria-hidden="true">◌</span><h3>No products in this collection yet</h3><p>Try another category to discover more.</p></div>
  }
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} cart={cart} onChangeCart={onChangeCart} highlightedId={highlightedId} />
      ))}
    </div>
  )
}
