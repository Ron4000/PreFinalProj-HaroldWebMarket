import ProductCard from './ProductCard'

export default function FeaturedProducts({ products, cart, onChangeCart }) {
  return (
    <section className="section-block featured-section" aria-labelledby="featured-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">A FEW GOOD THINGS</span>
          <h2 id="featured-heading">The well-loved edit</h2>
        </div>
        <p>Customer favorites, picked just for you.</p>
      </div>
      <div className="featured-grid">
        {products.slice(0, 4).map((product, index) => (
          <ProductCard key={product.id} product={product} cart={cart} onChangeCart={onChangeCart} featuredIndex={index} />
        ))}
        {!products.length && [0, 1, 2, 3].map((item) => <div key={item} className="skeleton-card" aria-hidden="true" />)}
      </div>
    </section>
  )
}
