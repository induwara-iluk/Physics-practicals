'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const FeedbackPopup = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // 1. Increment page views on every pathname change
    const views = parseInt(localStorage.getItem('iluk_feedback_page_views') || '0', 10);
    const newViews = views + 1;
    localStorage.setItem('iluk_feedback_page_views', newViews.toString());

    // 2. Check if user already submitted the feedback form
    const isSubmitted = localStorage.getItem('iluk_feedback_submitted') === 'true';
    if (isSubmitted) {
      return;
    }

    // 3. Migration: if they dismissed using the old static flag, convert to dismissed_at
    if (localStorage.getItem('iluk_feedback_dismissed') === 'true') {
      localStorage.removeItem('iluk_feedback_dismissed');
      localStorage.setItem('iluk_feedback_dismissed_at', newViews.toString());
    }

    // 4. If the popup is already showing, keep it rendered and visible across page changes
    if (isRendered) {
      return;
    }

    // 5. Check if enough page views have passed since the last dismissal
    const dismissedAtViews = parseInt(localStorage.getItem('iluk_feedback_dismissed_at') || '0', 10);
    
    // Show if never dismissed, or if at least 5 page views have occurred since dismissal
    const shouldShow = dismissedAtViews === 0 || (newViews - dismissedAtViews) >= 5;

    if (shouldShow) {
      // Delay the popup showing by 3.5 seconds for a premium, non-intrusive feel
      const timer = setTimeout(() => {
        setIsRendered(true);
        // Trigger animation in the next tick
        setTimeout(() => setIsVisible(true), 50);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [pathname, isRendered]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Track page views count at which they dismissed
    const currentViews = parseInt(localStorage.getItem('iluk_feedback_page_views') || '0', 10);
    localStorage.setItem('iluk_feedback_dismissed_at', currentViews.toString());
    // Remove from DOM after fade-out animation completes
    setTimeout(() => setIsRendered(false), 400);
  };

  const handleFeedbackClick = () => {
    // Open feedback form
    window.open('https://forms.gle/tu7Yu39GngQczAqo8', '_blank', 'noopener,noreferrer');
    // Set submitted flag so they are never prompted again
    localStorage.setItem('iluk_feedback_submitted', 'true');
    setIsVisible(false);
    setTimeout(() => setIsRendered(false), 400);
  };

  if (!isRendered) return null;

  return (
    <div className={`feedback-popup ${isVisible ? 'visible' : ''}`}>
      {/* Close button */}
      <button className="close-btn" onClick={handleDismiss} aria-label="Close feedback popup">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="feedback-content">
        <div className="feedback-header">
          {/* Feedback Icon / Sparkle */}
          <div className="icon-wrapper">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M12 7v6"></path>
              <path d="M12 11h.01"></path>
            </svg>
          </div>
          <span className="feedback-tag">Feedback</span>
        </div>

        <h3 className="feedback-title">Help us improve Iluk practicals</h3>
        <p className="feedback-description">
          Have suggestions or found an issue? Share your thoughts to help make this site better for everyone!
        </p>

        <button className="feedback-submit-btn" onClick={handleFeedbackClick}>
          <span>Give Feedback</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .feedback-popup {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 320px;
          z-index: 9999;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(79, 70, 229, 0.12);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.06),
            0 1px 3px rgba(0, 0, 0, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transition: 
            opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .feedback-popup.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(0, 0, 0, 0.05);
          color: var(--text);
          transform: scale(1.05);
        }

        .feedback-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .feedback-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(79, 70, 229, 0.1);
          color: var(--primary);
        }

        .feedback-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary);
        }

        .feedback-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 6px 0;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .feedback-description {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin: 0 0 16px 0;
          line-height: 1.45;
        }

        .feedback-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feedback-submit-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
        }

        .feedback-submit-btn:active {
          transform: translateY(1px);
        }

        @media (max-width: 640px) {
          .feedback-popup {
            bottom: 16px;
            right: 16px;
            left: 16px;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default FeedbackPopup;
