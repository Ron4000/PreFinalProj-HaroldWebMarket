import { Link, NavLink } from 'react-router-dom'

export default function Navbar({ cartCount, onOpenCart, onAddProduct }) {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Link to="/" className="brand-lockup" aria-label="Harold Market home">
          <span className="brand-mark">h.</span>
          <span>harold market<span className="brand-period">.</span></span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <Link to="/#products">Products</Link>
          <button className="nav-add-link" type="button" onClick={onAddProduct}>Add New</button>
        </div>
        <button className="cart-trigger" type="button" onClick={onOpenCart} aria-label={`Open cart, ${cartCount} items`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
          <span className="cart-label">Cart</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </nav>
    </header>
  )
}
