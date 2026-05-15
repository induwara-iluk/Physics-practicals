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
  const [medium, setMedium] = useState<'English' | 'Sinhala'>('English');

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
          setMedium(data.medium || 'English');
          
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
    setMedium('English');
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
        answers,
        medium
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
        <div className="form-group">
          <label>Medium (Language)</label>
          <select value={medium} onChange={e=>setMedium(e.target.value as 'English' | 'Sinhala')} className="title-input">
            <option value="English">English</option>
            <option value="Sinhala">Sinhala</option>
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
        .q-fieldset { border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; margin-top: 1rem; background: #f8fafc; }
        .q-fieldset legend { font-weight: 800; padding: 0 0.75rem; color: var(--primary); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
        .sub-item { background: white; padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; border: 1px solid var(--border); box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .upload-row { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; }
        .preview-img { height: 60px; border-radius: 8px; border: 1px solid var(--border); }
        .add-btn { background: #f1f5f9; color: var(--text); border: 1px solid var(--border); padding: 0.75rem 1.5rem; border-radius: 0.75rem; cursor: pointer; font-weight: 700; transition: all 0.2s; }
        .add-btn:hover { background: white; border-color: var(--primary); color: var(--primary); }
        .remove-btn { background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; margin-top: 1rem; font-size: 0.85rem; font-weight: 700; }
        .remove-btn:hover { background: #ffe4e6; }
        /* Reuse inputs from parent */
        .title-input { width: 100%; background: white; border: 1px solid var(--border); border-radius: 0.75rem; padding: 0.75rem 1rem; color: var(--text); font-size: 1rem; transition: all 0.2s; }
        .title-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
        .status-message { padding: 0.5rem 1rem; background: #ecfdf5; color: #059669; border-radius: 0.5rem; font-weight: 600; border: 1px solid #d1fae5; }
        .save-btn { background: var(--primary); color: white; border: none; padding: 1rem 3rem; border-radius: 1rem; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2); transition: all 0.2s; }
        .save-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3); background: #4338ca; }
        .editor-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 2.5rem; align-items: start; }
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
