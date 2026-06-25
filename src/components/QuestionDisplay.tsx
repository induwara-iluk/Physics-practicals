'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { preprocessMarkdown, fixImageUrls } from '@/lib/markdownUtils';

const SubQuestionText = React.memo(({ text }: { text: string }) => {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm, remarkMath]} 
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        img: ({node, ...props}) => (
          <img 
            {...props} 
            style={{maxWidth: '100%', borderRadius: '1rem', marginTop: '1rem'}}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image+Not+Found';
            }}
          />
        )
      }}
    >
      {preprocessMarkdown(text)}
    </ReactMarkdown>
  );
});
SubQuestionText.displayName = 'SubQuestionText';

const MemoizedMarkdown = React.memo(({ content }: { content: string }) => {
  if (!content) return null;
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm, remarkMath]} 
      rehypePlugins={[rehypeKatex, rehypeRaw]}
    >
      {preprocessMarkdown(content)}
    </ReactMarkdown>
  );
});
MemoizedMarkdown.displayName = 'MemoizedMarkdown';

interface SubQuestionProps {
  sq: {
    id?: string;
    part: string;
    text: string;
    imageUrl?: string;
    marks?: number;
    answer?: string;
  };
  hideIndividualButtons?: boolean;
  forceShowAnswer?: boolean;
  userAnswer: string;
  onChangeUserAnswer: (val: string) => void;
  evaluation?: {
    score: number;
    status: 'correct' | 'partially_correct' | 'incorrect';
    feedback: string;
  };
}

const SubQuestionItem = ({
  sq,
  hideIndividualButtons,
  forceShowAnswer,
  userAnswer,
  onChangeUserAnswer,
  evaluation
}: SubQuestionProps) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const isVisible = forceShowAnswer || showAnswer;

  return (
    <div className={`sq-card ${evaluation ? evaluation.status : ''}`}>
      {sq.imageUrl && (
        <img 
          src={fixImageUrls(sq.imageUrl)} 
          alt="subpart image" 
          style={{ maxWidth: '100%', marginBottom: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
          }}
        />
      )}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <span className="q-part-label">{sq.part}</span>
        <div className="prose-content" style={{ flex: 1 }}>
          <SubQuestionText text={sq.text} />
        </div>
      </div>
      
      {/* User Input Area */}
      <div style={{ marginTop: '1.5rem' }}>
        <textarea 
          placeholder="Type your answer here..."
          className="answer-textarea"
          value={userAnswer}
          onChange={(e) => onChangeUserAnswer(e.target.value)}
        />
      </div>

      {evaluation && (
        <div className={`ai-evaluation-box ${evaluation.status}`}>
          <div className="ai-evaluation-header">
            <span className="ai-badge">
              <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Grade: {evaluation.score} / {sq.marks || 0} Marks
            </span>
            <span className={`ai-status-pill ${evaluation.status}`}>
              {evaluation.status.replace('_', ' ')}
            </span>
          </div>
          <div className="prose-content" style={{ marginTop: '0.5rem', fontSize: '1.05rem', color: 'inherit' }}>
            <MemoizedMarkdown content={evaluation.feedback} />
          </div>
        </div>
      )}

      {!hideIndividualButtons && (
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className={`complete-btn ${showAnswer ? 'active' : ''}`}
          >
            {showAnswer ? 'Hide Official Answer' : 'Check Official Answer'}
          </button>
          
          {sq.marks && sq.marks > 0 && (
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '800' }}>
              [{sq.marks} Marks]
            </div>
          )}
        </div>
      )}
      
      {isVisible && sq.answer && (
        <div className="official-answer-box">
          <span className="answer-label">Official Marking Scheme / Answer</span>
          <div className="prose-content" style={{ fontSize: '1.05rem' }}>
            <MemoizedMarkdown content={sq.answer} />
          </div>
        </div>
      )}
    </div>
  );
};

interface QuestionDisplayProps {
  q: any;
  idx?: number;
  hideIndividualButtons?: boolean;
  forceShowAnswer?: boolean;
  
  // Controlled props (optional)
  userAnswers?: Record<string, string>;
  onChangeUserAnswer?: (sqKey: string, val: string) => void;
  topUserAnswer?: string;
  onChangeTopUserAnswer?: (val: string) => void;
  
  evaluationResults?: any;
  singleEvaluation?: any;
  
  hideAICheckButton?: boolean;
}

