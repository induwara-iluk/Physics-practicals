'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuestionDisplay from '@/components/QuestionDisplay';

export default function PracticePaperPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
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
    setLoading(true);
    fetch('/api/admin/questions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter by medium first
          const mediumFiltered = data.filter(q => (q.medium || 'English') === selectedMedium);
          
          // Filter questions with numbers 1, 2, 3, 4
          const targetNumbers = ['1', '2', '3', '4'];
          let filtered = mediumFiltered.filter(q => targetNumbers.includes(q.questionNumber));
          
          // If we don't have exactly these numbers, let's just take the first 4 from the bank
          if (filtered.length < 4) {
            const others = mediumFiltered.filter(q => !targetNumbers.includes(q.questionNumber));
            filtered = [...filtered, ...others].slice(0, 4);
          }
          
          // Sort them by question number if possible
          filtered.sort((a, b) => {
            const numA = parseInt(a.questionNumber) || 999;
            const numB = parseInt(b.questionNumber) || 999;
            return numA - numB;
          });

          setQuestions(filtered);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedMedium]);

  return (
    <div className="page-wrapper">
      <div className="main-container" style={{ maxWidth: '900px' }}>
        <header className="hero-section mb-12">
          <h1 className="hero-title">Practice Paper #01</h1>
          <p className="subtitle" style={{ margin: '0 auto' }}>
            Complete all four questions in this set. Write your answers in the spaces provided, then click the finish button at the bottom to reveal the official marking scheme.
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

        {loading ? (
          <div className="loading">Preparing your practice paper...</div>
        ) : (
          <div className="questions-stack">
            {questions.map((q, idx) => (
              <div key={q._id} className="section-card mb-12">
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="point-indicator" style={{ background: 'var(--primary)' }}>
                    {idx + 1}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                    {q.title || `Structured Essay Question`}
                  </h2>
                </div>
                <QuestionDisplay 
                  q={q} 
                  hideIndividualButtons={true} 
                  forceShowAnswer={showAllAnswers} 
                />
              </div>
            ))}

            {!showAllAnswers && questions.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: '#f8fafc', borderRadius: '2rem', border: '1px solid var(--border)' }}>
                <button 
                  onClick={() => setShowAllAnswers(true)}
                  className="complete-btn active"
                  style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
                >
                  Finish and Show Answers
                </button>
              </div>
            )}

            {showAllAnswers && (
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="complete-btn"
                >
                  Back to Top
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
