export default function Toast({ message }) {
  return (
    <div className={`toast${message ? ' is-visible' : ''}`} role="status" aria-live="polite">
      <span aria-hidden="true">✓</span>{message}
    </div>
  )
}
