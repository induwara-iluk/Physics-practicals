'use client';

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container glass-dark">
        <Link href="/" className="logo">
          <span className="logo-icon">Φ</span>
          <span className="logo-text">PHYSICS<span className="logo-light">LAB</span></span>
        </Link>
        
        <div className="nav-links">
          <Link href="/experiments" className="nav-link">Experiments</Link>
          <Link href="/simulations" className="nav-link">Simulations</Link>
          <Link href="/about" className="nav-link">About</Link>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="btn btn-outline small-btn">Sign In</Link>
          <Link href="/get-started" className="btn btn-primary small-btn">Get Started</Link>
        </div>
      </div>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: center;
        }

        .nav-container {
          width: 100%;
          max-width: 1000px;
          border-radius: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 2rem;
          transition: all 0.3s ease;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: white;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .logo-icon {
          width: 2rem;
          height: 2rem;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .logo-light {
          color: var(--text-muted);
          font-weight: 400;
        }

        .nav-links {
          display: none;
          gap: 1.5rem;
          align-items: center;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }

        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: white;
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .small-btn {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
