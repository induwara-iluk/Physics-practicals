'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { preprocessMarkdown } from '@/lib/markdownUtils';

interface Practical {
  _id: string;
  title: string;
  slug: string;
  category: string;
  theory: string;
  method: string;
  apparatus: string[];
  importantPoints: string[];
  diagrams: string[];
  difficulty?: string;
  estimatedTime?: string;
  practicalNumber?: number;
}

interface NavPractical {
  title: string;
  slug: string;
}

export default function PracticalClient({ 
  practical, 
  relatedQuestions = [],
  prevPractical = null,
  nextPractical = null
}: { 
  practical: Practical, 
  relatedQuestions?: any[],
  prevPractical?: NavPractical | null,
  nextPractical?: NavPractical | null
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  const pastPaperQuestions = relatedQuestions.filter(
    (q) => q.type !== 'model' && (!q.source?.type || q.source?.type === 'past_paper')
  );
  const modelQuestions = relatedQuestions.filter(
    (q) => q.type === 'model' || (q.source?.type && q.source?.type !== 'past_paper')
  );

  useEffect(() => {
    const saved = localStorage.getItem('completedPracticals');
    if (saved) {
      const slugs = JSON.parse(saved);
      setIsCompleted(slugs.includes(practical.slug));
    }
  }, [practical.slug]);

  const toggleCompletion = () => {
    const saved = localStorage.getItem('completedPracticals');
    let slugs = saved ? JSON.parse(saved) : [];
    
    if (isCompleted) {
      slugs = slugs.filter((s: string) => s !== practical.slug);
    } else {
      slugs.push(practical.slug);
    }
    
    localStorage.setItem('completedPracticals', JSON.stringify(slugs));
    setIsCompleted(!isCompleted);
  };

  const titleOnly = practical.title.replace(/^\d+\.\s*/, '');

  return (
    <div className="practical-container">
      {/* Hero Header */}
      <header className="hero-section mb-12">
        <div className="hero-top">
          <span className="p-number">#{practical.practicalNumber || 'N/A'}</span>
          <span className="p-category">{practical.category}</span>
          <button 
            onClick={toggleCompletion} 
            className={`complete-btn ${isCompleted ? 'active' : ''}`}
          >
            {isCompleted ? '✓ Completed' : 'Mark as Complete'}
          </button>
        </div>
        <h1 className="hero-title">{titleOnly}</h1>
        <div className="hero-meta">
          <div className="meta-box">
            <span className="meta-label">Difficulty</span>
            <span className={`meta-value ${practical.difficulty}`}>{practical.difficulty || 'Medium'}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">Est. Time</span>
            <span className="meta-value">{practical.estimatedTime || '45 mins'}</span>
          </div>
        </div>
      </header>

      {/* 2. Required Apparatus */}
      <section className="section-card mb-8">
        <h2 className="section-title">
          <span className="title-marker" style={{background: '#fbbf24'}}></span>
          Required Apparatus
        </h2>
        <div className="apparatus-text">
          <div className="prose-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkMath]} 
              rehypePlugins={[rehypeKatex]}
            >
              {preprocessMarkdown(practical.apparatus
                .flatMap((item: string) => item.split(',').map(s => s.trim()))
                .filter(Boolean)
                .join(', '))}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* 3. Scientific Theory */}
      <section className="section-card mb-8">
        <h2 className="section-title">
          <span className="title-marker" style={{background: '#6366f1'}}></span>
          Scientific Theory
        </h2>
        <div className="prose-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {preprocessMarkdown(practical.theory)}
          </ReactMarkdown>
        </div>
      </section>

      {/* 4. Experimental Method */}
      <section className="section-card mb-8">
        <h2 className="section-title">
          <span className="title-marker" style={{background: '#22c55e'}}></span>
          Experimental Method
        </h2>
        <div className="prose-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {preprocessMarkdown(practical.method)}
          </ReactMarkdown>
        </div>
      </section>

      {/* 5. Critical Observations & Important Points */}
      {practical.importantPoints && practical.importantPoints.length > 0 && (
        <section className="section-card mb-8 highlight-section">
          <h2 className="section-title">
            <span className="title-marker" style={{background: '#f43f5e'}}></span>
            Important Points
          </h2>
          <div className="important-grid">
            {practical.importantPoints.map((point, index) => (
              <div key={index} className="important-item">
                <div className="point-indicator">{index + 1}</div>
                <div className="prose-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {preprocessMarkdown(point)}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Past Paper Questions */}
      {pastPaperQuestions.length > 0 && (
        <section className="section-card mb-8">
          <h2 className="section-title">
            <span className="title-marker" style={{background: 'var(--primary)'}}></span>
            Past Paper Questions
          </h2>
          <div className="list-body">
            {pastPaperQuestions.map((q) => (
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
            ))}
          </div>
        </section>
      )}

      {/* 7. Model Questions */}
      {modelQuestions.length > 0 && (
        <section className="section-card mb-12">
          <h2 className="section-title">
            <span className="title-marker" style={{background: 'var(--secondary)'}}></span>
            Model Questions
          </h2>
          <div className="list-body">
            {modelQuestions.map((q) => (
              <Link 
                key={q._id} 
                href={`/question/${q._id}`} 
                className="practical-card"
                style={{ padding: '1.25rem' }}
              >
                <div className="p-number-box" style={{ 
                  width: '3.5rem', 
                  height: '3.5rem', 
                  background: 'rgba(124, 58, 237, 0.08)', 
                  borderRadius: '0.75rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--secondary)',
                  fontWeight: '800',
                  fontSize: '1.1rem'
                }}>
                  Q{q.questionNumber}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="p-title" style={{ margin: 0, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {q.title || `Model Structured Essay`}
                  </h3>
                  <span className="p-category">
                    Model Question • {q.difficulty}
                  </span>
                </div>
                <div className="card-action">
                  <svg className="item-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. Practical Navigation */}
      {(prevPractical || nextPractical) && (
        <nav className="practical-navigation" aria-label="Practical Navigation">
          {prevPractical ? (
            <Link href={`/practical/${prevPractical.slug}`} className="nav-button-card prev-card">
              <span className="nav-button-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Previous Practical
              </span>
              <span className="nav-button-title">{prevPractical.title.replace(/^\d+\.\s*/, '')}</span>
            </Link>
          ) : (
            <div className="nav-button-placeholder" />
          )}

          {nextPractical ? (
            <Link href={`/practical/${nextPractical.slug}`} className="nav-button-card next-card">
              <span className="nav-button-label">
                Next Practical
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
              <span className="nav-button-title">{nextPractical.title.replace(/^\d+\.\s*/, '')}</span>
            </Link>
          ) : (
            <div className="nav-button-placeholder" />
          )}
        </nav>
      )}
    </div>
  );
}
