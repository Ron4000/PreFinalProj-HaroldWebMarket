import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'

export default function CartDrawer({ isOpen, onClose, products, cart, onChangeQuantity, onRemove, onClear }) {
  const drawerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const closeDrawer = useCallback(() => {
    if (drawerRef.current?.contains(document.activeElement)) {
      document.activeElement.blur()
    }
    onClose()
    document.querySelector('.cart-trigger')?.focus()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined
    closeButtonRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeDrawer])

  const cartItems = products.filter((product) => cart[product.id])
  const grandTotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0)

  return (
    <div className={`drawer-backdrop${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen} onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeDrawer()
    }}>
      <aside ref={drawerRef} className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" inert={!isOpen}>
        <div className="drawer-heading">
          <div><span className="eyebrow">YOUR SELECTION</span><h2 id="cart-title">Shopping cart <span>({cartItems.length})</span></h2></div>
          <button ref={closeButtonRef} className="icon-button" type="button" aria-label="Close cart" onClick={closeDrawer}>×</button>
        </div>
        {!cartItems.length ? (
          <div className="cart-empty"><span aria-hidden="true">＋</span><h3>Your cart is taking a breather</h3><p>Find something lovely to bring home.</p><button type="button" className="button button-dark" onClick={closeDrawer}>Explore products</button></div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((product) => (
                <article className="cart-item" key={product.id}>
                  <Link to={`/product/${product.id}`} onClick={closeDrawer} className="cart-item-image"><img src={product.image} alt="" /></Link>
                  <div className="cart-item-info">
                    <span>{product.category.replaceAll('-', ' ')}</span>
                    <Link to={`/product/${product.id}`} onClick={closeDrawer}>{product.name}</Link>
                    <strong>{formatCurrency(product.price * cart[product.id])}</strong>
                    <div className="cart-item-bottom">
                      <div className="quantity-stepper compact-stepper">
                        <button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={() => onChangeQuantity(product.id, -1)}>−</button>
                        <span>{cart[product.id]}</span>
                        <button type="button" aria-label={`Increase ${product.name} quantity`} disabled={cart[product.id] >= product.quantity} onClick={() => onChangeQuantity(product.id, 1)}>+</button>
                      </div>
                      <button type="button" className="remove-button" onClick={() => onRemove(product.id)}>Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <button type="button" className="remove-button" onClick={onClear}>Clear cart</button>
              <div className="cart-total-line"><span>Cart total</span><strong>{formatCurrency(grandTotal)}</strong></div>
              <p>Taxes and shipping calculated at checkout.</p>
              <button type="button" className="button button-dark checkout-button" onClick={closeDrawer}>Continue exploring <span aria-hidden="true">↗</span></button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
