'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuestionDisplay from '@/components/QuestionDisplay';

export default function PracticePaperPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [selectedMedium, setSelectedMedium] = useState<'English' | 'Sinhala'>('English');

  // State for storing answers of all questions in the paper
  // Key is questionId, value is Record of subquestionId -> answer
  const [paperAnswers, setPaperAnswers] = useState<Record<string, Record<string, string>>>({});
  
  // State for storing AI evaluation results of all questions in the paper
  // Key is questionId, value is evaluation results
  const [paperEvaluations, setPaperEvaluations] = useState<Record<string, any>>({});
  
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

  useEffect(() => {
    setLoading(true);
    // Reset paper state when a new paper is loaded or medium changes
    setPaperAnswers({});
    setPaperEvaluations({});
    setAiError(null);
    setShowAllAnswers(false);

    fetch('/api/admin/questions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter by medium first
          const mediumFiltered = data.filter(q => (q.medium || 'English') === selectedMedium);
          
          // Group questions by their structured exam question number (Q1, Q2, Q3, Q4)
          const q1List = mediumFiltered.filter(q => q.questionNumber === '1');
          const q2List = mediumFiltered.filter(q => q.questionNumber === '2');
          const q3List = mediumFiltered.filter(q => q.questionNumber === '3');
          const q4List = mediumFiltered.filter(q => q.questionNumber === '4');

          const selectedQuestions: any[] = [];
          
          const getRandomItem = (arr: any[]) => {
            if (arr.length === 0) return null;
            const index = Math.floor(Math.random() * arr.length);
            return arr[index];
          };

          // Pick exactly one question for each position (Q1, Q2, Q3, Q4)
          const q1 = getRandomItem(q1List);
          const q2 = getRandomItem(q2List);
          const q3 = getRandomItem(q3List);
          const q4 = getRandomItem(q4List);

          if (q1) selectedQuestions.push(q1);
          if (q2) selectedQuestions.push(q2);
          if (q3) selectedQuestions.push(q3);
          if (q4) selectedQuestions.push(q4);

          // Fallback: If any position is missing, fill the remaining slots from the general bank
          if (selectedQuestions.length < 4) {
            const usedIds = new Set(selectedQuestions.map(q => q._id));
            const remaining = mediumFiltered.filter(q => !usedIds.has(q._id));
            
            while (selectedQuestions.length < 4 && remaining.length > 0) {
              const item = getRandomItem(remaining);
              if (item) {
                selectedQuestions.push(item);
                const idx = remaining.findIndex(q => q._id === item._id);
                if (idx !== -1) remaining.splice(idx, 1);
              }
            }
          }
          
          // Sort the selected questions by their questionNumber so they appear in correct sequence (Q1, Q2, Q3, Q4)
          selectedQuestions.sort((a, b) => {
            const numA = parseInt(a.questionNumber) || 999;
            const numB = parseInt(b.questionNumber) || 999;
            return numA - numB;
          });

          setQuestions(selectedQuestions);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load questions:", err);
        setLoading(false);
      });
  }, [selectedMedium]);

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

  const handleGradePaperWithAI = async () => {
    setIsLoadingAI(true);
    setAiError(null);
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
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'An error occurred while grading the paper.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const totalPaperMaxMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  
  const hasEvaluations = Object.keys(paperEvaluations).length > 0;
  
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

  return (
    <div className="page-wrapper">
      <div className="main-container" style={{ maxWidth: '900px' }}>
        <header className="hero-section mb-12">
          <h1 className="hero-title">Practice Paper #01</h1>
          <p className="subtitle" style={{ margin: '0 auto' }}>
            Complete all four questions in this set. Write your answers in the spaces provided, then click the finish button at the bottom to reveal the official marking scheme.
          </p>

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

        {loading ? (
          <div className="loading">Preparing your practice paper...</div>
        ) : (
          <div className="questions-stack">
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
                  <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem 1.5rem', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 600, width: '100%', maxWidth: '600px' }}>
                    ⚠️ {aiError}
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
    </div>
  );
}
