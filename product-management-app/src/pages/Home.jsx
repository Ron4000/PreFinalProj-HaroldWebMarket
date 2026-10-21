import HeroSlider from '../components/HeroSlider'
import FeaturedProducts from '../components/FeaturedProducts'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'

export default function Home({
  products,
  featured,
  categories,
  selectedCategory,
  onSelectCategory,
  filteredProducts,
  onAddProduct,
  isLoading,
  loadError,
  onRetry,
  cart,
  onChangeCart,
  highlightedId,
}) {
  return (
    <main>
      <div className="page-container home-container">
        <HeroSlider products={products} />
        <FeaturedProducts products={featured} cart={cart} onChangeCart={onChangeCart} />
        <section className="section-block products-section" id="products" aria-labelledby="products-heading">
          <div className="section-heading products-heading">
            <div><span className="eyebrow">THE WHOLE COLLECTION</span><h2 id="products-heading">Find your next favorite</h2></div>
            <button type="button" className="button button-dark add-product-button" onClick={onAddProduct}>＋ Add new product</button>
          </div>
          <div className="collection-toolbar">
            <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelect={onSelectCategory} />
            <span className="result-count">{isLoading ? 'Gathering the good things…' : `${filteredProducts.length} pieces`}</span>
          </div>
          {loadError && (
            <div className="load-notice" role="alert">
              <span><strong>Catalog notice</strong> {loadError}</span>
              <button type="button" className="button button-outline" onClick={onRetry}>Retry</button>
            </div>
          )}
          <ProductGrid products={filteredProducts} cart={cart} onChangeCart={onChangeCart} isLoading={isLoading} highlightedId={highlightedId} />
        </section>
      </div>
    </main>
  )
}
