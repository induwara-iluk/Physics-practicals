'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminQuestionForm from '@/components/AdminQuestionForm';
import ImageUploadButton from '@/components/ImageUploadButton';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'practicals' | 'questions'>('practicals');

  // Practical State
  const [dbPracticals, setDbPracticals] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  
  // Question State
  const [dbQuestions, setDbQuestions] = useState<any[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('new');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form State (Practicals)
  const [title, setTitle] = useState('');
  const [theory, setTheory] = useState('');
  const [method, setMethod] = useState('');
  const [apparatus, setApparatus] = useState('');
  const [importantPoints, setImportantPoints] = useState('');
  const [diagrams, setDiagrams] = useState('');
  const [medium, setMedium] = useState<'English' | 'Sinhala'>('English');
  const [practicalNumber, setPracticalNumber] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [estimatedTime, setEstimatedTime] = useState<string>('45 mins');


  // Fetch all practicals & questions for the sidebar
  useEffect(() => {
    fetch('/api/practicals')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbPracticals(data);
        }
      })
      .catch(err => console.error('Error fetching practicals for admin:', err));

    fetch('/api/admin/questions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbQuestions(data);
        }
      })
      .catch(err => console.error('Error fetching questions for admin:', err));
  }, []);

  // Load practical data when a new one is selected
  useEffect(() => {
    if (!selectedSlug) return;
    
    const fetchPractical = async () => {
      setLoading(true);
      setMessage('');
      try {
        const res = await fetch(`/api/admin/practicals/${selectedSlug}`);
        const data = await res.json();
        
        if (res.ok) {
          setTitle(data.title || '');
          setTheory(data.theory || '');
          setMethod(data.method || '');
          setApparatus(data.apparatus ? data.apparatus.join('\n') : '');
          setImportantPoints(data.importantPoints ? data.importantPoints.join('\n') : '');
          setDiagrams(data.diagrams ? data.diagrams.join('\n') : '');
          setMedium(data.medium || 'English');
          setPracticalNumber(data.practicalNumber?.toString() || '');
          setDifficulty(data.difficulty || 'Medium');
          setEstimatedTime(data.estimatedTime || '45 mins');
          
          if (data.warning) {
            setMessage('⚠️ ' + data.warning);
          }
        } else {
          setMessage('Error loading practical: ' + data.error);
        }
      } catch (err) {
        setMessage('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPractical();
  }, [selectedSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlug) return;
    
    setSaving(true);
    setMessage('');
    
    try {
      const payload = {
        title,
        slug: selectedSlug,
        theory,
        method,
        apparatus: apparatus.split('\n').filter(s => s.trim()),
        importantPoints: importantPoints.split('\n').filter(s => s.trim()),
        diagrams: diagrams.split('\n').filter(s => s.trim()),
        medium,
        practicalNumber: practicalNumber ? parseInt(practicalNumber) : undefined,
        difficulty,
        estimatedTime,
      };
      
      const res = await fetch(`/api/admin/practicals/${selectedSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setMessage('✅ Practical saved successfully to the database!');
      } else {
        const data = await res.json();
        setMessage('❌ Error saving: ' + data.error);
      }
    } catch (err) {
      setMessage('❌ Failed to save data. Make sure MongoDB is connected.');
    } finally {
      setSaving(false);
    }
  };

  const insertAtCursor = (field: 'theory' | 'method', text: string) => {
    const textarea = document.getElementById(field) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = field === 'theory' ? theory : method;
    const newVal = currentVal.substring(0, start) + text + currentVal.substring(end);
    
    if (field === 'theory') setTheory(newVal);
    else setMethod(newVal);

    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  return (
    <div className="admin-wrapper">
      <div className="container">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage Practicals and Questions</p>

          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'practicals' ? 'active' : ''}`}
              onClick={() => setActiveTab('practicals')}
            >
              Practicals
            </button>
            <button 
              className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions
            </button>
          </div>
        </header>

        <div className="admin-content">
          {/* SIDEBAR */}
          <div className="sidebar glass-dark">
            {activeTab === 'practicals' ? (
              <>
                <h3>Select a Practical</h3>
                <select 
                  size={15} 
                  className="practical-select"
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                >
                  <option value="" disabled>-- Choose to edit --</option>
                  {dbPracticals.map((p, i) => {
                    const titleOnly = p.title.replace(/^\d+\.\s*/, '');
                    return (
                      <option key={p.slug} value={p.slug}>
                        {i + 1}. {titleOnly.substring(0, 40)}...
                      </option>
                    );
                  })}
                </select>
                
                <div className="instructions">
                  <p><strong>Tips:</strong></p>
                  <ul>
                    <li>For arrays (Apparatus, Points, Diagrams), enter one item per line.</li>
                    <li>Diagrams should be valid image URLs.</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h3>Select a Question</h3>
                <select 
                  size={15} 
                  className="practical-select"
                  value={selectedQuestionId}
                  onChange={(e) => setSelectedQuestionId(e.target.value)}
                >
                  <option value="new">➕ Add New Question</option>
                  {dbQuestions.map((q) => {
                    const pracTitle = q.practicalId?.title || 'Unknown Practical';
                    return (
                      <option key={q._id} value={q._id}>
                        [{q.year}] {pracTitle.substring(0, 20)}...
                      </option>
                    );
                  })}
                </select>
              </>
            )}
          </div>

          {/* MAIN FORM */}
          <div className="main-form glass">
            {activeTab === 'practicals' ? (
              // PRACTICALS FORM
              !selectedSlug ? (
                <div className="empty-state">Please select a practical from the list to edit its contents.</div>
              ) : loading ? (
                <div className="loading">Loading database entry...</div>
              ) : (
                <form onSubmit={handleSave}>
                  <div className="form-header">
                    <h2>Editing: {title || 'No Title'}</h2>
                    {message && <div className="status-message">{message}</div>}
                  </div>

                  <div className="form-group">
                    <label>Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className="title-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Medium (Language)</label>
                    <select 
                      value={medium} 
                      onChange={e => setMedium(e.target.value as 'English' | 'Sinhala')} 
                      className="title-input"
                    >
                      <option value="English">English</option>
                      <option value="Sinhala">Sinhala</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Practical Number</label>
                      <input 
                        type="number" 
                        value={practicalNumber} 
                        onChange={e => setPracticalNumber(e.target.value)} 
                        className="title-input"
                        placeholder="e.g. 1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Difficulty</label>
                      <select 
                        value={difficulty} 
                        onChange={e => setDifficulty(e.target.value as any)} 
                        className="title-input"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Est. Time</label>
                      <input 
                        type="text" 
                        value={estimatedTime} 
                        onChange={e => setEstimatedTime(e.target.value)} 
                        className="title-input"
                        placeholder="e.g. 45 mins"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Required Apparatus (One per line or comma separated)</label>
                    <textarea 
                      value={apparatus} 
                      onChange={e => setApparatus(e.target.value)} 
                      rows={4}
                      placeholder="e.g.&#10;Vernier Calliper&#10;Beaker&#10;Water"
                    />
                  </div>

                  <div className="form-group">
                    <div className="label-with-action">
                      <label htmlFor="theory">Scientific Theory (Markdown/Text)</label>
                      <ImageUploadButton 
                        onImageUploaded={(url) => insertAtCursor('theory', `\n\n![Image](${url})\n\n`)} 
                      />
                    </div>
                    <textarea 
                      id="theory"
                      value={theory} 
                      onChange={e => setTheory(e.target.value)} 
                      rows={8}
                      placeholder="Enter scientific theory here..."
                    />
                  </div>

                  <div className="form-group">
                    <div className="label-with-action">
                      <label htmlFor="method">Experimental Method & Setup (Steps)</label>
                      <ImageUploadButton 
                        onImageUploaded={(url) => insertAtCursor('method', `\n\n![Image](${url})\n\n`)} 
                      />
                    </div>
                    <textarea 
                      id="method"
                      value={method} 
                      onChange={e => setMethod(e.target.value)} 
                      rows={10}
                      placeholder="Enter step-by-step method and setup instructions here..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Important Points (One per line - supports Markdown/LaTeX)</label>
                    <textarea 
                      value={importantPoints} 
                      onChange={e => setImportantPoints(e.target.value)} 
                      rows={5}
                      placeholder="Enter crucial marking points..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Diagram Image URLs (One per line)</label>
                    <textarea 
                      value={diagrams} 
                      onChange={e => setDiagrams(e.target.value)} 
                      rows={3}
                      placeholder="https://example.com/image1.png"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={saving}>
                      {saving ? 'Saving to Database...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )
            ) : (
              // QUESTIONS FORM
              <AdminQuestionForm 
                selectedQuestionId={selectedQuestionId} 
                dbPracticals={dbPracticals} 
                onSaved={(savedId) => {
                  setSelectedQuestionId(savedId);
                  fetch('/api/admin/questions')
                    .then(res => res.json())
                    .then(data => {
                      if (Array.isArray(data)) setDbQuestions(data);
                    });
                }} 
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-wrapper {
          min-height: 100vh;
          padding-top: 6rem;
          padding-bottom: 4rem;
          background-color: var(--bg-dark);
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .admin-header {
          margin-bottom: 2rem;
        }

        .admin-header h1 {
          font-size: 2.5rem;
          color: var(--text);
          margin-bottom: 0.5rem;
          font-weight: 800;
        }

        .admin-header p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .admin-tabs {
          display: flex;
          gap: 1rem;
        }

        .tab-btn {
          background: white;
          border: 1px solid var(--border);
          color: var(--text-muted);
          padding: 0.6rem 1.75rem;
          border-radius: 0.75rem;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: #f1f5f9;
          color: var(--text);
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .admin-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .admin-content {
            grid-template-columns: 350px 1fr;
          }
        }

        .sidebar {
          padding: 1.5rem;
          border-radius: 1.5rem;
          height: fit-content;
          background: white;
          border: 1px solid var(--border);
        }

        .sidebar h3 {
          font-size: 1.1rem;
          color: var(--text);
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .practical-select {
          width: 100%;
          background: #f8fafc;
          border: 1px solid var(--border);
          color: var(--text);
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
        }
        
        .practical-select option {
          background: white;
          padding: 0.75rem;
          color: var(--text);
        }
        
        .practical-select option:checked {
          background: var(--primary);
          color: white;
        }

        .instructions {
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: #475569;
          background: #f1f5f9;
          padding: 1.25rem;
          border-radius: 1rem;
        }
        
        .instructions ul {
          padding-left: 1.25rem;
          margin-top: 0.5rem;
        }

        .main-form {
          padding: 2.5rem;
          border-radius: 1.5rem;
          background: white;
          border: 1px solid var(--border);
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .empty-state, .loading {
          text-align: center;
          padding: 4rem 0;
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .form-header {
          margin-bottom: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }

        .form-header h2 {
          font-size: 1.5rem;
          color: var(--text);
          font-weight: 700;
        }

        .status-message {
          padding: 0.5rem 1rem;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #d1fae5;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 2rem;
        }

        label {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        textarea, .title-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 1rem;
          color: var(--text);
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.2s;
        }

        textarea {
          resize: vertical;
        }

        textarea:focus, .title-input:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
        }

        .label-with-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .label-with-action label {
          margin-bottom: 0;
        }

        .form-actions {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
        }

        .save-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 1rem 3rem;
          border-radius: 1rem;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
          background: #4338ca;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
