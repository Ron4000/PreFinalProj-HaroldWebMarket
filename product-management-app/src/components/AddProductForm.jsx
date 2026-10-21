import { useEffect, useRef, useState } from 'react'

const initialForm = {
  image: '',
  name: '',
  category: '',
  description: '',
  specification: '',
  rating: '',
  price: '',
  quantity: '',
}

const fieldLabels = {
  image: 'Feature image URL',
  name: 'Product name',
  category: 'Category',
  description: 'Description',
  specification: 'Product specification',
  rating: 'Rating',
  price: 'Price',
  quantity: 'Quantity',
}

export default function AddProductForm({ categories, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const firstFieldRef = useRef(null)

  useEffect(() => {
    firstFieldRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    Object.entries(fieldLabels).forEach(([field, label]) => {
      if (!String(form[field]).trim()) nextErrors[field] = `${label} is required.`
    })
    if (form.image.trim() && !/^https?:\/\/\S+/i.test(form.image.trim())) {
      nextErrors.image = 'Enter a valid image URL beginning with http:// or https://.'
    }
    if (form.rating.trim() && (!Number.isFinite(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5)) {
      nextErrors.rating = 'Rating must be between 0 and 5.'
    }
    if (form.price.trim() && (Number(form.price) <= 0 || !Number.isFinite(Number(form.price)))) {
      nextErrors.price = 'Price must be greater than 0.'
    }
    if (form.quantity.trim() && (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0)) {
      nextErrors.quantity = 'Quantity must be a whole number of 0 or more.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    const image = form.image.trim()
    onSubmit({
      id: `local-${Date.now()}`,
      image,
      images: [image],
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      specification: form.specification.trim(),
      rating: Number(form.rating),
      price: Number(form.price),
      quantity: Number(form.quantity),
      brand: '',
      reviews: [],
      discountPercentage: 0,
    })
    setForm(initialForm)
    setErrors({})
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
        <div className="modal-heading">
          <div><span className="eyebrow">MAKE IT YOURS</span><h2 id="add-product-title">Add a product</h2></div>
          <button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field form-field-wide">
              <span>Feature image URL <b>*</b></span>
              <input ref={firstFieldRef} name="image" type="url" value={form.image} onChange={updateField} placeholder="https://example.com/product.jpg" aria-invalid={Boolean(errors.image)} />
              {errors.image && <small className="field-error">{errors.image}</small>}
              {form.image && <img className="image-preview" src={form.image} alt="Product preview" onError={(event) => { event.currentTarget.style.display = 'none' }} onLoad={(event) => { event.currentTarget.style.display = 'block' }} />}
            </label>
            <label className="form-field">
              <span>Product name <b>*</b></span>
              <input name="name" value={form.name} onChange={updateField} placeholder="e.g. Linen table runner" aria-invalid={Boolean(errors.name)} />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>
            <label className="form-field">
              <span>Category <b>*</b></span>
              <select name="category" value={form.category} onChange={updateField} aria-invalid={Boolean(errors.category)}>
                <option value="">Choose a category</option>
                {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
                {!categories.length && <option value="uncategorized">Uncategorized</option>}
              </select>
              {errors.category && <small className="field-error">{errors.category}</small>}
            </label>
            <label className="form-field form-field-wide">
              <span>Description <b>*</b></span>
              <textarea name="description" value={form.description} onChange={updateField} rows="3" placeholder="Tell us what makes it special..." aria-invalid={Boolean(errors.description)} />
              {errors.description && <small className="field-error">{errors.description}</small>}
            </label>
            <label className="form-field form-field-wide">
              <span>Product specification <b>*</b></span>
              <textarea name="specification" value={form.specification} onChange={updateField} rows="3" placeholder="Materials, dimensions, care..." aria-invalid={Boolean(errors.specification)} />
              {errors.specification && <small className="field-error">{errors.specification}</small>}
            </label>
            <label className="form-field">
              <span>Rating <b>*</b></span>
              <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={updateField} placeholder="4.5" aria-invalid={Boolean(errors.rating)} />
              {errors.rating && <small className="field-error">{errors.rating}</small>}
            </label>
            <label className="form-field">
              <span>Price (USD) <b>*</b></span>
              <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={updateField} placeholder="0.00" aria-invalid={Boolean(errors.price)} />
              {errors.price && <small className="field-error">{errors.price}</small>}
            </label>
            <label className="form-field">
              <span>Quantity <b>*</b></span>
              <input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={updateField} placeholder="0" aria-invalid={Boolean(errors.quantity)} />
              {errors.quantity && <small className="field-error">{errors.quantity}</small>}
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="button button-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-dark">Add product <span aria-hidden="true">↗</span></button>
          </div>
        </form>
      </section>
    </div>
  )
}
