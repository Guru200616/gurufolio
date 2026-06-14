import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import GlowBg from '../components/GlowBg';
import { ShieldAlert, LogIn, Lock, Mail, Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const { trackPageView, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    trackPageView();
    // Redirect early if session token already active
    const existToken = localStorage.getItem('guru-token');
    if (existToken) {
      navigate('/admin/dashboard');
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('guru-token', data.token);
        localStorage.setItem('guru-user', JSON.stringify(data.user));
        
        showToast('Authorized. Welcome to Admin Workspace, Guru.', 'success');
        navigate('/admin/dashboard');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Authorization process rejected credentials.');
        showToast('Access denied.', 'error');
      }
    } catch (err) {
      setError('Server database sync error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillCredentials = () => {
    setEmail('rguru160706@gmail.com');
    setPassword('guruadmin123');
    showToast('Credentials filled. Click login!', 'info');
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4 py-16 transition-colors duration-300 dark:bg-slate-950 light:bg-slate-50">
      <GlowBg />

      <div className="relative z-10 w-full max-w-sm">
        
        <form onSubmit={handleLoginSubmit} className="glass border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6 bg-slate-950/60 shadow-2xl">
          
          <div className="text-center space-y-1">
            <h1 className="font-display text-xl font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
              <Lock className="h-5 w-5 text-purple-400" />
              <span>Admin Gateway</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">authorized personnel only</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center space-x-1.5">
              <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[9px] font-mono font-bold uppercase text-slate-500">Admin Email Account</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin-account@email.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                  required
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[9px] font-mono font-bold uppercase text-slate-500">Security Phrase</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                  required
                />
                <Lock className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-transform duration-100 hover:scale-[1.01]"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? 'Authenticating Gateways...' : 'Access Admin Workspace'}</span>
          </button>

          {/* Tester Helper Block - incredibly practical */}
          <div className="border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={handleQuickFillCredentials}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/25 transition-colors text-left font-mono"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] text-purple-400 font-bold block flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-purple-400 animate-spin" />
                  <span>Recruiter/Tester Access Pass</span>
                </span>
                <span className="text-[9px] text-slate-400 block font-sans">Click to quick-fill credentials & log in.</span>
              </div>
              <ArrowUpRight strokeWidth={2.5} className="h-4 w-4 text-purple-400" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Inline ArrowUpRight icon helper since we only need it here
function ArrowUpRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
  );
}
