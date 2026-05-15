'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Practical {
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

export default function PracticalClient({ practical }: { practical: Practical }) {
  const [isCompleted, setIsCompleted] = useState(false);

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
      {/* 1. Diagrams / Setup */}
      {practical.diagrams && practical.diagrams.length > 0 && (
        <section className="diagram-grid mb-8">
          {practical.diagrams.map((url, index) => (
            <div key={index} className="diagram-card glass animate-fade">
              <img src={url} alt={`Experimental Setup ${index + 1}`} className="setup-img" />
              <div className="img-overlay">
                <span>Setup Diagram {index + 1}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Hero Header */}
      <header className="hero-section glass mb-8">
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
      <section className="glass section-card mb-8">
        <h2 className="section-title">
          <span className="title-marker" style={{background: '#fbbf24'}}></span>
          Required Apparatus
        </h2>
        <div className="apparatus-text">
          <p className="prose">
            {practical.apparatus
              .flatMap((item: string) => item.split(',').map(s => s.trim()))
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      </section>

      {/* 3. Scientific Theory */}
      <section className="glass section-card mb-8">
        <h2 className="section-title">
          <span className="title-marker" style={{background: '#6366f1'}}></span>
          Scientific Theory
        </h2>
        <div className="prose-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {practical.theory}
          </ReactMarkdown>
        </div>
      </section>

      {/* 4. Experimental Method */}
      <section className="glass section-card mb-8">
        <h2 className="section-title">
          <span className="title-marker" style={{background: '#22c55e'}}></span>
          Experimental Method
        </h2>
        <div className="prose-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {practical.method}
          </ReactMarkdown>
        </div>
      </section>

      {/* 5. Critical Observations & Important Points */}
      {practical.importantPoints && practical.importantPoints.length > 0 && (
        <section className="glass section-card mb-12 highlight-section">
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
                    {point}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
