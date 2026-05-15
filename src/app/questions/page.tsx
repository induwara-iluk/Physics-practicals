'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuestionsListPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
    return matchesMedium && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="main-container">
        <header className="hero-section mb-12">
          <h1 className="hero-title">Structured Essay Bank</h1>
          <p className="subtitle" style={{ margin: '0 auto' }}>
            Browse and practice individual structured essay questions from past A/L papers.
          </p>

          <div className="medium-selector-bar" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
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
          <div className="panel-search mb-8">
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
          </div>

          {loading ? (
            <div className="loading">Loading question bank...</div>
          ) : (
            <div className="list-body">
              {filteredQuestions.length === 0 ? (
                <div className="empty-state">No questions match your search.</div>
              ) : (
                filteredQuestions.map((q) => (
                  <Link 
                    key={q._id} 
                    href={`/question/${q._id}`} 
                    className="practical-card"
                    style={{ padding: '1.25rem' }}
                  >
                    <div className="p-number-box" style={{ 
                      width: '3.5rem', 
                      height: '3.5rem', 
                      background: '#f1f5f9', 
                      borderRadius: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      fontWeight: '800',
                      fontSize: '1.1rem'
                    }}>
                      Q{q.questionNumber}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="p-title" style={{ margin: 0, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        {q.title || `${q.source?.exam} Structured Essay`}
                      </h3>
                      <span className="p-category">
                        {q.source?.year} • {q.source?.exam} • {q.difficulty}
                      </span>
                    </div>
                    <div className="card-action">
                      <svg className="item-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
