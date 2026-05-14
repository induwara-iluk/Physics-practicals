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
    <div className="sq-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '3px solid rgba(255,255,255,0.1)' }}>
      {sq.imageUrl && (
        <img 
          src={fixImageUrls(sq.imageUrl)} 
          alt="subpart image" 
          style={{ maxWidth: '100%', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
          }}
        />
      )}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: 'white', minWidth: '35px' }}>{sq.part}</span>
        <div className="q-content" style={{ color: 'var(--text-muted)', flex: 1, lineHeight: '1.6' }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              img: ({node, ...props}) => (
                <img 
                  {...props} 
                  style={{maxWidth: '100%', borderRadius: '0.5rem'}}
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
      <div style={{ marginTop: '1rem' }}>
        <textarea 
          placeholder="Type your answer here..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            color: 'white',
            fontSize: '0.9rem',
            minHeight: '80px',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {!hideIndividualButtons && (
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            style={{
              background: showAnswer ? 'rgba(255,255,255,0.1)' : 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: showAnswer ? 0.7 : 1
            }}
          >
            {showAnswer ? 'Hide Official Answer' : 'Check Official Answer'}
          </button>
          
          {sq.marks && sq.marks > 0 && (
            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              [{sq.marks} Marks]
            </div>
          )}
        </div>
      )}
      
      {isVisible && sq.answer && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.08)', borderLeft: '3px solid #4ade80', borderRadius: '0.375rem', animation: 'fadeIn 0.3s ease-out' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Official Marking Scheme / Answer</span>
          <div className="q-content" style={{ color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.6' }}>
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
    <div className="question-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="q-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>
          {q.title || `Question ${q.questionNumber || (idx !== undefined ? idx + 1 : '')}`}
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
          {q.source?.year} • {q.source?.exam} • {q.difficulty?.toUpperCase()}
        </span>
      </div>
      
      {q.figures && q.figures.length > 0 && (
        <div className="q-figures" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
          {q.figures.map((fig: any, i: number) => (
            <div key={i} style={{ minWidth: '250px', flex: '0 0 auto' }}>
          <img 
            src={fixImageUrls(fig.imageUrl)} 
            alt={fig.label || `Figure ${i+1}`} 
            style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }} 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Figure+Not+Found';
            }}
          />
              {fig.label && <p style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-muted)' }}>{fig.label}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="q-content q-text" style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.6' }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {preprocessMarkdown(q.mainQuestionText)}
        </ReactMarkdown>
      </div>

      {q.subQuestions && q.subQuestions.length > 0 ? (
        <div className="q-subparts" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {q.subQuestions.map((sq: any, i: number) => (
            <SubQuestionItem key={i} sq={sq} hideIndividualButtons={hideIndividualButtons} forceShowAnswer={forceShowAnswer} />
          ))}
        </div>
      ) : (
        /* If no subquestions, show a main answer input and button */
        <div style={{ marginTop: '1.5rem' }}>
          <textarea 
            placeholder="Type your answer here..."
            value={topUserAnswer}
            onChange={(e) => setTopUserAnswer(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              color: 'white',
              fontSize: '0.9rem',
              minHeight: '100px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          {!hideIndividualButtons && (
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => setShowTopAnswer(!showTopAnswer)}
                style={{
                  background: showTopAnswer ? 'rgba(255,255,255,0.1)' : 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {showTopAnswer ? 'Hide Official Answer' : 'Check Official Answer'}
              </button>
              
              {q.marks && q.marks > 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                  [{q.marks} Marks]
                </div>
              )}
            </div>
          )}
          
          {isVisible && q.answer && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.08)', borderLeft: '3px solid #4ade80', borderRadius: '0.375rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Official Answer</span>
            <div className="q-content" style={{ color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.6' }}>
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
        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 'bold' }}>
          [Total: {q.marks} Marks]
        </div>
      )}
    </div>
  );
}
