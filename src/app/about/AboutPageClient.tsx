'use client';

export default function AboutPageClient() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">Master G.C.E. A/L Physics Practicals with Confidence</h1>
          <p className="hero-subtitle">
            ilukpracticals.online is a dedicated learning platform for Sri Lankan G.C.E. Advanced Level Physics students.
          </p>
        </div>
        <div className="hero-glow"></div>
      </div>

      <div className="about-content">
        <section className="benefits-section">
          <h2 className="section-title">This platform helps you:</h2>
          <div className="benefits-grid">
            {[
              "Learn each practical step by step",
              "Understand the underlying theory and calculations",
              "Practice past paper practical questions",
              "Attempt model questions and viva questions",
              "Prepare confidently for the final practical examination"
            ].map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="benefit-text">{benefit}</p>
              </div>
            ))}
          </div>
          
          <div className="info-box">
            <p>
              Everything is organized in a simple and structured way so you can study efficiently and perform your best in the exam.
            </p>
            <p className="highlight-text">
              Built to help Sri Lankan students master Physics practicals and achieve excellent results.
            </p>
          </div>
        </section>

        <section className="creator-section">
          <div className="creator-header">
            <span className="creator-label">About the Creator</span>
            <h2 className="creator-name">Induwara Ilukkumbura</h2>
          </div>

          <div className="creator-layout">
            <div className="creator-text">
              <p>
                <strong>Induwara Ilukkumbura</strong> is the creator of <span className="site-link">ilukpracticals.online</span> and the founder of the <strong>Study Guide</strong> YouTube channel.
              </p>
              <p>
                He is a fourth-year undergraduate at the <strong>University of Moratuwa</strong> and has been teaching Physics for over four years.
              </p>
              <p>
                Through his teaching and online content, he has helped many students achieve A grades in Physics and gain admission to leading universities in Sri Lanka.
              </p>
              <div className="creator-mission">
                <p>
                  This platform was created to provide students with a clear, reliable, and practical way to prepare for the G.C.E. A/L Physics Practical Examination.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          padding-top: 100px;
          background: #f8fafc;
        }

        .about-hero {
          position: relative;
          padding: 6rem 1.5rem;
          text-align: center;
          overflow: hidden;
          background: white;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .hero-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 300px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.08), transparent 70%);
          filter: blur(60px);
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #1e293b;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .about-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .benefit-card {
          background: white;
          padding: 2rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          transition: all 0.3s ease;
        }

        .benefit-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-color: var(--primary);
        }

        .benefit-icon {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(79, 70, 229, 0.1);
          color: var(--primary);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .benefit-text {
          font-weight: 600;
          color: #334155;
          line-height: 1.5;
        }

        .info-box {
          background: #1e293b;
          color: white;
          padding: 3rem;
          border-radius: 2rem;
          text-align: center;
          margin-bottom: 6rem;
          box-shadow: 0 20px 40px rgba(30, 41, 59, 0.2);
        }

        .info-box p {
          font-size: 1.1rem;
          line-height: 1.7;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        .highlight-text {
          font-size: 1.4rem !important;
          font-weight: 700;
          opacity: 1 !important;
          color: #818cf8;
          margin-bottom: 0 !important;
        }

        .creator-section {
          background: white;
          padding: 4rem;
          border-radius: 2rem;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .creator-header {
          margin-bottom: 3rem;
        }

        .creator-label {
          display: inline-block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--primary);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .creator-name {
          font-size: 2.5rem;
          font-weight: 900;
          color: #1e293b;
        }

        .creator-text p {
          font-size: 1.15rem;
          line-height: 1.8;
          color: #475569;
          margin-bottom: 1.5rem;
        }

        .site-link {
          color: var(--primary);
          font-weight: 700;
        }

        .creator-mission {
          margin-top: 2.5rem;
          padding: 2rem;
          background: #f1f5f9;
          border-radius: 1.25rem;
          border-left: 5px solid var(--primary);
        }

        .creator-mission p {
          font-size: 1.1rem;
          margin-bottom: 0;
          font-style: italic;
          color: #334155;
        }

        @media (max-width: 768px) {
          .about-hero {
            padding: 4rem 1.5rem;
          }
          .info-box {
            padding: 2rem;
          }
          .creator-section {
            padding: 2rem;
          }
          .creator-name {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