export default function QuestionDisplay({ 
  q, 
  idx, 
  hideIndividualButtons, 
  forceShowAnswer,
  userAnswers: controlledUserAnswers,
  onChangeUserAnswer: controlledOnChangeUserAnswer,
  topUserAnswer: controlledTopUserAnswer,
  onChangeTopUserAnswer: controlledOnChangeTopUserAnswer,
  evaluationResults: controlledEvaluationResults,
  singleEvaluation: controlledSingleEvaluation,
  hideAICheckButton = false
}: QuestionDisplayProps) {
  const [showTopAnswer, setShowTopAnswer] = useState(false);
  
  // Local states as fallbacks if not controlled
  const [localUserAnswers, localSetUserAnswers] = useState<Record<string, string>>({});
  const [localEvaluationResults, localSetEvaluationResults] = useState<any>(null);
  const [localSingleEvaluation, localSetSingleEvaluation] = useState<any>(null);
  const [localTopUserAnswer, localSetTopUserAnswer] = useState('');
  
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Derive active values
  const userAnswers = controlledUserAnswers || localUserAnswers;
  const topUserAnswer = controlledTopUserAnswer !== undefined ? controlledTopUserAnswer : localTopUserAnswer;
  const evaluationResults = controlledEvaluationResults !== undefined ? controlledEvaluationResults : localEvaluationResults;
  const singleEvaluation = controlledSingleEvaluation !== undefined ? controlledSingleEvaluation : localSingleEvaluation;

  const isVisible = forceShowAnswer || showTopAnswer;

  // Total marks obtained for subquestions
  const totalObtained = evaluationResults
    ? q.subQuestions?.reduce((sum: number, sq: any) => {
        const sqKey = sq.id || sq.part;
        const score = evaluationResults[sqKey]?.score ?? 0;
        return sum + score;
      }, 0)
    : 0;

  const handleUserAnswerChange = (sqKey: string, val: string) => {
    if (controlledOnChangeUserAnswer) {
      controlledOnChangeUserAnswer(sqKey, val);
    } else {
      localSetUserAnswers(prev => ({ ...prev, [sqKey]: val }));
    }
  };

  const handleTopUserAnswerChange = (val: string) => {
    if (controlledOnChangeTopUserAnswer) {
      controlledOnChangeTopUserAnswer(val);
    } else {
      localSetTopUserAnswer(val);
    }
  };

  const handleCheckWithAI = async () => {
    setIsLoadingAI(true);
    setAiError(null);
    try {
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
            studentAnswer: userAnswers[sqKey] || '',
          };
        });
      } else {
        reqBody.answer = q.answer;
        reqBody.marks = q.marks;
        reqBody.studentAnswer = topUserAnswer;
      }

      const res = await fetch('/api/ai/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to evaluate answers.');
      }

      const data = await res.json();
      if (q.subQuestions && q.subQuestions.length > 0) {
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
        localSetEvaluationResults(newEvals);
      } else {
        localSetSingleEvaluation(data);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="question-card">
      <div className="q-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3>
          {q.title || `Question ${q.questionNumber || (idx !== undefined ? idx + 1 : '')}`}
        </h3>
        <span className="q-tag">
          {q.source?.year} • {q.source?.exam} • {q.difficulty?.toUpperCase()}
        </span>
      </div>
      
      {q.figures && q.figures.length > 0 && (
        <div className="q-figures" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', marginBottom: '2.5rem', paddingBottom: '1rem' }}>
          {q.figures.map((fig: any, i: number) => (
            <div key={i} style={{ minWidth: '300px', flex: '0 0 auto' }}>
              <img 
                src={fixImageUrls(fig.imageUrl)} 
                alt={fig.label || `Figure ${i+1}`} 
                style={{ width: '100%', borderRadius: '1.5rem', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Figure+Not+Found';
                }}
              />
              {fig.label && <p style={{ fontSize: '0.9rem', textAlign: 'center', marginTop: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{fig.label}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="prose-content" style={{ marginBottom: '2.5rem' }}>
        <MemoizedMarkdown content={q.mainQuestionText} />
      </div>

      {q.subQuestions && q.subQuestions.length > 0 ? (
        <div className="q-subparts" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {q.subQuestions.map((sq: any, i: number) => {
            const sqKey = sq.id || sq.part;
            return (
              <SubQuestionItem
                key={i}
                sq={sq}
                hideIndividualButtons={hideIndividualButtons}
                forceShowAnswer={forceShowAnswer}
                userAnswer={userAnswers[sqKey] || ''}
                onChangeUserAnswer={(val) => handleUserAnswerChange(sqKey, val)}
                evaluation={evaluationResults?.[sqKey]}
              />
            );
          })}
        </div>
      ) : (
        /* If no subquestions, show a main answer input and button */
        <div style={{ marginTop: '2rem' }}>
          <textarea 
            placeholder="Type your answer here..."
            className="answer-textarea"
            value={topUserAnswer}
            onChange={(e) => handleTopUserAnswerChange(e.target.value)}
          />
          
          {/* AI Check Action Section for Single Question */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {aiError && (
              <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.75rem 1rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
                ⚠️ {aiError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {!hideAICheckButton && (
                <button
                  className="ai-check-btn"
                  onClick={handleCheckWithAI}
                  disabled={isLoadingAI}
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
                >
                  {isLoadingAI ? (
                    <>
                      <span className="spinner"></span>
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Check with AI
                    </>
                  )}
                </button>
              )}
              {!hideIndividualButtons && (
                <button 
                  onClick={() => setShowTopAnswer(!showTopAnswer)}
                  className={`complete-btn ${showTopAnswer ? 'active' : ''}`}
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
                >
                  {showTopAnswer ? 'Hide Official Answer' : 'Check Official Answer'}
                </button>
              )}
              {q.marks && q.marks > 0 && (
                <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '800', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {singleEvaluation ? (
                    <>
                      Total Marks:
                      <span style={{ 
                        background: 'linear-gradient(135deg, #4f46e5, #818cf8)', 
                        color: 'white', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '9999px',
                        fontSize: '0.85rem',
                        boxShadow: '0 2px 6px rgba(79, 70, 229, 0.2)',
                        fontWeight: '800'
                      }}>
                        {singleEvaluation.score} / {q.marks} Marks
                      </span>
                    </>
                  ) : (
                    `[${q.marks} Marks]`
                  )}
                </div>
              )}
            </div>
          </div>

          {singleEvaluation && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={`ai-evaluation-box ${singleEvaluation.status}`} style={{ marginTop: '1.5rem' }}>
                <div className="ai-evaluation-header">
                  <span className="ai-badge">
                    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Grade: {singleEvaluation.score} / {q.marks || 0} Marks
                  </span>
                  <span className={`ai-status-pill ${singleEvaluation.status}`}>
                    {singleEvaluation.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="prose-content" style={{ marginTop: '0.5rem', fontSize: '1.05rem', color: 'inherit' }}>
                  <MemoizedMarkdown content={singleEvaluation.feedback} />
                </div>
              </div>

              {/* AI disclaimer for single question */}
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
                lineHeight: '1.4',
                textAlign: 'left'
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
          
          {isVisible && q.answer && (
            <div className="official-answer-box" style={{ marginTop: '1.5rem' }}>
              <span className="answer-label">Official Answer</span>
              <div className="prose-content" style={{ fontSize: '1.05rem' }}>
                <MemoizedMarkdown content={q.answer} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Check Action Section for Subquestions */}
      {q.subQuestions && q.subQuestions.length > 0 && (
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* AI disclaimer for subquestions */}
          {evaluationResults && (
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
              lineHeight: '1.4',
              textAlign: 'left'
            }}>
              <svg style={{ width: '1.25rem', height: '1.25rem', color: '#d97706', flexShrink: 0, marginTop: '0.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <strong style={{ fontWeight: '700' }}>AI Marking Disclaimer:</strong> This evaluation is performed by AI using the official marking scheme as a guide. AI grading is automated and can make mistakes.
              </div>
            </div>
          )}

          {aiError && (
            <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>
              ⚠️ {aiError}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            {!hideAICheckButton && (
              <button
                className="ai-check-btn"
                onClick={handleCheckWithAI}
                disabled={isLoadingAI}
              >
                {isLoadingAI ? (
                  <>
                    <span className="spinner"></span>
                    Evaluating answers...
                  </>
                ) : (
                  <>
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Check Answers with AI
                  </>
                )}
              </button>
            )}

            {q.marks > 0 && (
              <div style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: hideAICheckButton ? 'auto' : '0' }}>
                Total Marks:
                {evaluationResults ? (
                  <span style={{ 
                    background: 'linear-gradient(135deg, #4f46e5, #818cf8)', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px',
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontWeight: '800'
                  }}>
                    {totalObtained} / {q.marks} Marks
                  </span>
                ) : (
                  <span style={{ color: 'var(--primary)' }}>{q.marks} Marks</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
