'use client';

import React, { useState } from 'react';

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedText, setCopiedText] = useState<'email' | 'phone' | null>(null);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">Get In Touch</h1>
          <p className="hero-subtitle">
            Have questions about physics practicals, practice papers, or suggestions? Reach out directly or send a message.
          </p>
        </div>
        <div className="hero-glow" />
      </div>

      <div className="contact-container">
        {/* Contact Info Cards */}
        <div className="info-sidebar">
          <div className="info-card glass animate-fade">
            <span className="card-label">Direct Connection</span>
            <h2 className="card-title">Contact Information</h2>
            <p className="card-desc">Feel free to call, email, or explore educational content on our social media platforms.</p>

            <div className="contact-details-list">
              {/* Email */}
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="detail-content">
                  <span className="detail-title">Email Address</span>
                  <a href="mailto:induwarailukkumbura@gmail.com" className="detail-link">
                    induwarailukkumbura@gmail.com
                  </a>
                </div>
                <button 
                  onClick={() => handleCopy('induwarailukkumbura@gmail.com', 'email')}
                  className={`copy-btn ${copiedText === 'email' ? 'copied' : ''}`}
                  title="Copy email to clipboard"
                >
                  {copiedText === 'email' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Phone */}
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="detail-content">
                  <span className="detail-title">Phone Number</span>
                  <a href="tel:+94702029019" className="detail-link">
                    +94 70 202 9019
                  </a>
                </div>
                <button 
                  onClick={() => handleCopy('+94702029019', 'phone')}
                  className={`copy-btn ${copiedText === 'phone' ? 'copied' : ''}`}
                  title="Copy phone number to clipboard"
                >
                  {copiedText === 'phone' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* YouTube */}
              <div className="detail-item">
                <div className="detail-icon yt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.163c-.272-1.022-1.078-1.828-2.1-2.1C19.518 3.54 12 3.54 12 3.54s-7.517 0-9.398.523c-1.022.272-1.828 1.078-2.1 2.1C0 8.044 0 12 0 12s0 3.956.502 5.837c.272 1.022 1.078 1.828 2.1 2.1C4.483 20.46 12 20.46 12 20.46s7.518 0 9.398-.523c1.022-.272 1.078-1.078 1.1-2.1.502-1.88.502-5.837.502-5.837s0-3.956-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <span className="detail-title">YouTube Channel</span>
                  <a href="https://www.youtube.com/@induwara_iluk" target="_blank" rel="noopener noreferrer" className="detail-link font-medium">
                    Study Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="form-main">
          <div className="form-card glass animate-fade">
            {submitStatus === 'success' ? (
              <div className="success-state">
                <div className="success-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2>Message Sent!</h2>
                <p>
                  Thank you for reaching out. We have received your message and will get back to you as soon as possible.
                </p>
                <button onClick={() => setSubmitStatus('idle')} className="btn btn-primary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h2 className="form-header-title">Send a Message</h2>
                <p className="form-header-desc"> Fill out the form below and we will respond to your email. </p>

                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="e.g. Ruwan Perera"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="e.g. ruwan@example.com"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                    placeholder="What is your message regarding?"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="message">Message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    rows={5}
                    value={formData.message} 
                    onChange={handleChange}
                    placeholder="Write your message here..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message} 
                  className={`btn btn-primary submit-btn ${isSubmitting ? 'loading' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          padding-top: 100px;
          background: #f8fafc;
        }

        .contact-hero {
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

        .contact-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 1.5rem 6rem;
          display: grid;
          grid-template-columns: 1.2fr 1.8fr;
          gap: 3rem;
          align-items: start;
        }

        .info-card {
          background: white;
          padding: 2.5rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .card-label {
          display: inline-block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--primary);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .card-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }

        .card-desc {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          position: relative;
        }

        .detail-icon {
          width: 2.75rem;
          height: 2.75rem;
          background: rgba(79, 70, 229, 0.1);
          color: var(--primary);
          border-radius: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .detail-icon.yt {
          background: rgba(255, 0, 0, 0.1);
          color: #ff0000;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .detail-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }

        .detail-link {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          text-decoration: none;
          word-break: break-all;
          transition: color 0.2s;
        }

        .detail-link:hover {
          color: var(--primary);
        }

        .copy-btn {
          padding: 0.4rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 0.5rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .copy-btn.copied {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        /* Form styling */
        .form-card {
          background: white;
          padding: 3rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .form-header-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .form-header-desc {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }

        .input-group input,
        .input-group textarea {
          padding: 0.85rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-family: inherit;
          font-size: 0.95rem;
          color: #1e293b;
          transition: all 0.2s;
        }

        .input-group input:focus,
        .input-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .submit-btn {
          margin-top: 0.5rem;
          height: 3.25rem;
          justify-content: center;
          font-size: 1rem;
          border-radius: 0.75rem;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Success State */
        .success-state {
          text-align: center;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .success-icon {
          width: 5rem;
          height: 5rem;
          background: #ecfdf5;
          color: #059669;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(5, 150, 105, 0.15);
        }

        .success-state h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: -0.5rem;
        }

        .success-state p {
          color: #64748b;
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 440px;
          margin: 0 auto 1rem;
        }

        @media (max-width: 968px) {
          .contact-container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 640px) {
          .contact-hero {
            padding: 4rem 1.5rem;
          }
          .form-card {
            padding: 2rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
