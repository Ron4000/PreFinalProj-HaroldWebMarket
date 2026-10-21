import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'

export default function ProductDetail({ products, cart, onChangeCart, isLoading }) {
  const { id } = useParams()
  const product = products.find((item) => String(item.id) === id)
  const [selectedImage, setSelectedImage] = useState({ productId: id, image: '' })
  const [failedImage, setFailedImage] = useState('')

  if (!product && isLoading) {
    return <main className="page-container detail-loading"><div className="detail-loading-image skeleton-card" /><div className="detail-loading-copy"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div></main>
  }
  if (!product) {
    return (
      <main className="page-container not-found">
        <span className="eyebrow">NOT IN THIS EDIT</span><h1>Product not found</h1>
        <p>That product may have moved on. There are plenty more lovely finds to explore.</p>
        <Link to="/" className="button button-dark">Back to products <span aria-hidden="true">↗</span></Link>
      </main>
    )
  }

  const cartQuantity = cart[product.id] || 0
  const isOutOfStock = product.quantity === 0
  const isLowStock = product.quantity > 0 && product.quantity < 5
  const gallery = product.images?.length ? product.images : [product.image]
  const activeImage = selectedImage.productId === id
    ? selectedImage.image || gallery[0]
    : gallery[0]
  const imageError = failedImage === activeImage
  const reviewList = product.reviews || []

  return (
    <main className="page-container detail-page">
      <Link to="/#products" className="back-link"><span aria-hidden="true">←</span> Back to products</Link>
      <div className="detail-layout">
        <section className="detail-gallery" aria-label="Product images">
          <div className={`detail-main-image${isOutOfStock ? ' detail-image-out' : ''}`}>
            {!imageError
              ? <img src={activeImage || product.image} alt={product.name} onError={() => setFailedImage(activeImage)} />
              : <div className="image-fallback">Image unavailable</div>}
            {product.discountPercentage > 0 && <span className="discount-badge">{Math.round(product.discountPercentage)}% OFF</span>}
            {isOutOfStock && <span className="stock-badge out-badge detail-stock-badge">Out of stock</span>}
          </div>
          {gallery.length > 1 && (
            <div className="thumbnail-list">
              {gallery.map((image, index) => (
                <button type="button" key={`${image}-${index}`} className={activeImage === image ? 'thumbnail is-active' : 'thumbnail'} onClick={() => { setSelectedImage({ productId: id, image }); setFailedImage('') }} aria-label={`Show image ${index + 1}`}>
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </section>
        <section className="detail-content">
          <span className="eyebrow">{product.category.replaceAll('-', ' ')}</span>
          <h1>{product.name}</h1>
          {product.brand && <p className="detail-brand">by {product.brand}</p>}
          <div className="detail-rating"><span className="star-row" aria-label={`Rated ${product.rating} out of 5`}>{[1, 2, 3, 4, 5].map((star) => <span key={star} className={star <= Math.round(product.rating) ? 'star-filled' : 'star-empty'}>★</span>)}</span><span>{product.rating.toFixed(1)} / 5</span></div>
          <div className="detail-price">{formatCurrency(product.price)} {product.discountPercentage > 0 && <del>{formatCurrency(product.price / (1 - product.discountPercentage / 100))}</del>}</div>
          <p className="detail-description">{product.description}</p>
          {isLowStock && <div className="detail-stock-note low-stock-note">Only {product.quantity} left in stock — a little rare.</div>}
          {isOutOfStock && <div className="detail-stock-note out-stock-note">Currently out of stock.</div>}
          <div className="detail-stock-row"><span>Available quantity</span><strong>{product.quantity}</strong></div>
          <div className="detail-stock-row detail-subtotal-row"><span>Inventory subtotal</span><strong>{formatCurrency(product.price * product.quantity)}</strong></div>
          <div className="detail-cart-actions">
            {!cartQuantity ? (
              <button type="button" className="button button-dark detail-add-button" disabled={isOutOfStock} onClick={() => onChangeCart(product.id, 1)}>{isOutOfStock ? 'Out of stock' : 'Add to cart'} <span aria-hidden="true">↗</span></button>
            ) : (
              <div className="detail-stepper-row">
                <div className="quantity-stepper"><button type="button" aria-label="Decrease quantity" onClick={() => onChangeCart(product.id, -1)}>−</button><span>{cartQuantity}</span><button type="button" aria-label="Increase quantity" disabled={cartQuantity >= product.quantity} onClick={() => onChangeCart(product.id, 1)}>+</button></div>
                <button type="button" className="remove-button" onClick={() => onChangeCart(product.id, -cartQuantity)}>Remove from cart</button>
              </div>
            )}
          </div>
          <section className="specification-section">
            <h2>Good to know</h2>
            <ul>{product.specification.split('\n').filter(Boolean).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
          </section>
        </section>
      </div>
      <section className="reviews-section">
        <div className="reviews-heading"><span className="eyebrow">KIND WORDS</span><h2>Reviews <span>({reviewList.length})</span></h2></div>
        {reviewList.length ? (
          <div className="reviews-grid">{reviewList.map((review, index) => (
            <article className="review-card" key={`${review.reviewerName}-${index}`}>
              <div className="review-stars">{[1, 2, 3, 4, 5].map((star) => <span key={star} className={star <= review.rating ? 'star-filled' : 'star-empty'}>★</span>)}</div>
              <p>“{review.comment}”</p><strong>{review.reviewerName}</strong><span>{review.date ? new Date(review.date).toLocaleDateString() : 'Verified buyer'}</span>
            </article>
          ))}</div>
        ) : <p className="no-reviews">No reviews just yet. Be the first to share what you think.</p>}
      </section>
    </main>
  )
}
