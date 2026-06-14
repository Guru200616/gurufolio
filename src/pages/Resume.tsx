import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import GlowBg from '../components/GlowBg';
import { FileText, Download, Eye, Award, ExternalLink, Calendar, GraduationCap } from 'lucide-react';

export default function Resume() {
  const { trackPageView, trackDownload } = useApp();
  const [resumeUrl, setResumeUrl] = useState('#');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        if (data && data.fileUrl) {
          setResumeUrl(data.fileUrl);
        }
      }
    } catch (e) {
      console.warn('Trace resume endpoint load failure.', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTelemetry = () => {
    trackDownload();
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header toolbar stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-6 border-b border-white/5">
          <div>
            <span className="text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase mb-1">
              PORTFOLIO CREDENTIAL SHEET
            </span>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">Interactive Resume</h1>
            <p className="text-sm text-slate-400 mt-1">
              Curriculum vitae designed and structured to target enterprise internship programs and placements.
            </p>
          </div>

          <div>
            <button
              onClick={handleDownloadTelemetry}
              className="inline-flex cursor-pointer items-center space-x-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-transform duration-200 hover:scale-[1.01] shadow-lg shadow-blue-500/10"
            >
              <Download className="h-4 w-4" />
              <span>Download Signed Copy</span>
            </button>
          </div>
        </div>

        {/* Visual HTML Resume - Looks exceptionally premium */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl relative border-t-8 border-blue-600 font-sans tracking-tight">
          
          {/* Header block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">GURU RENGARAJAN</h2>
              <p className="font-mono text-xs text-blue-600 font-bold uppercase tracking-wider mt-1.5Packed">Full-Stack & Distributed Systems Developer</p>
              <p className="text-xs text-slate-500 mt-2">Bangalore, India | rguru160706@gmail.com | better-call-guru.com</p>
            </div>
            
            <div className="mt-4 sm:mt-0 text-left sm:text-right text-xs font-mono text-slate-500 space-y-1">
              <div>PSG College of Tech CSE</div>
              <div>Phone: Target placement secure</div>
              <div className="font-semibold text-blue-600">"Better Call Guru!"</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-700 leading-relaxed">
            
            {/* Sidebar columns components */}
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xs uppercase text-slate-950 border-b border-slate-200 pb-1.5 mb-3">EDUCATION</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1">
                      <GraduationCap className="h-4 w-4 text-slate-600" />
                      <span>PSG College of Technology</span>
                    </h4>
                    <p className="text-slate-500 italic">B.E. Computer Science & Eng.</p>
                    <p className="font-mono text-[10px] text-slate-400">Class of 2027</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1">
                      <GraduationCap className="h-4 w-4 text-slate-600" />
                      <span>Bharathi Senior Secondary</span>
                    </h4>
                    <p className="text-slate-500 italic">HSC (Class XII)</p>
                    <p className="font-mono text-[10px] text-slate-400">Score: 96% | 2023</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase text-slate-950 border-b border-slate-200 pb-1.5 mb-3">CORE COMPETENCE</h3>
                <div className="gap-1 flex flex-wrap">
                  {['React.js', 'TypeScript', 'Node.js', 'Express', 'Golang', 'Docker', 'Redis', 'PostgreSQL', 'MongoDB', 'Yjs CRDTs', 'Gemini AI SDK'].map((tech) => (
                    <span key={tech} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase text-slate-950 border-b border-slate-200 pb-1.5 mb-3">CREDENTIAL BADGES</h3>
                <div className="space-y-2 font-mono text-[10px]">
                  <p className="text-slate-900 font-bold flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-blue-600" />
                    <span>Associate Cloud Engineer (GCP)</span>
                  </p>
                  <p className="text-slate-900 font-bold flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-purple-600" />
                    <span>AWS Certified Dev Associate</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Main content columns components */}
            <div className="md:col-span-2 space-y-6 md:border-l md:border-slate-200 md:pl-6">
              
              <div>
                <h3 className="font-bold text-xs uppercase text-slate-950 border-b border-slate-200 pb-1.5 mb-3">PROFESSIONAL MILESTONES</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>Software Engineering Intern</span>
                      <span className="font-mono text-[10px] text-slate-400">May 2026 - Present</span>
                    </div>
                    <p className="text-blue-600 font-semibold italic text-[11px]">Google AI Studio Labs, Bangalore</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-600 text-[11px]">
                      <li>Co-developed custom REST proxies optimizing connection pipelines for Gemini endpoints.</li>
                      <li>Built and maintained clean responsive layouts aligning with Figma mock specifications.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>Full Stack Consultant</span>
                      <span className="font-mono text-[10px] text-slate-400">Aug 2025 - Apr 2026</span>
                    </div>
                    <p className="text-blue-600 font-semibold italic text-[11px]">MNC Placement Cell Liaison Office, Coimbatore</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-600 text-[11px]">
                      <li>Architected campus enrollment database workflows holding thousands of candidate records.</li>
                      <li>Lowered database search latency for recruiters by 15% using optimized Elasticsearch index pipelines.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase text-slate-950 border-b border-slate-200 pb-1.5 mb-3">KEY PROJECTS</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-950">Better Call Guru! Legal AI Companion</h4>
                    <p className="text-slate-600 text-[11px]">Designed a legal analysis workspace backed by Gemini models. Employs structured response validation.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950">OmniQueue: Distributed System Task Scheduler</h4>
                    <p className="text-slate-600 text-[11px]">An open-source job manager integrating Redis lock schedules, avoiding duplication under heavy peak client loads.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
