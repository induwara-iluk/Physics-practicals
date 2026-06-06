'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuestionsListPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMedium, setSelectedMedium] = useState<'English' | 'Sinhala'>('English');
  const [filterType, setFilterType] = useState<'all' | 'past_paper' | 'model_paper'>('all');

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
    fetch('/api/admin/questions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesMedium = (q.medium || 'English') === selectedMedium;
    const matchesSearch = q.title?.toLowerCase().includes(search.toLowerCase()) ||
      q.source?.year?.toString().includes(search) ||
      q.source?.exam?.toLowerCase().includes(search.toLowerCase());
      
    const isModel = q.type === 'model' || q.source?.type === 'model_paper';
    let matchesType = true;
    if (filterType === 'past_paper') {
      matchesType = !isModel;
    } else if (filterType === 'model_paper') {
      matchesType = isModel;
    }
    
    return matchesMedium && matchesSearch && matchesType;
  });

  const groupedYears = React.useMemo(() => {
    const groups: { [year: number]: any[] } = {};
    filteredQuestions.forEach(q => {
      const isModel = q.type === 'model' || q.source?.type === 'model_paper';
      const year = isModel ? 0 : (q.source?.year || 0);
      if (!groups[year]) groups[year] = [];
      groups[year].push(q);
    });

    // Sort questions in each year group by questionNumber ascending
    Object.keys(groups).forEach(year => {
      groups[Number(year)].sort((a, b) => {
        const numA = parseInt(a.questionNumber) || 0;
        const numB = parseInt(b.questionNumber) || 0;
        return numA - numB;
      });
    });

    // Return years descending
    return Object.keys(groups)
      .map(Number)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        questions: groups[year]
      }));
  }, [filteredQuestions]);

  return (
    <div className="page-wrapper">
      <div className="noise-overlay"></div>
      <div className="bg-radial"></div>
      <div className="main-container" style={{ maxWidth: '800px' }}>
        <header className="hero-section mb-12">
          <span className="badge">
            <span className="badge-dot"></span>
            Past Papers Library
          </span>
          <h1 className="hero-title" style={{ marginBottom: '1rem' }}>Structured Essay Bank</h1>
          <p className="subtitle" style={{ margin: '0 auto' }}>
            Browse and practice G.C.E. Advanced Level structured essay questions grouped by past years.
          </p>

          <div className="medium-selector-bar" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div className="medium-toggle">
              <button 
                onClick={() => handleMediumChange('English')}
                className={`medium-btn ${selectedMedium === 'English' ? 'active' : ''}`}
              >
                English
              </button>
              <button 
                onClick={() => handleMediumChange('Sinhala')}
                className={`medium-btn ${selectedMedium === 'Sinhala' ? 'active' : ''}`}
              >
                සිංහල
              </button>
            </div>
          </div>
        </header>

        <main className="list-panel">
          <div className="panel-search mb-8" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="search-box">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search by year, exam, or topic..." 
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="filter-row">
              <div className="type-toggle">
                <button 
                  onClick={() => setFilterType('all')}
                  className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                >
                  All Questions
                </button>
                <button 
                  onClick={() => setFilterType('past_paper')}
                  className={`filter-btn ${filterType === 'past_paper' ? 'active' : ''}`}
                >
                  Past Papers
                </button>
                <button 
                  onClick={() => setFilterType('model_paper')}
                  className={`filter-btn ${filterType === 'model_paper' ? 'active' : ''}`}
                >
                  Model Papers
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading question bank...
            </div>
          ) : (
            <div className="list-body">
              {groupedYears.length === 0 ? (
                <div className="empty-state" style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2rem', 
                  background: 'white', 
                  borderRadius: '1.5rem', 
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)' 
                }}>
                  No questions match your search parameters.
                </div>
              ) : (
                groupedYears.map(({ year, questions: yearQuestions }) => (
                  <div key={year} className="year-group-box animate-up">
                    <div className="year-group-header">
                      <h2 className="year-group-title">
                        {year > 0 ? (
                          <>
                            <span className="year-badge">{year}</span>
                            G.C.E. Advanced Level
                          </>
                        ) : (
                          <>
                            <span className="year-badge model-badge">Model</span>
                            Model Papers & Questions
                          </>
                        )}
                      </h2>
                      <span className="year-count-badge">
                        {yearQuestions.length} {yearQuestions.length === 1 ? 'Question' : 'Questions'}
                      </span>
                    </div>
                    <div className="year-group-grid">
                      {yearQuestions.map((q) => (
                        <Link 
                          key={q._id} 
                          href={`/question/${q._id}`} 
                          className="question-card-small"
                          data-diff={q.difficulty?.toLowerCase()}
                        >
                          {/* Top Row: Badges & Completion Status */}
                          <div className="q-card-top">
                            <div className="q-card-badges">
                              <span className="q-card-pill">Q{q.questionNumber}</span>
                              <span className="q-card-diff">{q.difficulty || 'medium'}</span>
                            </div>
                            <div className="q-card-status unsolved">
                              <span className="status-dot"></span>
                              <span className="status-text">Unsolved</span>
                            </div>
                          </div>
                          
                          {/* Middle: Title & Pill Tags */}
                          <div className="q-card-middle">
                            <h3 className="q-card-title">
                              {q.title || `${q.source?.exam} Structured Essay`}
                            </h3>
                            <div className="q-card-tags-container">
                              {q.tags && q.tags.length > 0 ? (
                                q.tags.slice(0, 3).map((tag: string, index: number) => (
                                  <span key={index} className="q-card-tag-pill">
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="q-card-tag-pill">Structured Essay</span>
                              )}
                            </div>
                          </div>

                          {/* Bottom Row: Marks & Chevron indicator */}
                          <div className="q-card-bottom">
                            <span className="q-card-marks">
                              <svg className="marks-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {q.marks || 10} Marks
                            </span>
                            <span className="q-card-arrow-wrap">
                              <svg className="q-card-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .filter-row {
          display: flex;
          justify-content: flex-start;
        }
        .type-toggle {
          display: flex;
          background: rgba(148, 163, 184, 0.08);
          padding: 0.3rem;
          border-radius: 0.85rem;
          border: 1px solid var(--border);
          gap: 0.25rem;
        }
        .filter-btn {
          border: none;
          background: transparent;
          padding: 0.45rem 1.25rem;
          border-radius: 0.6rem;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover {
          color: var(--text);
        }
        .filter-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.01);
        }
        .model-badge {
          background: var(--secondary) !important;
          box-shadow: 0 2px 6px rgba(124, 58, 237, 0.25) !important;
        }
        .year-group-box {
          background: white;
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .year-group-box:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-color: rgba(79, 70, 229, 0.2);
        }
        .year-group-header {
          background: #f8fafc;
          padding: 1.25rem 2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .year-group-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .year-badge {
          background: var(--primary);
          color: white;
          padding: 0.2rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 800;
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
        }
        .year-count-badge {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 700;
          background: rgba(148, 163, 184, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 0.5rem;
        }
        .year-group-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
          padding: 2rem;
          background: #f8f9fa;
        }
        :global(.question-card-small) {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 1.5rem;
          text-decoration: none !important;
          color: #0f172a !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.02);
          min-height: 180px;
          justify-content: space-between;
          cursor: pointer;
        }
        :global(.question-card-small:hover) {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(79, 70, 229, 0.06), 0 4px 8px rgba(0, 0, 0, 0.02);
          border-color: rgba(79, 70, 229, 0.3);
          text-decoration: none !important;
        }
        .q-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .q-card-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .q-card-pill {
          background: rgba(79, 70, 229, 0.06);
          color: var(--primary);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-weight: 800;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(79, 70, 229, 0.08);
        }
        :global(.question-card-small:hover) .q-card-pill {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .q-card-diff {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          background: #f1f5f9;
          color: #64748b;
        }
        :global(.question-card-small[data-diff="easy"]) .q-card-diff {
          background: #ecfdf5;
          color: #059669;
        }
        :global(.question-card-small[data-diff="medium"]) .q-card-diff {
          background: #fffbeb;
          color: #d97706;
        }
        :global(.question-card-small[data-diff="hard"]) .q-card-diff {
          background: #fef2f2;
          color: #dc2626;
        }
        .q-card-status {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
        }
        .q-card-status .status-dot {
          width: 6px;
          height: 6px;
          background: #94a3b8;
          border-radius: 50%;
        }
        .q-card-status.unsolved .status-dot {
          background: #94a3b8;
        }
        .q-card-status.completed {
          background: #f0fdf4;
          border-color: #dcfce7;
          color: #16a34a;
        }
        .q-card-status.completed .status-dot {
          background: #16a34a;
        }
        .q-card-status.progress {
          background: #fffbeb;
          border-color: #fef3c7;
          color: #d97706;
        }
        .q-card-status.progress .status-dot {
          background: #d97706;
        }
        .q-card-middle {
          flex: 1;
          margin-bottom: 1.25rem;
        }
        .q-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b !important;
          text-decoration: none !important;
          margin: 0 0 0.75rem 0;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s ease;
        }
        :global(.question-card-small:hover) .q-card-title {
          color: var(--primary) !important;
          text-decoration: none !important;
        }
        .q-card-tags-container {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .q-card-tag-pill {
          font-size: 0.7rem;
          color: #475569;
          font-weight: 700;
          display: inline-block;
          background: rgba(79, 70, 229, 0.03);
          border: 1px solid rgba(226, 232, 240, 0.8);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }
        :global(.question-card-small:hover) .q-card-tag-pill {
          background: rgba(79, 70, 229, 0.08);
          border-color: rgba(79, 70, 229, 0.15);
        }
        .q-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 0.85rem;
          margin-top: auto;
        }
        .q-card-marks {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .marks-icon {
          width: 0.9rem;
          height: 0.9rem;
          color: #94a3b8;
        }
        .q-card-arrow-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .q-card-arrow-icon {
          width: 0.85rem;
          height: 0.85rem;
          color: #64748b;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        :global(.question-card-small:hover) .q-card-arrow-wrap {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
        }
        :global(.question-card-small:hover) .q-card-arrow-icon {
          color: white;
          transform: translateX(2px);
        }

        @media (max-width: 768px) {
          .year-group-grid {
            grid-template-columns: 1fr;
            padding: 1.25rem;
            gap: 1rem;
          }
          .year-group-header {
            padding: 1rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
