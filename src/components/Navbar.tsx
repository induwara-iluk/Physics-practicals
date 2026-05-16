'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsAdmin(user?.app_metadata?.role === 'admin');
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.app_metadata?.role === 'admin');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // scrolling down
          setIsVisible(false);
        } else { // scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <nav className={`navbar ${isVisible ? '' : 'nav-hidden'}`}>
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

            <Link href="/question-history" className={`nav-btn ${pathname === '/question-history' ? 'active' : ''}`}>
              <span>History</span>
            </Link>

            <Link href="/about" className={`nav-btn ${pathname === '/about' ? 'active' : ''}`}>
              <span>About</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="nav-actions" style={{ gap: '0.75rem' }}>
            {isAdmin && (
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
            )}

            {user ? (
              <button onClick={handleSignOut} className="auth-trigger" title="Sign Out">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span className="auth-text">Sign Out</span>
              </button>
            ) : (
              <Link href="/login" className="auth-trigger" title="Sign In">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 5 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="5" y2="12"></line>
                </svg>
                <span className="auth-text">Sign In</span>
              </Link>
            )}
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
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.nav-hidden {
          transform: translateY(-100%);
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

          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);

          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 1.5rem;

          box-shadow:
            0 10px 25px rgba(0, 0, 0, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        /* ================================
           LOGO
        ================================== */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          text-decoration: none;
          color: var(--text);
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

          background: var(--primary);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .logo-symbol {
          position: relative;
          z-index: 1;
          font-size: 1.35rem;
          font-weight: 800;
          color: white;
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
          color: var(--text);
        }

        .logo-dim {
          color: var(--text-muted);
          font-weight: 500;
        }

        .logo-subtitle {
          margin-top: 0.15rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--primary);
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

          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;

          border: 1px solid transparent;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          color: var(--primary);
          background: rgba(79, 70, 229, 0.05);
        }

        .nav-btn.active {
          color: var(--primary);
          background: rgba(79, 70, 229, 0.08);
          border-color: rgba(79, 70, 229, 0.1);
        }

        /* Featured Button - Papers */
        .nav-btn.featured {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
        }

        .nav-btn.featured:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
          background: #4338ca;
        }

        /* ================================
           ADMIN BUTTON
        ================================== */
        .nav-actions {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .admin-trigger,
        .auth-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0 1.25rem;
          height: 2.8rem;
          border-radius: 999px;

          color: var(--text-muted);
          text-decoration: none;

          border: 1px solid var(--border);
          background: white;

          transition: all 0.3s ease;
          cursor: pointer;
        }

        .admin-trigger {
          width: 2.8rem;
          padding: 0;
        }

        .auth-text {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-trigger:hover,
        .auth-trigger:hover {
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .admin-trigger:hover {
          transform: rotate(45deg) translateY(-2px);
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