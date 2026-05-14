'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import QuestionDisplay from '@/components/QuestionDisplay';
import { practicalsList, slugify } from '@/data/practicals';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PracticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const index = practicalsList.findIndex(p => slugify(p.title) === slug);
  const staticPractical = practicalsList[index];

  const [practicalData, setPracticalData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error404, setError404] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError404(false);
    
    Promise.all([
      fetch(`/api/admin/practicals/${slug}`).then(res => {
        if (res.status === 404) {
          setError404(true);
          return null;
        }
        return res.json();
      }),
      fetch('/api/admin/questions').then(res => res.json())
    ])
      .then(([practicalRes, questionsData]) => {
        if (practicalRes) {
          setPracticalData(practicalRes);
        }
        if (Array.isArray(questionsData)) {
          const related = questionsData.filter(q => q.practicalId?.slug === slug);
          setQuestions(related);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (error404) {
    notFound();
  }

  const title = practicalData?.title || staticPractical?.title || 'Loading...';
  const theory = practicalData?.theory || 'The detailed theoretical background for this practical is currently being prepared.';
  const method = practicalData?.method || 'Step-by-step procedures and setup instructions will be detailed here.';
  const apparatus = practicalData?.apparatus?.length > 0 ? practicalData.apparatus : ['Pending apparatus list...'];
  const importantPoints = practicalData?.importantPoints?.length > 0 ? practicalData.importantPoints : ['Important marking point for examination pending.'];
  const diagrams = practicalData?.diagrams || [];
  const category = practicalData?.category || staticPractical?.category || 'General Physics';
  const pNumber = index !== -1 ? `PRACTICAL #${index + 1}` : 'DYNAMIC PRACTICAL';

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
              {category}
            </span>
            <span className="practical-number">{pNumber}</span>
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
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {theory}
                 </ReactMarkdown>
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
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {method}
                 </ReactMarkdown>
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
                <QuestionDisplay key={q._id} q={q} idx={idx} />
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
          font-size: 1.05rem;
        }

        .prose :global(p) {
          margin-bottom: 1.25rem;
        }

        .prose :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .prose :global(ul), .prose :global(ol) {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }

        .prose :global(li) {
          margin-bottom: 0.5rem;
        }

        .prose :global(strong) {
          color: white;
          font-weight: 700;
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
