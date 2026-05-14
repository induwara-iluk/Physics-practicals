'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'practicals' | 'questions'>('practicals');
  const [dbPracticals, setDbPracticals] = useState<any[]>([]);
  const [dbQuestions, setDbQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedium, setSelectedMedium] = useState<'English' | 'Sinhala'>('English');
  
  useEffect(() => {
    const saved = localStorage.getItem('physicsMedium');
    if (saved === 'English' || saved === 'Sinhala') {
      setSelectedMedium(saved);
    }
  }, []);

  const handleMediumChange = (m: 'English' | 'Sinhala') => {
    setSelectedMedium(m);
    localStorage.setItem('physicsMedium', m);
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/practicals').then(res => res.json()),
      fetch('/api/admin/questions').then(res => res.json())
    ])
      .then(([practicalsData, questionsData]) => {
        if (Array.isArray(practicalsData)) setDbPracticals(practicalsData);
        if (Array.isArray(questionsData)) setDbQuestions(questionsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const filteredByMedium = dbPracticals.filter(p => p.medium === selectedMedium || !p.medium); // fallback for old data
    return ['All', ...new Set(filteredByMedium.map(p => p.category))];
  }, [dbPracticals, selectedMedium]);

  const filteredPracticals = useMemo(() => {
    return dbPracticals.filter(p => {
      const matchesMedium = (p.medium || 'English') === selectedMedium;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesMedium && matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, dbPracticals, selectedMedium]);

  return (
    <div className="page-wrapper">
      <div className="noise-overlay" />
      <div className="bg-radial" />

      <div className="main-container">
        {/* Header */}
        {/* Space below Navbar */}
        <div style={{ height: '6rem' }}></div>

        {/* Body */}
        <div className="body-layout">
          {/* Sidebar */}
          <aside className="sidebar animate-up" style={{ animationDelay: '0.15s' }}>
            <div className="medium-selector-card glass-dark">
              <p className="sidebar-label">Select Your Medium</p>
              <div className="medium-toggle">
                <button 
                  className={`medium-btn ${selectedMedium === 'English' ? 'active' : ''}`}
                  onClick={() => handleMediumChange('English')}
                >
                  English
                </button>
                <button 
                  className={`medium-btn ${selectedMedium === 'Sinhala' ? 'active' : ''}`}
                  onClick={() => handleMediumChange('Sinhala')}
                >
                  සිංහල
                </button>
              </div>
            </div>

            <p className="sidebar-label" style={{ marginTop: '2rem' }}>Categories</p>
            <nav className="cat-nav hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </aside>

          {/* List */}
          <main className="list-panel animate-up" style={{ animationDelay: '0.25s' }}>
            <div className="panel-search" style={{ marginBottom: '1.5rem' }}>
              <div className="search-box" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search experiments…"
                  className="search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="clear-btn" aria-label="Clear search">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="list-body">
              {loading ? (
                <div className="empty-state">
                  <span className="loading-spinner" />
                  <p>Loading...</p>
                </div>
              ) : (
                // PRACTICALS LIST
                filteredPracticals.length === 0 ? (
                  <div className="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32" style={{ opacity: 0.3 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>No results for &ldquo;{search}&rdquo;</p>
                    <button onClick={() => setSearch('')} className="clear-link">Clear search</button>
                  </div>
                ) : (
                  filteredPracticals.map((p) => {
                    const titleOnly = p.title.replace(/^\d+\.\s*/, '');
                    const hasImage = p.diagrams && p.diagrams.length > 0;
                    const imgSrc = hasImage ? p.diagrams[0] : null;

                    return (
                      <Link key={p._id || p.slug} href={`/practical/${p.slug}`} className="list-item">
                        <div className="item-thumb">
                          {hasImage ? (
                            <img src={imgSrc} alt="" className="item-img" />
                          ) : (
                            <div className="item-placeholder" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))' }} />
                          )}
                        </div>

                        <span className="item-body">
                          <span className="item-title">{titleOnly}</span>
                        </span>

                        <svg className="item-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    );
                  })
                )
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="phi">Φ</span>
            PHYSICS<span className="logo-dim">LAB</span>
          </div>
          <p className="footer-copy">
            Designed for excellence. Built for the future of physics education.
          </p>
        </div>
      </footer>

      <style jsx>{`
        /* ── Tokens ── */
        :root {
          --bg:         #0a0a0f;
          --surface:    rgba(255,255,255,0.035);
          --border:     rgba(255,255,255,0.07);
          --border-md:  rgba(255,255,255,0.12);
          --primary:    #7c6ef2;
          --primary-bg: rgba(124,110,242,0.12);
          --text-hi:    rgba(255,255,255,0.92);
          --text-md:    rgba(255,255,255,0.55);
          --text-lo:    rgba(255,255,255,0.30);
          --radius-sm:  8px;
          --radius-md:  12px;
          --radius-lg:  18px;
          --font-sans:  'Inter var', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono:  'JetBrains Mono', 'Fira Code', monospace;
        }

        /* ── Base ── */
        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          color: var(--text-hi);
          font-family: var(--font-sans);
          padding-top: 4rem;
          padding-bottom: 4rem;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grain */
        .noise-overlay {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
          z-index: 0;
          pointer-events: none;
          opacity: 0.6;
        }

        .bg-radial {
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 600px;
          background: radial-gradient(ellipse at top, rgba(100, 90, 220, 0.11) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }

        .main-container {
          position: relative;
          z-index: 1;
          max-width: 1140px;
          width: 100%;
          margin: 0 auto;
          padding: 0 1.75rem;
          flex: 1;
        }

        /* ── Header ── */
        .header {
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          border-radius: 9999px;
          border: 1px solid var(--border-md);
          background: var(--surface);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-md);
          margin-bottom: 2.25rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 6px var(--primary);
          animation: pulse 2.4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        .title {
          font-size: clamp(1.4rem, 4vw, 2.5rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
          background: linear-gradient(160deg, #fff 40%, rgba(255,255,255,0.45));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 0.95rem;
          color: var(--text-md);
          max-width: 32rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        /* ── Search ── */
        .search-wrap {
          width: 100%;
          max-width: 36rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 9999px;
          padding: 0.375rem 0.75rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-box:focus-within {
          border-color: rgba(124,110,242,0.45);
          box-shadow: 0 0 0 3px rgba(124,110,242,0.08);
        }

        .search-icon {
          width: 1.1rem;
          height: 1.1rem;
          color: var(--text-lo);
          flex-shrink: 0;
          margin-left: 0.25rem;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.9375rem;
          font-family: var(--font-sans);
          color: var(--text-hi);
          padding: 0.65rem 0.25rem;
        }

        .search-input::placeholder { color: var(--text-lo); }

        .clear-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          color: var(--text-md);
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .clear-btn:hover {
          background: rgba(255,255,255,0.14);
          color: white;
        }

        /* ── Body layout ── */
        .body-layout {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: flex-start;
        }

        /* ── Sidebar ── */
        .sidebar {
          width: 100%;
          flex-shrink: 0;
        }

        .sidebar-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-lo);
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }

        .cat-nav {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding-bottom: 0.25rem;
        }

        .cat-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 0.75rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          white-space: normal;
          word-break: break-word;
          line-height: 1.4;
          transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
          text-align: left;
          min-height: 3.5rem;
          display: flex;
          align-items: center;
        }

        .cat-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          color: white;
          transform: translateY(-1px);
        }

        .cat-btn.active {
          background: rgba(124, 110, 242, 0.1);
          border-color: rgba(124, 110, 242, 0.4);
          color: #a89ef8;
          box-shadow: 0 4px 12px rgba(124, 110, 242, 0.15);
        }

        .cat-btn.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 25%;
          bottom: 25%;
          width: 3px;
          background: var(--primary);
          border-radius: 0 4px 4px 0;
        }

        /* ── List panel ── */
        .list-panel {
          width: 100%;
          flex: 1;
          background: transparent;
          border: none;
          border-radius: 0;
          overflow: visible;
        }

        .list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.018);
        }

        .list-heading {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-hi);
          letter-spacing: 0.01em;
        }

        .list-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-lo);
          background: rgba(255,255,255,0.06);
          padding: 0.15rem 0.6rem;
          border-radius: 9999px;
          font-variant-numeric: tabular-nums;
        }

        .list-body {
          display: flex;
          flex-direction: column;
        }

        /* ── List items ── */
        .list-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
          border-radius: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-decoration: none !important;
          transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
          cursor: pointer;
        }

        .list-item:last-child { border-bottom: none; }

        .list-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .item-thumb {
          width: 5.5rem;
          height: 4rem;
          flex-shrink: 0;
          border-radius: 0.75rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        }

        .item-body {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
        }

        .item-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          text-decoration: none !important;
          transition: color 0.2s;
          display: inline-block;
        }

        .list-item:hover .item-title { 
          color: white; 
        }

        .item-arrow {
          flex-shrink: 0;
          width: 1.25rem;
          height: 1.25rem;
          color: rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .list-item:hover .item-arrow {
          color: var(--primary);
          transform: translateX(5px);
        }

        /* ── Empty / loading states ── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 4rem 1.5rem;
          color: var(--text-lo);
          font-size: 0.875rem;
          text-align: center;
        }

        .loading-spinner {
          display: block;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: var(--primary);
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .clear-link {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.8125rem;
          font-weight: 500;
          font-family: var(--font-sans);
          cursor: pointer;
          padding: 0;
          opacity: 0.85;
          transition: opacity 0.15s;
        }
        .clear-link:hover { opacity: 1; }

        /* ── Footer ── */
        .footer {
          position: relative;
          z-index: 1;
          margin-top: 5rem;
          padding: 2.5rem 1.75rem;
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .footer-inner { max-width: 1140px; margin: 0 auto; }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-md);
          margin-bottom: 0.75rem;
        }

        .phi {
          width: 26px;
          height: 26px;
          background: linear-gradient(135deg, rgba(124,110,242,0.3), rgba(124,110,242,0.1));
          border: 1px solid rgba(124,110,242,0.3);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: #a89ef8;
        }

        .logo-dim { color: var(--text-lo); font-weight: 400; }

        .footer-copy {
          font-size: 0.75rem;
          color: var(--text-lo);
          line-height: 1.6;
        }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-fade {
          animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .animate-up {
          opacity: 0;
          animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ── Responsive ── */
        @media (min-width: 1024px) {
          .body-layout {
            flex-direction: row;
            gap: 3rem;
          }

          .sidebar {
            width: 20rem;
            position: sticky;
            top: 7rem;
          }

          .cat-nav {
            flex-direction: column;
            flex-wrap: nowrap;
            overflow: visible;
            gap: 0.25rem;
          }

          .cat-btn {
            width: 100%;
            text-align: left;
            padding: 0.75rem 1.25rem;
          }

          .medium-selector-card {
            padding: 1.5rem;
            border-radius: 1.5rem;
            margin-bottom: 2.5rem;
            border: 1px solid rgba(124, 110, 242, 0.2);
            background: linear-gradient(135deg, rgba(124, 110, 242, 0.05), rgba(0, 0, 0, 0.2));
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          }

          .medium-toggle {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            background: rgba(0, 0, 0, 0.3);
            padding: 0.35rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .medium-btn {
            padding: 1rem 0.5rem;
            border: none;
            border-radius: 0.75rem;
            background: transparent;
            color: var(--text-lo);
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .medium-btn:hover {
            color: var(--text-hi);
            background: rgba(255, 255, 255, 0.03);
          }

          .medium-btn.active {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 15px rgba(124, 110, 242, 0.4);
            transform: scale(1.02);
          }
        }

        /* ── Utilities ── */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}