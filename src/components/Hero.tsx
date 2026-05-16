'use client';

import React from 'react';

interface HeroProps {
  practicalCount: number;
  pastPaperCount: number;
  modelQuestionCount: number;
}

const Hero = ({ practicalCount, pastPaperCount, modelQuestionCount }: HeroProps) => {
  return (
    <section className="hero">
      {/* Background elements */}
      <div className="hero-bg">
        <div className="formula f1">v = u + at</div>
        <div className="formula f2">F = ma</div>
        <div className="formula f3">T = 2π√(l/g)</div>
        <div className="formula f4">E = mc²</div>
        <div className="formula f5">V = IR</div>
        <div className="wave-pattern"></div>
        <div className="lens-diagram"></div>
      </div>

      <div className="hero-content animate-fade-in">

        <h1 className="hero-title">
          <img src="https://flagcdn.com/lk.svg" width="90" alt="SL Flag" style={{ borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} /> Sri Lanka’s Complete <span className="highlight">A/L Physics</span> Practical Platform
        </h1>

        <p className="hero-subtitle">
          Learn practicals, solve past paper questions, and master your (G.C.E) Advanaced Level Physics Structured Essay Paper.
        </p>

        <div className="hero-actions">
          <button className="btn-primary-hero" onClick={() => {
            const el = document.getElementById('practicals-list');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            Start Learning
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <a
            href="https://www.youtube.com/@induwara_iluk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-hero"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            Watch YouTube Tutorials
          </a>
        </div>

        <div className="hero-trust">
          <div className="trust-item">
            <span className="check">✓</span>
            <span>42 Practical Experiments</span>
          </div>
          <div className="trust-item">
            <span className="check">✓</span>
            <span>{pastPaperCount}+ Past Paper Questions</span>
          </div>
          <div className="trust-item">
            <span className="check">✓</span>
            <span>{modelQuestionCount}+ Model Questions</span>
          </div>
        </div>

        <p className="hero-social-proof">
          Trusted by thousands of Sri Lankan A/L students.
        </p>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          padding: 8rem 1.5rem 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: hidden;
          background: transparent;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .formula {
          position: absolute;
          font-family: 'Times New Roman', serif;
          font-style: italic;
          font-weight: 500;
          color: #4f46e5;
          opacity: 0.12; /* Increased visibility */
          font-size: 2.5rem;
          user-select: none;
          animation: float 10s ease-in-out infinite;
        }

        .f1 { top: 15%; left: 10%; animation-delay: 0s; }
        .f2 { top: 25%; right: 15%; animation-delay: 2s; font-size: 3rem; }
        .f3 { bottom: 20%; left: 15%; animation-delay: 4s; }
        .f4 { bottom: 15%; right: 20%; animation-delay: 1s; font-size: 3.5rem; }
        .f5 { top: 50%; left: 5%; animation-delay: 3s; opacity: 0.08; }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }

        .wave-pattern {
          position: absolute;
          top: 40%;
          right: -5%;
          width: 400px;
          height: 200px;
          background-image: radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0);
          background-size: 40px 40px;
          opacity: 0.08; /* Increased visibility */
          mask-image: linear-gradient(to right, transparent, black, transparent);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1.25rem;
          background: white;
          border: 1px solid rgba(79, 70, 229, 0.1);
          border-left: 4px solid #800000; /* Maroon accent */
          border-radius: 12px 999px 999px 12px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #4f46e5;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          margin-bottom: 2rem;
          position: relative;
        }

        .hero-badge::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 12px;
          right: 40px;
          height: 1px;
          background: #FFD700; /* Gold accent */
          opacity: 0.5;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.4rem); /* ~20% smaller */
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.03em;
          color: #1e293b;
          margin-bottom: 1.5rem;
          max-width: 850px; /* Keep to 2 lines */
        }

        .highlight {
          color: #4f46e5;
          position: relative;
          display: inline-block;
        }

        .highlight::after {
          content: '';
          position: absolute;
          bottom: 10%;
          left: 0;
          width: 100%;
          height: 12px;
          background: #4f46e5;
          opacity: 0.08;
          z-index: -1;
          border-radius: 4px;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: #64748b;
          max-width: 600px;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 2.5rem; /* Reduced gap to trust indicators */
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-primary-hero {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.25rem;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border: none;
          border-radius: 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-primary-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #FFD700; /* Gold accent on button */
          opacity: 0.8;
        }

        .btn-primary-hero:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(79, 70, 229, 0.4);
        }

        .btn-secondary-hero {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.25rem;
          background: white;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-secondary-hero:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
          transform: translateY(-2px);
        }

        .hero-trust {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
        }

        .check {
          color: #10b981;
          font-weight: 900;
        }

        .hero-social-proof {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .hero { padding-top: 6rem; }
          .hero-actions { width: 100%; flex-direction: column; }
          .btn-primary-hero, .btn-secondary-hero { width: 100%; justify-content: center; }
          .hero-trust { gap: 0.75rem; flex-direction: column; align-items: center; }
          .trust-item { font-size: 0.8rem; padding: 0.4rem 0.75rem; width: fit-content; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
