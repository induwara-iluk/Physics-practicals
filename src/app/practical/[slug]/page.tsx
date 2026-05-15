import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Practical from '@/models/Practical';
import Question from '@/models/Question';
import PracticalClient from '@/components/PracticalClient';

// Force dynamic to ensure fresh data
export const dynamic = 'force-dynamic';

async function getPractical(slug: string) {
  try {
    await dbConnect();
    const data = await Practical.findOne({ slug }).lean();
    if (!data) return null;
    // Serialize MongoDB document
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Failed to fetch practical:', error);
    return null;
  }
}

async function getRelatedQuestions(practicalId: string) {
  try {
    await dbConnect();
    const questions = await Question.find({ practicalId }).sort({ questionNumber: 1 }).lean();
    return JSON.parse(JSON.stringify(questions));
  } catch (error) {
    console.error('Failed to fetch related questions:', error);
    return [];
  }
}

export default async function PracticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practical = await getPractical(slug);

  if (!practical) {
    return (
      <div className="error-page">
        <div className="error-card glass">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <h1>Experiment Not Found</h1>
          <p>The practical you are looking for might have been moved or doesn't exist in our laboratory yet.</p>
          <Link href="/" className="error-back-btn">Back to Laboratory</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="noise-overlay" />
      <div className="bg-radial" />
      
      <div className="content-container">
        {/* Navigation */}
        <nav className="breadcrumb mb-12">
          <Link href="/" className="nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            Dashboard
          </Link>
          <span className="nav-sep">/</span>
          <span className="nav-current">{practical.category}</span>
        </nav>

        <PracticalClient 
          practical={practical} 
          relatedQuestions={await getRelatedQuestions(practical._id)} 
        />
      </div>
    </div>
  );
}
