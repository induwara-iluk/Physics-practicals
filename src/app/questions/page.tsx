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
    <div className="page-wrapper" style={{ minHeight: '100vh', paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="main-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Structured Essay Bank
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Browse and practice individual structured essay questions from past A/L papers.
          </p>

          <div className="search-box" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '1rem',
            padding: '0.5rem 1.25rem'
          }}>
            <svg style={{ width: '1.25rem', color: 'rgba(255,255,255,0.3)', marginRight: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search questions by year, exam, or topic..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                flex: 1, 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: 'white', 
                padding: '0.75rem 0',
                fontSize: '1rem'
              }}
            />
          </div>

          <div className="medium-selector-bar" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div className="medium-toggle" style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '0.5rem', 
              background: 'rgba(0,0,0,0.3)', 
              padding: '0.25rem', 
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.05)',
              width: '100%',
              maxWidth: '300px'
            }}>
              <button 
                onClick={() => handleMediumChange('English')}
                className={`medium-btn ${selectedMedium === 'English' ? 'active' : ''}`}
                style={{ 
                  padding: '0.65rem', 
                  border: 'none', 
                  borderRadius: '0.6rem', 
                  background: selectedMedium === 'English' ? 'var(--primary)' : 'transparent',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                English
              </button>
              <button 
                onClick={() => handleMediumChange('Sinhala')}
                className={`medium-btn ${selectedMedium === 'Sinhala' ? 'active' : ''}`}
                style={{ 
                  padding: '0.65rem', 
                  border: 'none', 
                  borderRadius: '0.6rem', 
                  background: selectedMedium === 'Sinhala' ? 'var(--primary)' : 'transparent',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                සිංහල
              </button>
            </div>
          </div>
        </header>

        <main>
          {loading ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem' }}>Loading question bank...</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No questions match your search.</div>
              ) : (
                filteredQuestions.map((q) => (
                  <Link 
                    key={q._id} 
                    href={`/question/${q._id}`} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1.5rem', 
                      padding: '1.25rem', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '1rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                    className="question-card-link"
                  >
                    <div style={{ 
                      width: '3.5rem', 
                      height: '3.5rem', 
                      background: 'rgba(124, 110, 242, 0.1)', 
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
                      <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        {q.title || `${q.source?.exam} Structured Essay`}
                      </h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {q.source?.year} • {q.source?.exam} • {q.difficulty}
                      </span>
                    </div>
                    <svg style={{ width: '1.25rem', color: 'rgba(255,255,255,0.2)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .question-card-link:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
