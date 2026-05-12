'use client';

import React, { useState, useEffect } from 'react';

type AdminQuestionFormProps = {
  selectedQuestionId: string;
  dbPracticals: any[];
  onSaved: (savedId: string) => void;
};

export default function AdminQuestionForm({ selectedQuestionId, dbPracticals, onSaved }: AdminQuestionFormProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Top level fields
  const [practicalId, setPracticalId] = useState('');
  const [questionNumber, setQuestionNumber] = useState('1');
  const [title, setTitle] = useState('');
  
  // Source fields
  const [srcType, setSrcType] = useState('past_paper');
  const [srcExam, setSrcExam] = useState('GCE Advanced Level');
  const [srcSubject, setSrcSubject] = useState('Physics');
  const [srcYear, setSrcYear] = useState(new Date().getFullYear().toString());
  const [srcPaper, setSrcPaper] = useState('1');
  const [srcVariant, setSrcVariant] = useState('English');
  const [srcQNum, setSrcQNum] = useState('1');

  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [mainQuestionText, setMainQuestionText] = useState('');

  // Arrays
  const [figures, setFigures] = useState<{label: string, imageUrl: string}[]>([]);
  const [subQuestions, setSubQuestions] = useState<{id: string, part: string, text: string, imageUrl: string, marks?: number, answer?: string}[]>([]);
  const [markingScheme, setMarkingScheme] = useState<{subQuestionId: string, answer: string}[]>([]);
  const [answers, setAnswers] = useState<{subQuestionId: string, latex: string}[]>([]);
  const [topAnswer, setTopAnswer] = useState('');

  useEffect(() => {
    if (selectedQuestionId === 'new') {
      resetForm();
      return;
    }
    
    const fetchQ = async () => {
      setLoading(true);
      setMessage('');
      try {
        const res = await fetch(`/api/admin/questions/${selectedQuestionId}`);
        if (res.ok) {
          const data = await res.json();
          setPracticalId(data.practicalId || '');
          setQuestionNumber(data.questionNumber || '1');
          setTitle(data.title || '');
          
          if (data.source) {
            setSrcType(data.source.type || 'past_paper');
            setSrcExam(data.source.exam || 'GCE Advanced Level');
            setSrcSubject(data.source.subject || 'Physics');
            setSrcYear(data.source.year?.toString() || '');
            setSrcPaper(data.source.paper?.toString() || '1');
            setSrcVariant(data.source.variant || 'English');
            setSrcQNum(data.source.questionNumber?.toString() || '1');
          }
          
          setTags(data.tags ? data.tags.join(', ') : '');
          setDifficulty(data.difficulty || 'medium');
          setMainQuestionText(data.mainQuestionText || '');
          
          setFigures(data.figures || []);
          setSubQuestions(data.subQuestions || []);
          setTopAnswer(data.answer || '');
          setMarkingScheme(data.markingScheme || []);
          setAnswers(data.answers || []);
        } else {
          setMessage('Error loading question');
        }
      } catch (err) {
        setMessage('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchQ();
  }, [selectedQuestionId]);

  const resetForm = () => {
    setPracticalId('');
    setQuestionNumber('1');
    setTitle('');
    setSrcYear(new Date().getFullYear().toString());
    setTags('');
    setDifficulty('medium');
    setMainQuestionText('');
    setFigures([]);
    setSubQuestions([]);
    setTopAnswer('');
    setMarkingScheme([]);
    setAnswers([]);
  };

  const handleUploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) return data.url;
      throw new Error(data.error);
    } catch (e) {
      console.error(e);
      alert('Upload failed');
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!practicalId) {
      setMessage('❌ Please select a practical');
      return;
    }
    setSaving(true);
    setMessage('');
    
    try {
      const payload = {
        practicalId,
        questionNumber,
        title,
        source: {
          type: srcType,
          exam: srcExam,
          subject: srcSubject,
          year: parseInt(srcYear),
          paper: parseInt(srcPaper),
          variant: srcVariant,
          questionNumber: parseInt(srcQNum)
        },
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
        difficulty,
        mainQuestionText,
        figures,
        answer: topAnswer,
        subQuestions,
        markingScheme,
        answers
      };
      
      const isNew = selectedQuestionId === 'new';
      const url = isNew ? '/api/admin/questions' : `/api/admin/questions/${selectedQuestionId}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setMessage('✅ Question saved successfully!');
        const savedData = await res.json();
        onSaved(isNew ? savedData._id : selectedQuestionId);
      } else {
        const data = await res.json();
        setMessage('❌ Error saving: ' + data.error);
      }
    } catch (err) {
      setMessage('❌ Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading database entry...</div>;

  return (
    <div className="editor-layout">
      <div className="form-side">
        <form onSubmit={handleSave} className="q-form">
      <div className="form-header">
        <h2>{selectedQuestionId === 'new' ? 'Create New Question' : 'Editing Question'}</h2>
        {message && <div className="status-message">{message}</div>}
      </div>

      <div className="form-group">
        <label>Related Practical</label>
        <select value={practicalId} onChange={e => setPracticalId(e.target.value)} className="title-input" required>
          <option value="" disabled>-- Select a Practical --</option>
          {dbPracticals.map((p, i) => (
            <option key={p._id} value={p._id}>{i + 1}. {p.title.replace(/^\d+\.\s*/, '')}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Question Number (e.g. 1)</label>
          <input type="text" value={questionNumber} onChange={e => setQuestionNumber(e.target.value)} className="title-input" required />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="title-input" required />
        </div>
      </div>

      {/* Source Fields */}
      <fieldset className="q-fieldset">
        <legend>Source Metadata</legend>
        <div className="form-row">
          <div className="form-group"><label>Type</label><input type="text" value={srcType} onChange={e=>setSrcType(e.target.value)} className="title-input"/></div>
          <div className="form-group"><label>Year</label><input type="number" value={srcYear} onChange={e=>setSrcYear(e.target.value)} className="title-input"/></div>
          <div className="form-group"><label>Exam</label><input type="text" value={srcExam} onChange={e=>setSrcExam(e.target.value)} className="title-input"/></div>
        </div>
      </fieldset>

      <div className="form-row">
        <div className="form-group"><label>Tags (comma separated)</label><input type="text" value={tags} onChange={e=>setTags(e.target.value)} className="title-input"/></div>
        <div className="form-group">
          <label>Difficulty</label>
          <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="title-input">
            <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Main Question Text</label>
        <textarea value={mainQuestionText} onChange={e => setMainQuestionText(e.target.value)} rows={4} className="title-input" required />
      </div>

      <div className="form-group">
        <label>Top Level Answer (Optional)</label>
        <textarea value={topAnswer} onChange={e => setTopAnswer(e.target.value)} rows={2} className="title-input" />
      </div>

      {/* Sub Questions */}
      <fieldset className="q-fieldset">
        <legend>Sub Questions (a, b, i, ii)</legend>
        {subQuestions.map((sq, idx) => (
          <div key={idx} className="sub-item">
            <div className="form-row">
              <div className="form-group"><label>ID</label><input type="text" value={sq.id} onChange={e => { const n = [...subQuestions]; n[idx].id = e.target.value; setSubQuestions(n); }} className="title-input" placeholder="a_i"/></div>
              <div className="form-group"><label>Part Label</label><input type="text" value={sq.part} onChange={e => { const n = [...subQuestions]; n[idx].part = e.target.value; setSubQuestions(n); }} className="title-input" placeholder="(a)(i)"/></div>
            </div>
            <div className="form-group">
              <label>Question Text</label>
              <textarea value={sq.text} onChange={e => { const n = [...subQuestions]; n[idx].text = e.target.value; setSubQuestions(n); }} rows={2} className="title-input"/>
            </div>
            <div className="form-group">
              <label>Answer (Text/LaTeX)</label>
              <textarea value={sq.answer || ''} onChange={e => { const n = [...subQuestions]; n[idx].answer = e.target.value; setSubQuestions(n); }} rows={2} className="title-input"/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Marks</label>
                <input type="number" value={sq.marks || ''} onChange={e => { const n = [...subQuestions]; n[idx].marks = parseInt(e.target.value) || 0; setSubQuestions(n); }} className="title-input" />
              </div>
              <div className="form-group">
                <label>Image Upload</label>
                <div className="upload-row">
                  <input type="file" onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = await handleUploadImage(e.target.files[0]);
                      if (url) { const n = [...subQuestions]; n[idx].imageUrl = url; setSubQuestions(n); }
                    }
                  }} />
                  {sq.imageUrl && <img src={sq.imageUrl} alt="preview" className="preview-img" />}
                </div>
              </div>
            </div>
            <button type="button" onClick={() => { const n = [...subQuestions]; n.splice(idx, 1); setSubQuestions(n); }} className="remove-btn">Remove Sub Question</button>
          </div>
        ))}
        <button type="button" onClick={() => setSubQuestions([...subQuestions, {id:'', part:'', text:'', imageUrl:''}])} className="add-btn">➕ Add Sub Question</button>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Question'}</button>
      </div>

      <style jsx>{`
        .q-form { display: flex; flex-direction: column; gap: 1rem; }
        .q-fieldset { border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 1.5rem; margin-top: 1rem; }
        .q-fieldset legend { font-weight: bold; padding: 0 0.5rem; color: var(--primary); }
        .sub-item { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; }
        .upload-row { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; }
        .preview-img { height: 40px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); }
        .add-btn { background: rgba(255,255,255,0.1); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; }
        .add-btn:hover { background: rgba(255,255,255,0.2); }
        .remove-btn { background: rgba(239,68,68,0.2); color: #f87171; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; margin-top: 0.5rem; font-size: 0.8rem; }
        .remove-btn:hover { background: rgba(239,68,68,0.3); }
        /* Reuse inputs from parent */
        .title-input { width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.75rem; color: white; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .status-message { padding: 0.5rem 1rem; background: rgba(34,197,94,0.1); color: #4ade80; border-radius: 0.5rem; }
          .save-btn { background: white; color: black; border: none; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 700; cursor: pointer; }
          .editor-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start; }
          @media (max-width: 1024px) {
            .editor-layout { grid-template-columns: 1fr; }
          }
        `}</style>
      </form>
      </div>

      <div className="ai-side glass" style={{ padding: '1.5rem', borderRadius: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1rem' }}>
        <h3 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ✨ AI Question Extractor
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Upload an image of a question paper. The AI will read it and fill the form fields automatically.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload Question Image</label>
          <input type="file" accept="image/*" className="title-input" />
        </div>
        <button type="button" className="save-btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', marginTop: '0.5rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Extract with AI
        </button>
      </div>
    </div>
  );
}
