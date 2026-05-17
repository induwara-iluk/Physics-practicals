'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { preprocessMarkdown } from '@/lib/markdownUtils';

interface MarkdownPreviewProps {
  content: string;
  label?: string;
}

export default function MarkdownPreview({ content, label }: MarkdownPreviewProps) {
  if (!content) return null;

  return (
    <div className="markdown-preview-container">
      {label && <div className="preview-label">{label} Preview</div>}
      <div className="preview-box prose-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {preprocessMarkdown(content)}
        </ReactMarkdown>
      </div>
      <style jsx>{`
        .markdown-preview-container {
          margin-top: 1rem;
          padding: 1.25rem;
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: 1rem;
          border-left: 4px solid var(--primary);
          max-width: 100%;
          overflow: hidden;
        }
        .preview-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary);
          font-weight: 800;
          margin-bottom: 0.75rem;
        }
        .preview-box {
          font-size: 1rem;
          color: var(--text);
          line-height: 1.6;
          max-width: 100%;
          overflow-x: auto;
        }
        .preview-box :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          display: block;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}
