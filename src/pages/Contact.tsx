import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import GlowBg from '../components/GlowBg';
import { Mail, Send, Github, Linkedin, Twitter, MessageSquare, AlertCircle } from 'lucide-react';

export default function Contact() {
  const { trackPageView, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    trackPageView();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setError('Please fill in name, contact email, and message lines.');
      showToast('Validation failed.', 'error');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email format.');
      showToast('E-mail verification failed.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('Your message has been received! Guru has been notified.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Server error during submission.');
      }
    } catch (err) {
      setError('Network connection error.');
      showToast('API post failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-12">
          <span className="text-blue-500 font-mono text-xs font-bold tracking-widest uppercase mb-1">
            NETWORK INITIATION
          </span>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Initiate Correspondence</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Drop a message to organize an interview screen, discuss projects integration, or request placement consultation. Better call Guru!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form details block */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass border border-white/5 p-6 sm:p-8 rounded-2xl space-y-5">
              
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center space-x-2">
                  <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g. Sarah Parker"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E.g. s.parker@google.com"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 font-sans"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="E.g. Internship Interview Arrangement Schedule"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell me about your placement sprint, hiring parameters, or feedback description..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 font-sans resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full cursor-pointer py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-transform duration-200 hover:scale-[1.01]"
              >
                {submitting ? (
                  <span className="animate-pulse">Delivering to database node...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Deliver Correspondence Securely</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Quick connections sidebar channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-2">Direct Liaison</h3>
              <div className="space-y-4 font-mono text-xs">
                
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="p-2 rounded bg-slate-950 border border-white/5"><Mail className="h-4 w-4 text-purple-400" /></div>
                  <div>
                    <div className="text-slate-500 text-[9px] uppercase">Corporate Email</div>
                    <a href="mailto:rguru160706@gmail.com" className="text-blue-400 hover:underline">rguru160706@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="p-2 rounded bg-slate-950 border border-white/5"><MessageSquare className="h-4 w-4 text-cyan-400" /></div>
                  <div>
                    <div className="text-slate-500 text-[9px] uppercase">Direct Dispatch Channel</div>
                    <span className="text-slate-200 font-bold">@gururengarajan (Discord/Slack)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Network anchors block */}
            <div className="glass border border-white/5 p-6 rounded-2xl space-y-3 font-mono text-xs">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Social Channels</h3>
              <p className="text-slate-500 text-[10px] leading-relaxed mb-4">Feel free to connect on external dev channels for real-time activity metrics.</p>
              
              <div className="flex flex-col space-y-2">
                <a href="https://github.com/gururengarajan" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-white pb-2 border-b border-white/5">
                  <Github className="h-4 w-4 text-purple-400" />
                  <span>github.com/gururengarajan</span>
                </a>
                <a href="https://linkedin.com/in/gururengarajan" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 pb-2 border-b border-white/5">
                  <Linkedin className="h-4 w-4 text-blue-400" />
                  <span>linkedin.com/in/gururengarajan</span>
                </a>
                <a href="https://twitter.com/gururengarajan" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400">
                  <Twitter className="h-4 w-4 text-cyan-400" />
                  <span>twitter.com/gururengarajan</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
