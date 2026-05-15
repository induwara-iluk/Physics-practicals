'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { preprocessMarkdown, fixImageUrls } from '@/lib/markdownUtils';

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
}

const SubQuestionItem = ({ sq, hideIndividualButtons, forceShowAnswer }: SubQuestionProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const isVisible = forceShowAnswer || showAnswer;

  return (
    <div className="sq-card">
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
            {preprocessMarkdown(sq.text)}
          </ReactMarkdown>
        </div>
      </div>
      
      {/* User Input Area */}
      <div style={{ marginTop: '1.5rem' }}>
        <textarea 
          placeholder="Type your answer here..."
          className="answer-textarea"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
      </div>

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
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkMath]} 
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {preprocessMarkdown(sq.answer)}
            </ReactMarkdown>
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
}

export default function QuestionDisplay({ q, idx, hideIndividualButtons, forceShowAnswer }: QuestionDisplayProps) {
  const [showTopAnswer, setShowTopAnswer] = useState(false);
  const [topUserAnswer, setTopUserAnswer] = useState('');

  const isVisible = forceShowAnswer || showTopAnswer;

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
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {preprocessMarkdown(q.mainQuestionText)}
        </ReactMarkdown>
      </div>

      {q.subQuestions && q.subQuestions.length > 0 ? (
        <div className="q-subparts" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {q.subQuestions.map((sq: any, i: number) => (
            <SubQuestionItem key={i} sq={sq} hideIndividualButtons={hideIndividualButtons} forceShowAnswer={forceShowAnswer} />
          ))}
        </div>
      ) : (
        /* If no subquestions, show a main answer input and button */
        <div style={{ marginTop: '2rem' }}>
          <textarea 
            placeholder="Type your answer here..."
            className="answer-textarea"
            value={topUserAnswer}
            onChange={(e) => setTopUserAnswer(e.target.value)}
          />
          {!hideIndividualButtons && (
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => setShowTopAnswer(!showTopAnswer)}
                className={`complete-btn ${showTopAnswer ? 'active' : ''}`}
              >
                {showTopAnswer ? 'Hide Official Answer' : 'Check Official Answer'}
              </button>
              
              {q.marks && q.marks > 0 && (
                <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '800' }}>
                  [{q.marks} Marks]
                </div>
              )}
            </div>
          )}
          
          {isVisible && q.answer && (
            <div className="official-answer-box">
              <span className="answer-label">Official Answer</span>
              <div className="prose-content" style={{ fontSize: '1.05rem' }}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]} 
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                >
                  {preprocessMarkdown(q.answer)}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {q.subQuestions && q.subQuestions.length > 0 && q.marks > 0 && (
        <div style={{ marginTop: '2.5rem', fontSize: '1rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: '800' }}>
          [Total: {q.marks} Marks]
        </div>
      )}
    </div>
  );
}
