import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'

export default function ProductCard({ product, cart, onChangeCart, featuredIndex, highlightedId }) {
  const cartQuantity = cart[product.id] || 0
  const isOutOfStock = product.quantity === 0
  const isLowStock = product.quantity > 0 && product.quantity < 5
  const subtotal = product.price * product.quantity

  return (
    <article
      id={featuredIndex === undefined ? `product-${product.id}` : undefined}
      className={`product-card${isLowStock ? ' low-stock-card' : ''}${isOutOfStock ? ' out-of-stock-card' : ''}${highlightedId === product.id ? ' is-highlighted' : ''}`}
    >
      <Link to={`/product/${product.id}`} className="product-image-link" aria-label={`View ${product.name}`}>
        <div className="product-image-frame">
          <img src={product.image} alt={product.name} loading="lazy" />
          {featuredIndex !== undefined && <span className="featured-number">0{featuredIndex + 1}</span>}
          {isOutOfStock
            ? <span className="stock-badge out-badge">Out of stock</span>
            : isLowStock && <span className="stock-badge low-badge">Low stock · {product.quantity} left</span>}
        </div>
      </Link>
      <div className="product-card-body">
        <div className="product-card-topline">
          <span className="product-category">{product.category.replaceAll('-', ' ')}</span>
          <span className="product-rating"><span aria-hidden="true">★</span> {product.rating.toFixed(1)}</span>
        </div>
        <Link to={`/product/${product.id}`} className="product-title-link"><h3>{product.name}</h3></Link>
        <div className="product-price-row">
          <strong>{formatCurrency(product.price)}</strong>
          <span className="product-stock">Stock: {product.quantity}</span>
        </div>
        <div className="product-subtotal"><span>Inventory value</span><strong>{formatCurrency(subtotal)}</strong></div>
        <div className="card-actions">
          {!cartQuantity ? (
            <button type="button" className="button button-dark card-cart-button" disabled={isOutOfStock} onClick={() => onChangeCart(product.id, 1)}>
              {isOutOfStock ? 'Out of stock' : 'Add to cart'} <span aria-hidden="true">↗</span>
            </button>
          ) : (
            <div className="card-cart-controls">
              <div className="quantity-stepper" aria-label={`${cartQuantity} in cart`}>
                <button type="button" aria-label="Decrease quantity" onClick={() => onChangeCart(product.id, -1)}>−</button>
                <span>{cartQuantity}</span>
                <button type="button" aria-label="Increase quantity" disabled={cartQuantity >= product.quantity} onClick={() => onChangeCart(product.id, 1)}>+</button>
              </div>
              <button type="button" className="remove-button" onClick={() => onChangeCart(product.id, -cartQuantity)}>Remove</button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
