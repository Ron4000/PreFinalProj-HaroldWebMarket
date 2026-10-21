import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand-lockup"><span className="brand-mark">h.</span><span>harold market<span className="brand-period">.</span></span></Link>
          <p>Thoughtful things for living beautifully.</p>
        </div>
        <div className="footer-note"><span>MADE WITH INTENTION</span><p>A little less, a little better.<br />That’s the idea.</p></div>
        <div className="footer-copy">© 2026 Harold Market.<br />An academic product management project.</div>
      </div>
      <div className="footer-bottom"><span>Computer Communication Development Institute</span><span>GOOD THINGS, WELL CHOSEN. <b>↗</b></span></div>
    </footer>
  )
}
