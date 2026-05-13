'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      <nav className="navbar">
        {/* Ambient glow */}
        <div className="navbar-glow" />

        <div className="nav-container">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-box">
              <span className="logo-symbol">Φ</span>
            </div>

            <div className="logo-content">
              <span className="logo-title">
                PHYSICS<span className="logo-dim">LAB</span>
              </span>
              <span className="logo-subtitle">Practical Practice Platform</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link href="/" className={`nav-btn ${pathname === '/' ? 'active' : ''}`}>
              <span>Practicals</span>
            </Link>

            <Link href="/questions" className={`nav-btn ${pathname === '/questions' ? 'active' : ''}`}>
              <span>Questions</span>
            </Link>

            <Link href="/practice-papers" className={`nav-btn featured ${pathname === '/practice-papers' ? 'active' : ''}`}>
              <span>Papers</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <Link href="/admin" className="admin-trigger" title="Admin Panel">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      <style jsx>{`
        /* ================================
           NAVBAR WRAPPER
        ================================== */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 1.25rem 0;
          pointer-events: none;
        }

        .nav-container,
        .logo,
        .nav-links,
        .nav-actions {
          pointer-events: auto;
        }

        /* Floating glow behind navbar */
        .navbar-glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 240px;
          background:
            radial-gradient(
              circle,
              rgba(124, 110, 242, 0.18),
              transparent 70%
            );
          filter: blur(40px);
          pointer-events: none;
          z-index: -1;
        }

        /* ================================
           MAIN CONTAINER
        ================================== */
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 0.85rem 1.5rem;

          background: rgba(10, 12, 24, 0.75);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);

          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.5rem;

          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 0 40px rgba(124, 110, 242, 0.08);
        }

        /* ================================
           LOGO
        ================================== */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          text-decoration: none;
          color: white;
          flex-shrink: 0;
        }

        .logo-box {
          position: relative;
          width: 3rem;
          height: 3rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(135deg,
              rgba(124, 110, 242, 1),
              rgba(72, 210, 255, 1)
            );

          box-shadow:
            0 10px 25px rgba(124, 110, 242, 0.45),
            inset 0 1px 2px rgba(255, 255, 255, 0.3);
        }

        .logo-box::before {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.25),
              rgba(255, 255, 255, 0.02)
            );
          opacity: 0.8;
        }

        .logo-symbol {
          position: relative;
          z-index: 1;
          font-size: 1.35rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
        }

        .logo-content {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .logo-title {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #ffffff;
        }

        .logo-dim {
          color: rgba(255, 255, 255, 0.45);
          font-weight: 500;
        }

        .logo-subtitle {
          margin-top: 0.15rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8fd8ff;
        }

        /* ================================
           NAV LINKS
        ================================== */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex: 1;
          justify-content: center;
        }

        .nav-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0.65rem 1.25rem;
          border-radius: 0.75rem;

          color: rgba(255, 255, 255, 0.45);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;

          border: 1px solid transparent;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        .nav-btn.active {
          color: white;
          background: rgba(124, 110, 242, 0.12);
          border-color: rgba(124, 110, 242, 0.2);
        }

        /* Featured Button - Papers */
        .nav-btn.featured {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-btn.featured:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* ================================
           ADMIN BUTTON
        ================================== */
        .nav-actions {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .admin-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.8rem;
          height: 2.8rem;
          border-radius: 999px;

          color: rgba(255, 255, 255, 0.45);
          text-decoration: none;

          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.03);

          transition: all 0.3s ease;
        }

        .admin-trigger:hover {
          color: white;
          background: rgba(124, 110, 242, 0.12);
          border-color: rgba(124, 110, 242, 0.25);
          transform: rotate(45deg) scale(1.05);
          box-shadow: 0 8px 20px rgba(124, 110, 242, 0.18);
        }

        /* ================================
           MOBILE
        ================================== */
        @media (max-width: 768px) {
          .navbar {
            padding: 0.75rem 0.75rem 0;
          }

          .nav-container {
            padding: 0.75rem 1rem;
            gap: 0.75rem;
            border-radius: 1.25rem;
          }

          .logo-content {
            display: none;
          }

          .nav-btn span:last-child {
            display: none;
          }

          .nav-btn {
            padding: 0.7rem 0.85rem;
          }

          .nav-links {
            gap: 0.4rem;
          }

          .admin-trigger {
            width: 2.5rem;
            height: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0.65rem 0.85rem;
          }

          .logo-box {
            width: 2.6rem;
            height: 2.6rem;
          }

          .nav-btn {
            padding: 0.65rem 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;