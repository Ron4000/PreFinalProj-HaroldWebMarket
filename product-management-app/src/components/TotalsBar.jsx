import { formatCurrency } from '../utils/formatCurrency'

export default function TotalsBar({ products, filteredProducts }) {
  const inventoryTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const filteredTotal = filteredProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)

  return (
    <section className="totals-section" aria-label="Inventory totals">
      <div className="totals-inner">
        <div className="totals-intro"><span className="eyebrow">THE BIG PICTURE</span><h2>Inventory at a glance</h2></div>
        <div className="total-metric"><span>Inventory total</span><strong>{formatCurrency(inventoryTotal)}</strong><small>Across {products.length} products</small></div>
        <div className="total-divider" />
        <div className="total-metric"><span>Current view</span><strong>{formatCurrency(filteredTotal)}</strong><small>Filtered collection value</small></div>
      </div>
    </section>
  )
}
