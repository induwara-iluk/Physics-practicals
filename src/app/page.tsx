import React, { Suspense } from 'react';
import dbConnect from '@/lib/mongodb';
import Practical from '@/models/Practical';
import DashboardClient from '@/components/DashboardClient';
import PracticalSkeleton from '@/components/PracticalSkeleton';

import Hero from '@/components/Hero';

import Question from '@/models/Question';

// Force dynamic to ensure we get fresh data from DB on every request
export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    await dbConnect();
    const practicalCount = await Practical.countDocuments();
    const pastPaperCount = await Question.countDocuments({
      type: { $ne: 'model' },
      "source.type": { $ne: 'model_paper' }
    });
    const modelQuestionCount = await Question.countDocuments({
      $or: [
        { type: "model" },
        { "source.type": "model_paper" }
      ]
    });
    
    return {
      practicalCount,
      pastPaperCount,
      modelQuestionCount
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return { practicalCount: 20, pastPaperCount: 50, modelQuestionCount: 30 }; // Fallbacks
  }
}

async function getPracticals() {
  try {
    await dbConnect();
    const practicals = await Practical.find({})
      .select('title slug category diagrams medium practicalNumber difficulty estimatedTime')
      .sort({ practicalNumber: 1 })
      .lean();
    
    return JSON.parse(JSON.stringify(practicals));
  } catch (error) {
    console.error('Failed to fetch practicals:', error);
    return null;
  }
}

export default async function LandingPage() {
  const practicals = await getPracticals();
  const stats = await getStats();

  return (
    <div className="page-wrapper">
      <div className="noise-overlay" />
      <div className="bg-radial" />

      <Hero 
        practicalCount={stats.practicalCount}
        pastPaperCount={stats.pastPaperCount}
        modelQuestionCount={stats.modelQuestionCount}
      />

      <div className="main-container">

        {!practicals ? (
          <div className="error-state glass">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h2>Unable to connect to Laboratory</h2>
            <p>We're having trouble reaching our database. Please check your internet connection or try again later.</p>
            <button onClick={() => typeof window !== 'undefined' && window.location.reload()} className="retry-btn">Retry Connection</button>
          </div>
        ) : (
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardClient initialPracticals={practicals} />
          </Suspense>
        )}
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="phi">Φ</span>
            PHYSICS<span className="logo-dim">LAB</span>
          </div>
          <p className="footer-copy">
            Designed for excellence. Built for the future of physics education.
          </p>
        </div>
      </footer>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-sidebar"></div>
      <div className="skeleton-main">
        {[1, 2, 3].map(i => <PracticalSkeleton key={i} />)}
      </div>
    </div>
  );
}