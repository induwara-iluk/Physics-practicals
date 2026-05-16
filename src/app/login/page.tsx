'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [medium, setMedium] = useState<'English' | 'Sinhala'>('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              medium: medium,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        
        // If auto-confirm is off, tell them to check email
        if (data?.session) {
          router.push('/');
          router.refresh();
        } else {
          alert('Check your email for the confirmation link!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="noise-overlay" />
      <div className="bg-radial" />
      
      <div className="login-card animate-fade">
        <div className="logo-section">
          <div className="logo-box">
            <span className="logo-symbol">Φ</span>
          </div>
          <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isSignUp ? 'Join the physics practical platform' : 'Sign in to continue your learning'}</p>
        </div>

        <form onSubmit={handleAuth} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <div className="input-group">
              <label>Prefered Medium</label>
              <div className="medium-toggle-auth">
                <button 
                  type="button"
                  className={`m-btn ${medium === 'English' ? 'active' : ''}`}
                  onClick={() => setMedium('English')}
                >
                  English
                </button>
                <button 
                  type="button"
                  className={`m-btn ${medium === 'Sinhala' ? 'active' : ''}`}
                  onClick={() => setMedium('Sinhala')}
                >
                  සිංහල
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-btn">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
          z-index: 0;
          pointer-events: none;
          opacity: 0.4;
        }

        .bg-radial {
          position: fixed;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 1000px;
          height: 600px;
          background: radial-gradient(circle at center, rgba(79, 70, 229, 0.08) 0%, transparent 70%);
          z-index: 0;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: white;
          padding: 3rem 2.5rem;
          border-radius: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 1;
        }

        .logo-section {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo-box {
          width: 3.5rem;
          height: 3.5rem;
          background: #4f46e5;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        p {
          color: #64748b;
          font-size: 0.95rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        input {
          padding: 0.85rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 1rem;
          transition: all 0.2s;
          outline: none;
        }

        input:focus {
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .medium-toggle-auth {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.3rem;
          border-radius: 1rem;
        }

        .m-btn {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m-btn.active {
          background: white;
          color: #4f46e5;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .login-btn {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 0.75rem;
          border: none;
          background: #4f46e5;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }

        .login-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(79, 70, 229, 0.3);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .error-message {
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #b91c1c;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          text-align: center;
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: #64748b;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #4f46e5;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          margin-left: 0.25rem;
        }

        .toggle-btn:hover {
          text-decoration: underline;
        }

        .animate-fade {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
