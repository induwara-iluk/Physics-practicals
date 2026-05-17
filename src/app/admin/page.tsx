'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminQuestionForm from '@/components/AdminQuestionForm';
import ImageUploadButton from '@/components/ImageUploadButton';
import MarkdownPreview from '@/components/MarkdownPreview';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'practicals' | 'questions' | 'history'>('practicals');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [dbPracticals, setDbPracticals] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [dbQuestions, setDbQuestions] = useState<any[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('new');
  const [dbHistory, setDbHistory] = useState<any[]>([]);
  const [historyForm, setHistoryForm] = useState({ year: new Date().getFullYear(), q1: '', q2: '', q3: '', q4: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
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
    if (!isAuthorized) return;
    
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
      
    fetch('/api/admin/history')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbHistory(data);
      });
  }, [isAuthorized]);

  // Load practical data when a new one is selected
  useEffect(() => {
    if (!selectedSlug || !isAuthorized) return;
    
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
  }, [selectedSlug, isAuthorized]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.app_metadata?.role !== 'admin') {
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, []);

  if (isAuthorized === null) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>Verifying authorization...</div>;
  if (!isAuthorized) return null;

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

  const handleHistorySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyForm)
      });
      if (res.ok) {
        setMessage('✅ History saved!');
        const data = await fetch('/api/admin/history').then(r => r.json());
        if (Array.isArray(data)) setDbHistory(data);
      }
    } catch (err) {
      setMessage('❌ Error saving history');
    } finally {
      setSaving(false);
    }
  };

  const insertAtCursor = (field: 'theory' | 'method' | 'importantPoints', text: string) => {
    const textarea = document.getElementById(field) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    let currentVal = '';
    if (field === 'theory') currentVal = theory;
    else if (field === 'method') currentVal = method;
    else if (field === 'importantPoints') currentVal = importantPoints;

    const newVal = currentVal.substring(0, start) + text + currentVal.substring(end);
    
    if (field === 'theory') setTheory(newVal);
    else if (field === 'method') setMethod(newVal);
    else if (field === 'importantPoints') setImportantPoints(newVal);

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
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Paper History
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
            ) : activeTab === 'questions' ? (
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
            ) : (
              <div className="instructions"><h3>Paper History</h3><p>Manage past paper question history.</p></div>
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
                    <MarkdownPreview content={theory} label="Theory" />
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
                      rows={8}
                      placeholder="List the steps of the experiment..."
                    />
                    <MarkdownPreview content={method} label="Method" />
                  </div>

                  <div className="form-group">
                    <div className="label-with-action">
                      <label htmlFor="importantPoints">Important Points (Markdown/LaTeX supported, One per line)</label>
                      <ImageUploadButton 
                        onImageUploaded={(url) => insertAtCursor('importantPoints', `\n\n![Image](${url})\n\n`)} 
                      />
                    </div>
                    <textarea 
                      id="importantPoints"
                      value={importantPoints} 
                      onChange={e => setImportantPoints(e.target.value)} 
                      rows={5}
                      placeholder="Enter crucial marking points..."
                    />
                    <MarkdownPreview content={importantPoints} label="Important Points" />
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
            ) : activeTab === 'questions' ? (
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
            ) : (
              // HISTORY TAB
              <div className="history-admin">
                <div className="form-header">
                  <h2>Edit Paper History</h2>
                  {message && <div className="status-message">{message}</div>}
                </div>
                
                <form onSubmit={handleHistorySave} className="history-form">
                  <div className="form-row">
                    <div className="form-group"><label>Year</label><input type="number" value={historyForm.year} onChange={e=>setHistoryForm({...historyForm, year: parseInt(e.target.value)})} className="title-input"/></div>
                    <div className="form-group"><label>Q1</label><input type="text" value={historyForm.q1} onChange={e=>setHistoryForm({...historyForm, q1: e.target.value})} className="title-input"/></div>
                    <div className="form-group"><label>Q2</label><input type="text" value={historyForm.q2} onChange={e=>setHistoryForm({...historyForm, q2: e.target.value})} className="title-input"/></div>
                    <div className="form-group"><label>Q3</label><input type="text" value={historyForm.q3} onChange={e=>setHistoryForm({...historyForm, q3: e.target.value})} className="title-input"/></div>
                    <div className="form-group"><label>Q4</label><input type="text" value={historyForm.q4} onChange={e=>setHistoryForm({...historyForm, q4: e.target.value})} className="title-input"/></div>
                  </div>
                  <button type="submit" className="save-btn" disabled={saving}>Save Entry</button>
                </form>

                <div className="history-list mt-12">
                  <h3>Existing Entries</h3>
                  <div className="history-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Year</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {dbHistory.map(h => (
                          <tr key={h._id}>
                            <td>{h.year}</td>
                            <td>{h.q1}</td>
                            <td>{h.q2}</td>
                            <td>{h.q3}</td>
                            <td>{h.q4}</td>
                            <td><button onClick={() => setHistoryForm({year: h.year, q1: h.q1, q2: h.q2, q3: h.q3, q4: h.q4})} className="edit-mini-btn">Edit</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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
          grid-template-columns: minmax(0, 1fr);
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .admin-content {
            grid-template-columns: 350px minmax(0, 1fr);
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
          min-width: 0;
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
        
        .mt-12 { margin-top: 3rem; }
        .edit-mini-btn { background: #f1f5f9; border: 1px solid var(--border); padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.8rem; cursor: pointer; }
        .edit-mini-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }
        .admin-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .admin-table th, .admin-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border); }
        .admin-table th { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
