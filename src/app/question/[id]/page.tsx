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
    <div className="page-wrapper">
      <div className="main-container" style={{ maxWidth: '900px' }}>
        <Link href="/" className="nav-link mb-8" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          ← Back to Dashboard
        </Link>
        
        {loading ? (
          <div className="loading">Loading question...</div>
        ) : (
          <div className="section-card">
            {q.practicalId && (
              <div style={{ marginBottom: '2.5rem' }}>
                <Link href={`/practical/${q.practicalId.slug}`} className="complete-btn active" style={{ textDecoration: 'none', display: 'inline-block' }}>
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
