'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuestionDisplay from '@/components/QuestionDisplay';

export default function PracticePaperPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  useEffect(() => {
    fetch('/api/admin/questions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter questions with numbers 1, 2, 3, 4
          // Or if not enough, just take the first 4
          const targetNumbers = ['1', '2', '3', '4'];
          let filtered = data.filter(q => targetNumbers.includes(q.questionNumber));
          
          // If we don't have exactly these numbers, let's just take the first 4 from the bank
          if (filtered.length < 4) {
            const others = data.filter(q => !targetNumbers.includes(q.questionNumber));
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
  }, []);

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', paddingTop: '8rem', paddingBottom: '5rem', position: 'relative' }}>
      <div className="bg-glow" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '300px', background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.05), transparent)', zIndex: -10, pointerEvents: 'none' }} />
      
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Practice Paper #01
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Complete all four questions in this set. Write your answers in the spaces provided, then click the finish button at the bottom to reveal the official marking scheme.
          </p>
        </header>

        {loading ? (
          <div style={{ color: 'white', textAlign: 'center' }} className="animate-pulse">Preparing your practice paper...</div>
        ) : (
          <div className="questions-stack">
            {questions.map((q, idx) => (
              <div key={q._id} style={{ marginBottom: '4rem' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>
                    {idx + 1}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', color: 'white', margin: 0 }}>
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
              <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                  onClick={() => setShowAllAnswers(true)}
                  className="btn btn-primary"
                  style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '1rem' }}
                >
                  Finish and Show Answers
                </button>
              </div>
            )}

            {showAllAnswers && (
              <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="btn btn-outline"
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
