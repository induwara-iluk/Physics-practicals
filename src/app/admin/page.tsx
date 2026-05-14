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

                  <div className="form-group">
                    <div className="label-with-action">
                      <label htmlFor="theory">Theory (Markdown/Text)</label>
                      <ImageUploadButton 
                        onImageUploaded={(url) => insertAtCursor('theory', `\n\n![Image](${url})\n\n`)} 
                      />
                    </div>
                    <textarea 
                      id="theory"
                      value={theory} 
                      onChange={e => setTheory(e.target.value)} 
                      rows={6}
                      placeholder="Enter scientific theory here..."
                    />
                  </div>

                  <div className="form-group">
                    <div className="label-with-action">
                      <label htmlFor="method">Experimental Method & Setup</label>
                      <ImageUploadButton 
                        onImageUploaded={(url) => insertAtCursor('method', `\n\n![Image](${url})\n\n`)} 
                      />
                    </div>
                    <textarea 
                      id="method"
                      value={method} 
                      onChange={e => setMethod(e.target.value)} 
                      rows={8}
                      placeholder="Enter step-by-step method and setup instructions here..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Required Apparatus (One per line)</label>
                      <textarea 
                        value={apparatus} 
                        onChange={e => setApparatus(e.target.value)} 
                        rows={5}
                        placeholder="e.g.&#10;Vernier Calliper&#10;Beaker&#10;Water"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Important Points (One per line)</label>
                      <textarea 
                        value={importantPoints} 
                        onChange={e => setImportantPoints(e.target.value)} 
                        rows={5}
                        placeholder="Enter crucial marking points..."
                      />
                    </div>
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
          color: white;
          margin-bottom: 0.5rem;
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
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
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
          border-radius: 1rem;
          height: fit-content;
        }

        .sidebar h3 {
          font-size: 1.1rem;
          color: white;
          margin-bottom: 1rem;
        }

        .practical-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
        }
        
        .practical-select option {
          background: var(--bg-dark);
          padding: 0.5rem;
          color: var(--text-muted);
        }
        
        .practical-select option:checked {
          background: var(--primary);
          color: white;
        }

        .instructions {
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          background: rgba(0,0,0,0.2);
          padding: 1rem;
          border-radius: 0.5rem;
        }
        
        .instructions ul {
          padding-left: 1rem;
          margin-top: 0.5rem;
        }

        .main-form {
          padding: 2rem;
          border-radius: 1rem;
        }

        .empty-state, .loading {
          text-align: center;
          padding: 4rem 0;
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .form-header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-header h2 {
          font-size: 1.5rem;
          color: white;
        }

        .status-message {
          padding: 0.5rem 1rem;
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        textarea, .title-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          color: white;
          font-family: inherit;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        textarea {
          resize: vertical;
        }

        textarea:focus, .title-input:focus {
          outline: none;
          border-color: var(--primary);
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
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: flex-end;
        }

        .save-btn {
          background: white;
          color: black;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
