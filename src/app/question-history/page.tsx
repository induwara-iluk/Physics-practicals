'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const PracticalLink = ({ practical, number }: { practical?: any, number: string }) => {
  if (!number) return <span className="empty-dash">-</span>;

  if (!practical) {
    return <span className="unlinked-number">#{number}</span>;
  }

  return (
    <Link href={`/practical/${practical.slug}`} className="history-link">
      <span className="h-num">#{number}</span>
      <span className="h-name">{practical.title.replace(/^\d+\.\s*/, '')}</span>
    </Link>
  );
};

export default function QuestionHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="main-container" style={{ maxWidth: '1000px', padding: '1rem' }}>
        <header className="hero-section mb-6" style={{ textAlign: 'center' }}>
          <h1 className="hero-title" style={{ fontSize: '2rem' }}>Exam History</h1>
          <p className="subtitle" style={{ fontSize: '1rem', textAlign: 'center' }}>

            Past Structured Essay Questions (G.C.E. A/L) from 2011 to 2025 with 2026 year question guessings
          </p>
        </header>

        <main className="section-card compact-history">
          {loading ? (
            <div className="loading">Loading records...</div>
          ) : (
            <div className="table-container">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Year</th>
                    <th>Q. 01</th>
                    <th>Q. 02</th>
                    <th>Q. 03</th>
                    <th>Q. 04</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row._id}>
                      <td className="year-td">{row.year}</td>
                      <td><PracticalLink practical={row.details?.q1} number={row.q1} /></td>
                      <td><PracticalLink practical={row.details?.q2} number={row.q2} /></td>
                      <td><PracticalLink practical={row.details?.q3} number={row.q3} /></td>
                      <td><PracticalLink practical={row.details?.q4} number={row.q4} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .compact-history {
          padding: 0 !important;
          overflow: hidden;
          border-radius: 1rem;
        }
        .table-container {
          width: 100%;
          overflow-x: auto;
        }
        .compact-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          table-layout: fixed;
        }
        .compact-table th {
          background: #f1f5f9;
          padding: 0.75rem 0.5rem;
          text-align: left;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.7rem;
          border-bottom: 2px solid var(--border);
        }
        .compact-table td {
          padding: 0.6rem 0.5rem;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .year-td {
          font-weight: 800;
          color: var(--primary);
          background: #f8fafc;
          text-align: center;
        }
        
        .history-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-decoration: none;
          color: var(--text);
          transition: all 0.2s;
        }
        .history-link:hover {
          color: var(--primary);
        }
        .h-num {
          font-weight: 800;
          color: var(--primary);
          background: rgba(79, 70, 229, 0.05);
          padding: 0.1rem 0.3rem;
          border-radius: 0.3rem;
          font-size: 0.75rem;
        }
        .h-name {
          font-weight: 600;
          font-size: 0.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .unlinked-number {
          font-weight: 700;
          color: var(--text-muted);
          opacity: 0.6;
        }
        .empty-dash {
          color: #cbd5e1;
        }
        
        tr:hover {
          background: #fcfcfc;
        }
        
        @media (max-width: 768px) {
          .h-name { display: none; }
          .compact-table th { font-size: 0.6rem; }
        }
      `}</style>
    </div>
  );
}
