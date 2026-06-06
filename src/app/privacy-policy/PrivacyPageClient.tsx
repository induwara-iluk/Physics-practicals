'use client';

export default function PrivacyPageClient() {
  return (
    <div className="privacy-page">
      <div className="privacy-hero">
        <div className="hero-content">
          <h1 className="hero-title">Privacy Policy</h1>
          <p className="hero-subtitle">
            Last updated: June 6, 2026. Your privacy and trust are important to us.
          </p>
        </div>
        <div className="hero-glow"></div>
      </div>

      <div className="privacy-content">
        <div className="info-intro-card glass">
          <p>
            At <strong>ilukpracticals.online</strong>, we are committed to protecting the privacy and security of our users, especially students preparing for their Advanced Level Physics examinations. This document outlines how we collect, use, and store information when you visit and interact with our platform.
          </p>
        </div>

        <section className="policy-section">
          <div className="section-card glass">
            <div className="section-header">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 className="section-title">1. Information We Collect</h2>
            </div>
            <div className="section-body">
              <p>We collect information to provide a better learning experience. This includes:</p>
              <ul>
                <li>
                  <strong>Account Information:</strong> If you sign in, we collect your email address and profile details handled securely via Supabase Authentication.
                </li>
                <li>
                  <strong>Usage Data:</strong> We may collect data on how you interact with our physics practicals, practice questions, and search tools.
                </li>
                <li>
                  <strong>Technical Data:</strong> Information such as your IP address, browser type, operating system, and device details may be collected by hosting and analytics platforms.
                </li>
              </ul>
            </div>
          </div>

          <div className="section-card glass">
            <div className="section-header">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 className="section-title">2. How We Use Your Information</h2>
            </div>
            <div className="section-body">
              <p>We use the collected information for the following purposes:</p>
              <ul>
                <li>To present interactive physics content and keep track of your practice questions history.</li>
                <li>To monitor and analyze platform traffic, performance, and user engagement through Google Analytics.</li>
                <li>To secure the platform against unauthorized access, spam, or malicious behavior.</li>
                <li>To communicate updates or respond to your inquiries.</li>
              </ul>
            </div>
          </div>

          <div className="section-card glass">
            <div className="section-header">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h2 className="section-title">3. Data Security and Third-Party Services</h2>
            </div>
            <div className="section-body">
              <p>
                We prioritize the security of your data. The platform utilizes industry-standard third-party providers:
              </p>
              <ul>
                <li>
                  <strong>Supabase:</strong> Used for database storage and secure user authentication. Your password is encrypted and never stored in plain text.
                </li>
                <li>
                  <strong>Google Analytics:</strong> Helps us understand how users navigate the site, optimizing the learning journey. No personally identifiable details are sold or shared with third parties.
                </li>
              </ul>
            </div>
          </div>

          <div className="section-card glass">
            <div className="section-header">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h2 className="section-title">4. Contact Information</h2>
            </div>
            <div className="section-body">
              <p>
                If you have questions about this Privacy Policy or how your personal information is handled, you can reach out directly:
              </p>
              <div className="contact-methods">
                <div className="contact-item">
                  <span className="label">Developer & Founder:</span>
                  <span className="value">Induwara Ilukkumbura</span>
                </div>
                <div className="contact-item">
                  <span className="label">Email:</span>
                  <a href="mailto:induwarailukkumbura@gmail.com" className="value link">induwarailukkumbura@gmail.com</a>
                </div>
                <div className="contact-item">
                  <span className="label">Phone:</span>
                  <a href="tel:+94702029019" className="value link">+94 70 202 9019</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .privacy-page {
          min-height: 100vh;
          padding-top: 100px;
          background: #f8fafc;
        }

        .privacy-hero {
          position: relative;
          padding: 5rem 1.5rem;
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
          font-size: 1.2rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .privacy-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 1.5rem 6rem;
        }

        .info-intro-card {
          padding: 2rem;
          border-radius: 1.5rem;
          margin-bottom: 2.5rem;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          font-size: 1.1rem;
          line-height: 1.7;
          color: #475569;
        }

        .policy-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-card {
          background: white;
          padding: 2.5rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .section-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .icon-box {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(79, 70, 229, 0.1);
          color: var(--primary);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1e293b;
        }

        .section-body {
          color: #475569;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .section-body p {
          margin-bottom: 1rem;
        }

        .section-body ul {
          padding-left: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-body li {
          position: relative;
          list-style: none;
          padding-left: 0.5rem;
        }

        .section-body li::before {
          content: "•";
          color: var(--primary);
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-left: -1em;
        }

        .contact-methods {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid rgba(0,0,0,0.03);
        }

        .contact-item {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 1rem;
        }

        .contact-item .label {
          font-weight: 700;
          color: #334155;
          min-width: 180px;
        }

        .contact-item .value {
          color: #475569;
        }

        .contact-item .value.link {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .contact-item .value.link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .privacy-hero {
            padding: 4rem 1.5rem;
          }
          .section-card {
            padding: 1.75rem;
          }
          .contact-item {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
