import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { normalizedDefaults } from '../utils/normalizeProduct'

export default function HeroSlider({ products }) {
  const slides = useMemo(() => {
    const source = products.length ? products : normalizedDefaults
    return Array.from({ length: 5 }, (_, index) => source[index % source.length])
  }, [products])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return undefined
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length)
    }, 5000)
    return () => window.clearInterval(interval)
  }, [isPaused, slides.length])

  const activeProduct = slides[activeIndex]
  const goTo = (direction) => setActiveIndex((index) => (index + direction + slides.length) % slides.length)

  return (
    <section
      className="hero-slider"
      aria-label="Featured collection"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
      }}
    >
      <div className="hero-copy">
        <span className="eyebrow hero-eyebrow">THE CONSIDERED EDIT · 0{activeIndex + 1}</span>
        <h1>Good things,<br /><em>well chosen.</em></h1>
        <p>Discover thoughtful finds for the spaces, rituals, and moments that make a day.</p>
        <Link to={`/product/${activeProduct.id}`} className="button button-light">Explore the edit <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="hero-image-wrap">
        <img key={activeProduct.image} src={activeProduct.image} alt={activeProduct.name} className="hero-image" />
        <div className="hero-product-caption">
          <span>THE EVERYDAY FAVORITE</span>
          <strong>{activeProduct.name}</strong>
        </div>
      </div>
      <button className="hero-arrow hero-prev" type="button" onClick={() => goTo(-1)} aria-label="Previous slide">←</button>
      <button className="hero-arrow hero-next" type="button" onClick={() => goTo(1)} aria-label="Next slide">→</button>
      <div className="hero-dots" role="tablist" aria-label="Choose a slide">
        {slides.map((slide, index) => (
          <button
            key={`${slide.id}-${index}`}
            type="button"
            className={index === activeIndex ? 'hero-dot is-active' : 'hero-dot'}
            aria-label={`Slide ${index + 1}`}
            aria-selected={index === activeIndex}
            role="tab"
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}
