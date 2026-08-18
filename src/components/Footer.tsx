'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="logo-box">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'white', display: 'block' }}
                >
                  {/* Main scale beam */}
                  <path d="M3 9h18v2H3z" fill="currentColor" fillOpacity="0.1" />
                  {/* Tick marks */}
                  <path d="M6 9v2M9 9v2M12 9v2M15 9v2M18 9v2" strokeWidth="1.5" />
                  {/* Fixed Jaw (left) */}
                  <path d="M3 9V3c0-0.8 0.7-1.5 1.5-1.5H5" />
                  <path d="M3 11v7c0 1.1 0.9 2 2 2h0.5" />
                  {/* Sliding Jaw (center) */}
                  <path d="M11 9V4c0-0.8 0.7-1.5 1.5-1.5H13" />
                  <path d="M11 11v6c0 1.1 0.9 2 2 2h0.5" />
                </svg>
              </div>
              <span className="logo-text">ilukpracticals.online</span>
            </Link>
            <p className="footer-tagline">
              A complete platform to learn, practice, and master G.C.E. A/L Physics Practicals.
            </p>
            <div className="social-links">
              <a 
                href="https://www.youtube.com/@induwara_iluk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-btn youtube"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          <div className="footer-info">
            <h4 className="info-title">Created by</h4>
            <div className="creator-details">
              <span className="creator-name">Induwara Ilukkumbura</span>
              <ul className="creator-creds">
                <li>Fourth-Year Undergraduate, University of Moratuwa</li>
                <li>Founder of the Study Guide YouTube Channel</li>
                <li>Physics Teacher with 4+ Years of Experience</li>
              </ul>
            </div>
          </div>

          <div className="footer-mission">
            <h4 className="info-title">Our Mission</h4>
            <p>
              Helping Sri Lankan students achieve A grades in Physics and enter top universities.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © 2026 <span className="highlight">ilukpracticals.online</span>. All Rights Reserved. 🇱🇰
          </div>
          <div className="footer-nav">
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          margin-top: 4rem;
          padding: 4rem 1.5rem 2rem;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 10;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 1.2fr 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          margin-bottom: 1.5rem;
        }

        .logo-box {
          width: 2.5rem;
          height: 2.5rem;
          background: var(--primary);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
        }

        .logo-text {
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--text);
          letter-spacing: -0.02em;
        }

        .footer-tagline {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 320px;
        }

        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: #ff0000;
          color: white;
          text-decoration: none;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
        }

        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 0, 0, 0.3);
          background: #e60000;
        }

        .info-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--primary);
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .creator-name {
          display: block;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 1rem;
        }

        .creator-creds {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .creator-creds li {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
          position: relative;
          padding-left: 1.25rem;
        }

        .creator-creds li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--primary);
        }

        .footer-mission p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .copyright {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .highlight {
          color: var(--text);
          font-weight: 600;
        }

        .footer-nav {
          display: flex;
          gap: 2rem;
        }

        .footer-nav a {
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s;
        }

        .footer-nav a:hover {
          color: var(--primary);
        }

        @media (max-width: 968px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
          .footer-mission {
            grid-column: span 2;
          }
        }

        @media (max-width: 640px) {
          .footer {
            padding: 3rem 1.5rem 2rem;
          }
          .footer-top {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            margin-bottom: 3rem;
          }
          .footer-mission {
            grid-column: span 1;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          .footer-nav {
            justify-content: center;
            gap: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
