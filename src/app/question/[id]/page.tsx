'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import QuestionDisplay from '@/components/QuestionDisplay';
import { notFound } from 'next/navigation';

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [q, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/questions/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setQuestionData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (!loading && !q) {
    notFound();
  }

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', paddingTop: '8rem', paddingBottom: '5rem', position: 'relative' }}>
      <div className="bg-glow" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '300px', background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.05), transparent)', zIndex: -10, pointerEvents: 'none' }} />
      
      <div className="container main-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        <Link href="/" className="back-link group" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, marginBottom: '2rem', transition: 'color 0.2s ease' }}>
          <span className="arrow" style={{ transition: 'transform 0.2s ease' }}>←</span> Back to Dashboard
        </Link>
        
        {loading ? (
          <div className="animate-pulse" style={{ color: 'white' }}>Loading question...</div>
        ) : (
          <div className="questions-section glass" style={{ padding: '2rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            {q.practicalId && (
              <div style={{ marginBottom: '2rem' }}>
                <Link href={`/practical/${q.practicalId.slug}`} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
                  Linked Practical: {q.practicalId.title.replace(/^\d+\.\s*/, '')}
                </Link>
              </div>
            )}

              <QuestionDisplay q={q} />
          </div>
        )}
      </div>
    </div>
  );
}
