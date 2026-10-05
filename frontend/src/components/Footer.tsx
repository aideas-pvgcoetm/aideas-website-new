import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-watermark" aria-hidden="true">
        aIDEAS
      </div>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-name">
              <span className="ai">a</span>
              <span className="deas">IDEAS</span>
            </span>
            <p>
              The AI &amp; Data Science Association of Students at PVGCOET, Pune — built by students, for students.
            </p>

            {/* Address Block */}
            <div className="footer-address mt-4 text-xs text-zinc-400 leading-relaxed border-t border-white/10 pt-3">
              <p className="font-semibold text-zinc-200 mb-1"> Campus Address:</p>
              <p>PVG&apos;s COET &amp; GKPATIOM, 44, Vidya Nagari, Parvati, Pune, Maharashtra 411009</p>
            </div>
          </div>

          <div className="footer-col">
            <h5>Explore</h5>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/events">Events</Link>
          </div>

          <div className="footer-col">
            <h5>Community</h5>
            <Link href="/members">Members</Link>
            <Link href="/spotlight">Achievements</Link>
          </div>

          <div className="footer-col">
            <h5>Connect</h5>
            <Link href="/contact">Contact Us</Link>
            <a href="mailto:aideas@pvgcoet.ac.in">Email</a>
            <a href="https://www.instagram.com/aideas_pvg/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://www.linkedin.com/company/aideas-pvg/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} aIDEAS — AI &amp; Data Science Student Association
          </div>
          <div className="footer-social">
            <a
              href="https://www.linkedin.com/company/aideas-pvg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="aIDEAS on LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5C4.98 4.88 3.93 6 2.5 6S0 4.88 0 3.5 1.05 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8.75h4V23h-4V8.75zM8.5 8.75h3.83v1.95h.06c.53-1 1.84-2.06 3.79-2.06 4.06 0 4.81 2.67 4.81 6.14V23h-4v-6.62c0-1.58-.03-3.62-2.2-3.62-2.54 1.72-2.54 3.5V23h-4V8.75z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/aideas_pvg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="aIDEAS on Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="mailto:aideas@pvgcoet.ac.in" aria-label="Email aIDEAS">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
