import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddProductForm from './components/AddProductForm'
import CartDrawer from './components/CartDrawer'
import TotalsBar from './components/TotalsBar'
import Toast from './components/Toast'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import { fetchCategories, fetchFeaturedProducts, fetchProducts, normalizedDefaults } from './utils/api'
import './styles/app.css'

function AppContent() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [highlightedId, setHighlightedId] = useState(null)
  const toastTimer = useRef(null)
  const requestId = useRef(0)

  const notify = useCallback((message) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3200)
  }, [])
  const closeForm = useCallback(() => setIsFormOpen(false), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const loadData = useCallback(async () => {
    const [productResult, categoryResult, featuredResult] = await Promise.allSettled([
      fetchProducts(),
      fetchCategories(),
      fetchFeaturedProducts(),
    ])

    const loadedProducts = productResult.status === 'fulfilled' ? productResult.value : normalizedDefaults
    const loadedCategories = categoryResult.status === 'fulfilled'
      ? categoryResult.value
      : [...new Set(normalizedDefaults.map((product) => product.category))]
        .map((slug) => ({ slug, name: slug.replaceAll('-', ' ') }))
    const loadedFeatured = featuredResult.status === 'fulfilled'
      ? featuredResult.value
      : [...loadedProducts].sort((a, b) => b.rating - a.rating).slice(0, 4)
    let error = ''

    if (productResult.status === 'rejected') {
      error = 'We could not reach the product catalog. Showing a few sample products instead.'
    } else if (categoryResult.status === 'rejected') {
      error = 'Some catalog data could not be loaded. You can retry to refresh it.'
    }

    return { products: loadedProducts, categories: loadedCategories, featured: loadedFeatured, error }
  }, [])

  const applyLoadResult = useCallback((result) => {
    setProducts(result.products)
    setCategories(result.categories)
    setFeatured(result.featured)
    setLoadError(result.error)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let isCurrent = true
    const request = ++requestId.current
    loadData().then((result) => {
      if (isCurrent && request === requestId.current) applyLoadResult(result)
    })
    return () => {
      isCurrent = false
      requestId.current += 1
    }
  }, [applyLoadResult, loadData])

  const retryData = () => {
    const request = ++requestId.current
    setIsLoading(true)
    setLoadError('')
    loadData().then((result) => {
      if (request === requestId.current) applyLoadResult(result)
    })
  }

  const filteredProducts = useMemo(() => selectedCategory === 'all'
    ? products
    : products.filter((product) => product.category === selectedCategory), [products, selectedCategory])
  const cartCount = useMemo(() => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0), [cart])

  const changeCartQuantity = (productId, change) => {
    const product = products.find((item) => String(item.id) === String(productId))
    if (!product) return
    setCart((currentCart) => {
      const nextQuantity = (currentCart[productId] || 0) + change
      if (nextQuantity <= 0) {
        const nextCart = { ...currentCart }
        delete nextCart[productId]
        return nextCart
      }
      if (nextQuantity > product.quantity) return currentCart
      return { ...currentCart, [productId]: nextQuantity }
    })
    if (change > 0) notify('Added to your cart')
    if (change < 0) notify('Cart updated')
  }

  const removeFromCart = (productId) => {
    setCart((currentCart) => {
      const nextCart = { ...currentCart }
      delete nextCart[productId]
      return nextCart
    })
    notify('Removed from your cart')
  }

  const addProduct = (newProduct) => {
    setProducts((currentProducts) => [newProduct, ...currentProducts])
    setSelectedCategory('all')
    setIsFormOpen(false)
    setHighlightedId(newProduct.id)
    notify('Your product was added successfully')
    window.setTimeout(() => {
      document.getElementById(`product-${newProduct.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => setHighlightedId(null), 2400)
    }, 100)
  }

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} onAddProduct={() => setIsFormOpen(true)} />
      <Routes>
        <Route path="/" element={
          <Home
            products={products}
            featured={featured}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            filteredProducts={filteredProducts}
            onAddProduct={() => setIsFormOpen(true)}
            isLoading={isLoading}
            loadError={loadError}
            onRetry={retryData}
            cart={cart}
            onChangeCart={changeCartQuantity}
            highlightedId={highlightedId}
          />
        } />
        <Route path="/product/:id" element={
          <ProductDetail products={products} cart={cart} onChangeCart={changeCartQuantity} isLoading={isLoading} />
        } />
        <Route path="*" element={<ProductDetail products={products} cart={cart} onChangeCart={changeCartQuantity} isLoading={isLoading} />} />
      </Routes>
      <TotalsBar products={products} filteredProducts={filteredProducts} />
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        products={products}
        cart={cart}
        onChangeQuantity={changeCartQuantity}
        onRemove={removeFromCart}
        onClear={() => {
          setCart({})
          notify('Cart cleared')
        }}
      />
      {isFormOpen && <AddProductForm categories={categories} onClose={closeForm} onSubmit={addProduct} />}
      <Toast message={toast} />
    </BrowserRouter>
  )
}

export default function App() {
  return <AppContent />
}
