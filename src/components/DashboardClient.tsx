'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Practical {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortText: string;
  diagrams: string[];
  medium: 'English' | 'Sinhala';
  practicalNumber?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  estimatedTime?: string;
}

export default function DashboardClient({ initialPracticals }: { initialPracticals: Practical[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedMedium, setSelectedMedium] = useState<'English' | 'Sinhala'>('English');
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  
  useEffect(() => {
    const savedMedium = localStorage.getItem('physicsMedium');
    if (savedMedium === 'English' || savedMedium === 'Sinhala') {
      setSelectedMedium(savedMedium);
    }
    
    const savedCompleted = localStorage.getItem('completedPracticals');
    if (savedCompleted) {
      setCompletedSlugs(JSON.parse(savedCompleted));
    }
  }, []);

  const handleMediumChange = (m: 'English' | 'Sinhala') => {
    setSelectedMedium(m);
    localStorage.setItem('physicsMedium', m);
  };

  const categories = useMemo(() => {
    const filteredByMedium = initialPracticals.filter(p => (p.medium || 'English') === selectedMedium);
    const uniqueCats = [...new Set(filteredByMedium.map(p => p.category))];
    
    // Sort categories based on the numeric part of "Q1)", "Q2)" etc.
    return ['All', ...uniqueCats.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    })];
  }, [initialPracticals, selectedMedium]);

  const filteredPracticals = useMemo(() => {
    const filtered = initialPracticals.filter(p => {
      const matchesMedium = (p.medium || 'English') === selectedMedium;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesMedium && matchesSearch && matchesCategory;
    });

    // Sort by practical number
    return filtered.sort((a, b) => (a.practicalNumber || 0) - (b.practicalNumber || 0));
  }, [search, activeCategory, initialPracticals, selectedMedium]);

  const cleanLabel = (label: string) => label.replace(/^Q\d+\)\s*/i, '');

  return (
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
              {cleanLabel(cat)}
            </button>
          ))}
        </nav>
      </aside>

      {/* List */}
      <main className="list-panel animate-up" id="practicals-list" style={{ animationDelay: '0.25s' }}>
        <div className="panel-search" style={{ marginBottom: '1.5rem' }}>
          <div className="search-box">
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
          {filteredPracticals.length === 0 ? (
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
              const imgSrc = hasImage ? p.diagrams[0] : undefined;
              const isCompleted = completedSlugs.includes(p.slug);
              const pNum = p.practicalNumber || 'N/A';

              return (
                <Link key={p._id || p.slug} href={`/practical/${p.slug}`} className={`practical-card ${isCompleted ? 'completed' : ''}`}>
                  <div className="card-thumb">
                    {hasImage ? (
                      <img src={imgSrc} alt="" className="card-img" />
                    ) : (
                      <div className="card-placeholder">
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="caliper-icon"
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
                    )}
                    <div className="difficulty-badge" data-level={p.difficulty}>
                      {p.difficulty}
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <span className="p-number">#{pNum}</span>
                      <span className="p-category">{cleanLabel(p.category)}</span>
                      {isCompleted && <span className="status-badge">Completed</span>}
                    </div>
                    
                    <h3 className="p-title">{cleanLabel(p.title)}</h3>
                    
                    <div className="card-footer">
                      <div className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>{p.estimatedTime}</span>
                      </div>
                      <div className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        <span>{p.medium}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-action">
                    <svg className="item-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
