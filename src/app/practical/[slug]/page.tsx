'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { practicalsList, slugify } from '@/data/practicals';
import { notFound } from 'next/navigation';

export default function PracticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const index = practicalsList.findIndex(p => slugify(p.title) === slug);
  const staticPractical = practicalsList[index];

  const [practicalData, setPracticalData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!staticPractical) return;
    
    Promise.all([
      fetch(`/api/admin/practicals/${slug}`).then(res => res.json()),
      fetch('/api/admin/questions').then(res => res.json())
    ])
      .then(([practicalRes, questionsData]) => {
        setPracticalData(practicalRes);
        if (Array.isArray(questionsData)) {
          const related = questionsData.filter(q => q.practicalId?.slug === slug);
          setQuestions(related);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug, staticPractical]);

  if (!staticPractical) {
    notFound();
  }

  const title = practicalData?.title || staticPractical.title;
  const theory = practicalData?.theory || 'The detailed theoretical background for this practical is currently being prepared.';
  const method = practicalData?.method || 'Step-by-step procedures and setup instructions will be detailed here.';
  const apparatus = practicalData?.apparatus?.length > 0 ? practicalData.apparatus : ['Pending apparatus list...'];
  const importantPoints = practicalData?.importantPoints?.length > 0 ? practicalData.importantPoints : ['Important marking point for examination pending.'];
  const diagrams = practicalData?.diagrams || [];

  return (
    <div className="page-wrapper">
      <div className="bg-glow"></div>
      
      <div className="container main-container">
        <Link href="/" className="back-link group">
          <span className="arrow">←</span> Back to Dashboard
        </Link>
        
        <header className="header">
          <div className="meta-info">
            <span className="category-badge">
              {staticPractical.category}
            </span>
            <span className="practical-number">PRACTICAL #{index + 1}</span>
          </div>
          <h1 className="title">
            {title}
          </h1>
        </header>

        <div className="content-grid">
          {/* Main Content */}
          <div className="main-column">
            {diagrams.length > 0 && (
              <section className="glass section-card mb-8">
                <h2 className="section-title">
                  <span className="title-marker" style={{background: '#22d3ee'}}></span>
                  Diagrams
                </h2>
                <div className="diagrams-grid">
                  {diagrams.map((img: string, i: number) => (
                    <img key={i} src={img} alt={`Diagram ${i+1}`} className="rounded-xl w-full object-cover border border-white/10" />
                  ))}
                </div>
              </section>
            )}

            <section className="glass section-card">
              <h2 className="section-title">
                <span className="title-marker primary"></span>
                Scientific Theory
              </h2>
              <div className="prose">
                {loading ? <p className="animate-pulse">Loading theory...</p> : 
                 theory.split('\n').map((line: string, i: number) => (
                   <p key={i} className="mb-4">{line}</p>
                 ))
                }
              </div>
            </section>

            <section className="glass section-card">
              <h2 className="section-title">
                <span className="title-marker secondary"></span>
                Experimental Method
              </h2>
              <div className="prose">
                {loading ? <p className="animate-pulse">Loading method...</p> : 
                 method.split('\n').map((line: string, i: number) => (
                   <p key={i} className="mb-4">{line}</p>
                 ))
                }
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sidebar-column">
            <div className="glass sidebar-card">
              <h3 className="sidebar-title">Required Apparatus</h3>
              <ul className="apparatus-list">
                {loading ? <li className="animate-pulse">Loading...</li> : 
                 apparatus.map((item: string, i: number) => (
                  <li key={i} className="list-item">
                    <span className="bullet"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass sidebar-card highlight-card">
              <h3 className="sidebar-title">Critical Observations</h3>
              <ul className="observations-list">
                {loading ? <li className="animate-pulse">Loading...</li> : 
                 importantPoints.map((point: string, i: number) => (
                  <li key={i} className="obs-item">
                    <span className="warning-icon">!</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Questions Section */}
        {questions.length > 0 && (
          <div className="questions-section glass" style={{ marginTop: '3rem', padding: '2rem', borderRadius: '1rem' }}>
            <h2 className="section-title">
              <span className="title-marker" style={{background: 'var(--primary)'}}></span>
              Past & Model Questions
            </h2>
            <div className="questions-list">
              {questions.map((q, idx) => (
                <div key={q._id} id={`question-${q._id}`} className="question-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                  <div className="q-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'white' }}>
                      {q.title || `Question ${q.questionNumber || idx + 1}`}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                      {q.source?.year} • {q.source?.exam} • {q.difficulty?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="q-text" style={{ color: 'var(--text-muted)', marginBottom: '1rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {q.mainQuestionText}
                  </div>

                  {q.figures && q.figures.length > 0 && (
                    <div className="q-figures" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                      {q.figures.map((fig: any, i: number) => (
                        <div key={i} style={{ minWidth: '250px' }}>
                          <img src={fig.imageUrl} alt={fig.label || `Figure ${i+1}`} style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                          {fig.label && <p style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-muted)' }}>{fig.label}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.subQuestions && q.subQuestions.length > 0 && (
                    <div className="q-subparts" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {q.subQuestions.map((sq: any, i: number) => (
                        <div key={i} className="sq-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '3px solid rgba(255,255,255,0.1)' }}>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'white', minWidth: '35px' }}>{sq.part}</span>
                            <div style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap', flex: 1, lineHeight: '1.5' }}>{sq.text}</div>
                          </div>
                          {sq.imageUrl && (
                            <img src={sq.imageUrl} alt="subpart image" style={{ maxWidth: '100%', marginTop: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {q.marks > 0 && (
                    <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 'bold' }}>
                      [{q.marks} Marks]
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          padding-top: 8rem;
          padding-bottom: 5rem;
          position: relative;
        }

        .bg-glow {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: linear-gradient(to bottom, rgba(99, 102, 241, 0.05), transparent);
          z-index: -10;
          pointer-events: none;
        }

        .main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 2rem;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: white;
        }

        .arrow {
          transition: transform 0.2s ease;
        }

        .back-link:hover .arrow {
          transform: translateX(-4px);
        }

        .header {
          margin-bottom: 4rem;
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .category-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--primary);
          text-transform: uppercase;
        }

        .practical-number {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          max-width: 56rem;
          line-height: 1.1;
          color: white;
        }

        .content-grid {
          display: grid;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .content-grid {
            grid-template-columns: repeat(12, 1fr);
          }
          .title {
            font-size: 3.75rem;
          }
        }

        .main-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .main-column {
            grid-column: span 8 / span 8;
          }
        }

        .section-card {
          padding: 2.5rem;
          border-radius: 2.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
        }

        .title-marker {
          width: 0.5rem;
          height: 2rem;
          border-radius: 9999px;
        }

        .title-marker.primary { background: var(--primary); }
        .title-marker.secondary { background: var(--secondary); }

        .prose {
          color: var(--text-muted);
          line-height: 1.75;
          font-size: 1rem;
        }

        .diagrams-grid {
          display: grid;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        @media (min-width: 768px) {
          .diagrams-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        .sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .sidebar-column {
            grid-column: span 4 / span 4;
          }
        }

        .sidebar-card {
          padding: 2rem;
          border-radius: 2rem;
          border-color: rgba(255, 255, 255, 0.05);
        }

        .highlight-card {
          border-color: rgba(99, 102, 241, 0.2);
          background: rgba(99, 102, 241, 0.05);
        }

        .sidebar-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
        }

        .apparatus-list, .observations-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .bullet {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .obs-item {
          display: flex;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .warning-icon {
          color: var(--primary);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
