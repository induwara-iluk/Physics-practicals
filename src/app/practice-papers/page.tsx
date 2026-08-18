'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuestionDisplay from '@/components/QuestionDisplay';
import { createClient } from '@/lib/supabase/client';

export default function PracticePaperPage() {
  const supabase = createClient();
  
  // User Authentication State
  const [user, setUser] = useState<any>(null);
  
  // Papers and Library State
  const [papers, setPapers] = useState<any[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  
  // Active Paper Questions State
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  // Filters & Toggles
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [selectedMedium, setSelectedMedium] = useState<'English' | 'Sinhala'>('English');
  const [paperTab, setPaperTab] = useState<'past' | 'model'>('past');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'untouched'>('all');

  // Answer & AI Evaluation states (managed at paper level)
  const [paperAnswers, setPaperAnswers] = useState<Record<string, Record<string, string>>>({});
  const [paperEvaluations, setPaperEvaluations] = useState<Record<string, any>>({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [submitSaved, setSubmitSaved] = useState<boolean>(false);

  // Monitor Supabase Auth state changes
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch papers list from API
  const fetchPapersList = async () => {
    setLoadingPapers(true);
    try {
      const res = await fetch('/api/papers');
      if (!res.ok) throw new Error('Failed to fetch papers list.');
      const data = await res.json();
      setPapers(data);
    } catch (err) {
      console.error('Failed to load papers:', err);
    } finally {
      setLoadingPapers(false);
    }
  };

  // Re-fetch papers list whenever the user login state changes
  useEffect(() => {
    fetchPapersList();
  }, [user]);

  // Synchronize language medium from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('physicsMedium');
    if (saved === 'English' || saved === 'Sinhala') {
      setSelectedMedium(saved);
    }
  }, []);

  const handleMediumChange = (m: 'English' | 'Sinhala') => {
    setSelectedMedium(m);
    localStorage.setItem('physicsMedium', m);
  };

  // Fetch questions when a paper is selected
  useEffect(() => {
    if (!selectedPaperId) {
      setQuestions([]);
      return;
    }
    
    const loadPaperQuestions = async () => {
      setLoadingQuestions(true);
      setPaperAnswers({});
      setPaperEvaluations({});
      setAiError(null);
      setSubmitSaved(false);
      setShowAllAnswers(false);
      
      try {
        const res = await fetch(`/api/papers/${selectedPaperId}`);
        if (!res.ok) throw new Error('Failed to load questions for this paper.');
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        console.error(err);
        setAiError(err.message || 'Failed to load paper questions.');
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadPaperQuestions();
  }, [selectedPaperId]);

  const handleAnswerChange = (qId: string, sqKey: string, val: string) => {
    setPaperAnswers(prev => {
      const qAnswers = prev[qId] || {};
      return {
        ...prev,
        [qId]: {
          ...qAnswers,
          [sqKey]: val
        }
      };
    });
  };

  const handleTopAnswerChange = (qId: string, val: string) => {
    setPaperAnswers(prev => {
      const qAnswers = prev[qId] || {};
      return {
        ...prev,
        [qId]: {
          ...qAnswers,
          top: val
        }
      };
    });
  };

  // Calculate paper-level maximum marks
  const totalPaperMaxMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  
  const hasEvaluations = Object.keys(paperEvaluations).length > 0;
  
  // Calculate total paper-level score obtained
  const totalPaperObtainedMarks = hasEvaluations
    ? questions.reduce((sum, q) => {
        const evalData = paperEvaluations[q._id];
        if (!evalData) return sum;
        if (evalData.type === 'sub') {
          let subTotal = 0;
          Object.values(evalData.evals).forEach((evalItem: any) => {
            subTotal += evalItem.score || 0;
          });
          return sum + subTotal;
        } else {
          return sum + (evalData.eval?.score || 0);
        }
      }, 0)
    : 0;

  const handleGradePaperWithAI = async () => {
    setIsLoadingAI(true);
    setAiError(null);
    setSubmitSaved(false);
    
    try {
      const gradingPromises = questions.map(async (q) => {
        const qKey = q._id;
        const answers = paperAnswers[qKey] || {};
        const topAnswer = answers.top || '';
        
        const reqBody: any = {
          mainQuestionText: q.mainQuestionText,
        };

        if (q.subQuestions && q.subQuestions.length > 0) {
          reqBody.subQuestions = q.subQuestions.map((sq: any) => {
            const sqKey = sq.id || sq.part;
            return {
              id: sq.id || sq.part,
              part: sq.part,
              text: sq.text,
              answer: sq.answer,
              marks: sq.marks,
              studentAnswer: answers[sqKey] || '',
            };
          });
        } else {
          reqBody.answer = q.answer;
          reqBody.marks = q.marks;
          reqBody.studentAnswer = topAnswer;
        }

        const res = await fetch('/api/ai/check-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Failed to grade Question ${q.questionNumber || ''}`);
        }

        const data = await res.json();
        return { qId: q._id, data, isSub: q.subQuestions && q.subQuestions.length > 0 };
      });

      const results = await Promise.all(gradingPromises);
      
      const newEvaluations: Record<string, any> = {};
      results.forEach(({ qId, data, isSub }) => {
        if (isSub) {
          const newEvals: Record<string, any> = {};
          if (data.evaluations && Array.isArray(data.evaluations)) {
            data.evaluations.forEach((item: any) => {
              newEvals[item.subQuestionId] = {
                score: item.score,
                status: item.status,
                feedback: item.feedback,
              };
            });
          }
          newEvaluations[qId] = { type: 'sub', evals: newEvals };
        } else {
          newEvaluations[qId] = { type: 'single', eval: data };
        }
      });

      setPaperEvaluations(newEvaluations);
      setShowAllAnswers(true); // Automatically show official answers when AI grades

      // Calculate obtained total score for submission
      let obtained = 0;
      questions.forEach((q) => {
        const evalData = newEvaluations[q._id];
        if (!evalData) return;
        if (evalData.type === 'sub') {
          Object.values(evalData.evals).forEach((evalItem: any) => {
            obtained += evalItem.score || 0;
          });
        } else {
          obtained += evalData.eval?.score || 0;
        }
      });

      // Persist the attempt in MongoDB if user is signed in
      if (user && selectedPaperId) {
        try {
          const submitRes = await fetch('/api/papers/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paperId: selectedPaperId,
              score: obtained,
              maxScore: totalPaperMaxMarks,
              answers: paperAnswers
            })
          });
          
          if (submitRes.ok) {
            setSubmitSaved(true);
            // Refresh papers list in background to update status/best score
            fetchPapersList();
          }
        } catch (submitErr) {
          console.error('Failed to submit paper score:', submitErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'An error occurred while grading the paper.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Filter papers for the Library View
  const filteredPapers = papers.filter(paper => {
    const matchesTab = paper.type === paperTab;
    const matchesMedium = paper.medium === selectedMedium;
    
    let matchesStatus = true;
    if (user) {
      if (statusFilter === 'completed') {
        matchesStatus = paper.status === 'Completed';
      } else if (statusFilter === 'untouched') {
        matchesStatus = paper.status === 'Untouched';
      }
    }
    
    return matchesTab && matchesMedium && matchesStatus;
  });

  return (
    <div className="page-wrapper">
      <div className="noise-overlay" />
      <div className="bg-radial" />
      
      <div className="main-container" style={{ maxWidth: '1000px' }}>
        
        {/* VIEW 1: PAPERS LIBRARY DASHBOARD */}
        {!selectedPaperId ? (
          <div className="library-wrapper animate-up">
            <header className="hero-section mb-8" style={{ textAlign: 'center' }}>
              <span className="badge">
                <span className="badge-dot"></span>
                Structured Papers
              </span>
              <h1 className="hero-title" style={{ marginBottom: '1rem' }}>Practice Papers Library</h1>
              <p className="subtitle" style={{ margin: '0 auto' }}>
                Practice full structured essay papers. Write your answers and get instant, detailed, itemized AI grading and feedback.
              </p>

              {/* Language Medium Selection */}
              <div className="medium-selector-bar" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                <div className="medium-toggle">
                  <button 
                    onClick={() => handleMediumChange('English')}
                    className={`medium-btn ${selectedMedium === 'English' ? 'active' : ''}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => handleMediumChange('Sinhala')}
                    className={`medium-btn ${selectedMedium === 'Sinhala' ? 'active' : ''}`}
                  >
                    සිංහල
                  </button>
                </div>
              </div>
            </header>

            {/* Anonymous User Tip */}
            {!user && (
              <div className="login-tip-box glass mb-8">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', flexShrink: 0 }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 5 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="5" y2="12"></line>
                </svg>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <strong style={{ color: 'var(--text)' }}>Practice Tip:</strong> <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'underline' }}>Sign in</Link> to automatically save your AI grades, track your scores over time, and mark papers as Completed or Untouched.
                </div>
              </div>
            )}

            {/* Dashboard Tabs & Filters */}
            <div className="library-filters-row mb-8">
              <div className="paper-type-toggle">
                <button 
                  onClick={() => setPaperTab('past')}
                  className={`tab-btn ${paperTab === 'past' ? 'active' : ''}`}
                >
                  Past Papers
                </button>
                <button 
                  onClick={() => setPaperTab('model')}
                  className={`tab-btn ${paperTab === 'model' ? 'active' : ''}`}
                >
                  Model Papers
                </button>
              </div>

              {user && (
                <div className="status-filter-toggle">
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className={`status-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setStatusFilter('completed')}
                    className={`status-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => setStatusFilter('untouched')}
                    className={`status-btn ${statusFilter === 'untouched' ? 'active' : ''}`}
                  >
                    Untouched
                  </button>
                </div>
              )}
            </div>

            {/* Papers List Display */}
            {loadingPapers ? (
              <div className="loading" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                Loading papers library...
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="empty-state glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '1.5rem', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                No papers found matching the selected criteria.
              </div>
            ) : (
              <div className="papers-grid">
                {filteredPapers.map((paper) => (
                  <div 
                    key={paper.paperId} 
                    className={`paper-card glass ${paper.status === 'Completed' ? 'completed' : 'untouched'}`}
                    onClick={() => setSelectedPaperId(paper.paperId)}
                  >
                    {/* Top Row: Badges */}
                    <div className="paper-card-header">
                      <span className="paper-year-tag">{paper.year}</span>
                      {user ? (
                        <span className={`paper-status-badge ${paper.status.toLowerCase()}`}>
                          {paper.status}
                        </span>
                      ) : (
                        <span className="paper-status-badge untouched">Available</span>
                      )}
                    </div>

                    {/* Middle: Title & Metadata */}
                    <div className="paper-card-body">
                      <h3 className="paper-card-title">{paper.name}</h3>
                      <div className="paper-card-meta">
                        <span>{paper.questionCount} Questions</span>
                        <span className="dot-sep">•</span>
                        <span>{paper.totalMarks} Marks</span>
                        <span className="dot-sep">•</span>
                        <span>{paper.medium}</span>
                      </div>
                    </div>

                    {/* Bottom: Action & Scores */}
                    <div className="paper-card-footer">
                      {paper.status === 'Completed' && paper.bestScore !== null ? (
                        <div className="best-score-wrapper">
                          <span className="score-label">Best AI Score:</span>
                          <span className="score-value">{paper.bestScore} / {paper.totalMarks}</span>
                        </div>
                      ) : (
                        <span className="action-hint">Practice Paper</span>
                      )}
                      
                      <div className="paper-action-btn">
                        {paper.status === 'Completed' ? 'Retry' : 'Start'}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '0.25rem' }}>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          
          // VIEW 2: ACTIVE SELECTED PAPER VIEW
          <div className="active-paper-wrapper">
            {/* Back Button / Navigation */}
            <div className="active-paper-nav mb-8">
              <button 
                onClick={() => setSelectedPaperId(null)}
                className="back-library-btn"
              >
                ← Back to Papers Library
              </button>
              
              <div className="active-paper-info">
                <span className="active-paper-badge">
                  {papers.find(p => p.paperId === selectedPaperId)?.name || 'Practice Paper'}
                </span>
                <span className="active-paper-lang">
                  {selectedMedium} Medium
                </span>
              </div>
            </div>

            {loadingQuestions ? (
              <div className="loading" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                Loading paper questions...
              </div>
            ) : (
              <div className="questions-stack animate-fade">
                {questions.map((q, idx) => {
                  const qKey = q._id;
                  const qEvaluations = paperEvaluations[qKey];
                  
                  return (
                    <div key={q._id} className="section-card mb-12">
                      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div className="point-indicator" style={{ background: 'var(--primary)' }}>
                          {idx + 1}
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                          {q.title || `Structured Essay Question`}
                        </h2>
                      </div>
                      <QuestionDisplay 
                        q={q} 
                        hideIndividualButtons={true} 
                        forceShowAnswer={showAllAnswers} 
                        userAnswers={paperAnswers[qKey] || {}}
                        onChangeUserAnswer={(sqKey, val) => handleAnswerChange(qKey, sqKey, val)}
                        topUserAnswer={paperAnswers[qKey]?.top || ''}
                        onChangeTopUserAnswer={(val) => handleTopAnswerChange(qKey, val)}
                        evaluationResults={qEvaluations?.type === 'sub' ? qEvaluations.evals : undefined}
                        singleEvaluation={qEvaluations?.type === 'single' ? qEvaluations.eval : undefined}
                        hideAICheckButton={true}
                      />
                    </div>
                  );
                })}

                {questions.length > 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '4rem', 
                    padding: '3rem', 
                    background: '#f8fafc', 
                    borderRadius: '2rem', 
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}>
                    {aiError && (
                      <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem 1.5rem', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 600, width: '100%', maxWidth: '600px', textAlign: 'left' }}>
                        ⚠️ {aiError}
                      </div>
                    )}

                    {submitSaved && (
                      <div style={{ color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem 1.5rem', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 700, width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#16a34a' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Your AI grading score has been successfully saved to your history!
                      </div>
                    )}
                    
                    {hasEvaluations && (
                      <div style={{ 
                        marginBottom: '1rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '1.25rem',
                        width: '100%',
                        maxWidth: '600px'
                      }}>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '800', 
                          color: 'var(--text)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          Paper Total Score:
                          <span style={{ 
                            background: 'linear-gradient(135deg, #4f46e5, #818cf8)', 
                            color: 'white', 
                            padding: '0.4rem 1.2rem', 
                            borderRadius: '9999px',
                            fontSize: '1.35rem',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                            fontWeight: '800'
                          }}>
                            {totalPaperObtainedMarks} / {totalPaperMaxMarks} Marks
                          </span>
                        </div>

                        <div className="ai-disclaimer-box" style={{
                          padding: '1rem 1.25rem',
                          borderRadius: '1rem',
                          background: 'rgba(245, 158, 11, 0.05)',
                          border: '1px solid rgba(245, 158, 11, 0.15)',
                          color: '#b45309',
                          fontSize: '0.9rem',
                          display: 'flex',
                          gap: '0.75rem',
                          alignItems: 'flex-start',
                          textAlign: 'left',
                          lineHeight: '1.4'
                        }}>
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#d97706', flexShrink: 0, marginTop: '0.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div>
                            <strong style={{ fontWeight: '700' }}>AI Marking Disclaimer:</strong> This evaluation is performed by AI using the official marking scheme as a guide. AI grading is automated and can make mistakes.
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button
                        className="ai-check-btn"
                        onClick={handleGradePaperWithAI}
                        disabled={isLoadingAI}
                        style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}
                      >
                        {isLoadingAI ? (
                          <>
                            <span className="spinner"></span>
                            Grading whole paper...
                          </>
                        ) : (
                          <>
                            <svg style={{ width: '1.3rem', height: '1.3rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {hasEvaluations ? 'Regrade Paper with AI' : 'Grade Paper with AI'}
                          </>
                        )}
                      </button>

                      {!showAllAnswers && (
                        <button 
                          onClick={() => setShowAllAnswers(true)}
                          className="complete-btn"
                          style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}
                        >
                          Finish and Show Answers
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {showAllAnswers && (
                  <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="complete-btn"
                    >
                      Back to Top
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        /* ================================
           LIBRARY VIEWS & DASHBOARD
        ================================== */
        .login-tip-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(79, 70, 229, 0.04);
          border: 1px solid rgba(79, 70, 229, 0.15);
          border-radius: 1.25rem;
        }

        .library-filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1.5rem;
        }

        /* Tabs styling */
        .paper-type-toggle {
          display: flex;
          background: rgba(148, 163, 184, 0.08);
          padding: 0.3rem;
          border-radius: 0.85rem;
          border: 1px solid var(--border);
          gap: 0.25rem;
        }

        .tab-btn {
          border: none;
          background: transparent;
          padding: 0.5rem 1.5rem;
          border-radius: 0.6rem;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: var(--text);
        }

        .tab-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.01);
        }

        /* Status Filters styling */
        .status-filter-toggle {
          display: flex;
          background: #f1f5f9;
          padding: 0.25rem;
          border-radius: 0.75rem;
          gap: 0.2rem;
        }

        .status-btn {
          border: none;
          background: transparent;
          padding: 0.4rem 1.1rem;
          border-radius: 0.5rem;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-btn:hover {
          color: var(--text);
        }

        .status-btn.active {
          background: white;
          color: var(--text);
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        /* ================================
           PAPERS GRID & CARDS
        ================================== */
        .papers-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .paper-card {
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid var(--border);
          border-radius: 1.75rem;
          padding: 1.75rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.01), 0 1px 3px rgba(0,0,0,0.02);
          position: relative;
          min-height: 220px;
          justify-content: space-between;
        }

        .paper-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 35px rgba(79, 70, 229, 0.06), 0 8px 16px rgba(0,0,0,0.02);
          border-color: rgba(79, 70, 229, 0.3);
        }

        .paper-card.completed {
          border-left: 5px solid #10b981;
        }

        .paper-card.untouched {
          border-left: 1px solid var(--border);
        }

        .paper-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .paper-year-tag {
          font-weight: 800;
          background: rgba(79, 70, 229, 0.06);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          border: 1px solid rgba(79, 70, 229, 0.08);
        }

        .paper-status-badge {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
        }

        .paper-status-badge.completed {
          background: #dcfce7;
          color: #166534;
        }

        .paper-status-badge.untouched {
          background: #f1f5f9;
          color: #64748b;
        }

        .paper-card-body {
          flex: 1;
          margin-bottom: 1.5rem;
        }

        .paper-card-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .paper-card-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .dot-sep {
          opacity: 0.4;
        }

        .paper-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 1.25rem;
          margin-top: auto;
        }

        .best-score-wrapper {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .score-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .score-value {
          font-size: 1rem;
          font-weight: 800;
          color: #10b981;
        }

        .action-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .paper-action-btn {
          display: inline-flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary);
          transition: transform 0.2s;
        }

        .paper-card:hover .paper-action-btn {
          transform: translateX(3px);
        }

        /* ================================
           ACTIVE SELECTED PAPER VIEW
        ================================== */
        .active-paper-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1.5rem;
        }

        .back-library-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-weight: 700;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0.5rem 0;
          transition: color 0.2s;
        }

        .back-library-btn:hover {
          color: var(--primary);
        }

        .active-paper-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .active-paper-badge {
          font-size: 0.75rem;
          font-weight: 800;
          background: var(--primary);
          color: white;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
        }

        .active-paper-lang {
          font-size: 0.75rem;
          font-weight: 800;
          background: #f1f5f9;
          color: #475569;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          border: 1px solid var(--border);
        }

        @media (max-width: 768px) {
          .papers-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .library-filters-row {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .paper-type-toggle,
          .status-filter-toggle {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
