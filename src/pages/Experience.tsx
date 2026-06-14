import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Experience } from '../types';
import GlowBg from '../components/GlowBg';
import { Briefcase, Calendar, MapPin, CheckCircle2, Award } from 'lucide-react';

export default function ExperiencePage() {
  const { trackPageView } = useApp();
  const [exps, setExps] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/experiences');
      if (res.ok) {
        const data = await res.json();
        setExps(data);
      }
    } catch (e) {
      console.warn('Trace experiences fetch anomaly.', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-12">
          <span className="text-blue-500 font-mono text-xs font-bold tracking-widest uppercase mb-1">
            CAREER PATHWAYS
          </span>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Professional Experience</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Internships, consultancy liaison periods, and structured administrative roles supporting MNC engineering goals.
          </p>
        </div>

        {/* Timeline body */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 rounded-xl bg-slate-800/40 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : exps.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-xl bg-slate-950/20 max-w-lg mx-auto">
            <Briefcase className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <span className="text-sm text-slate-400 block font-semibold">Career milestone repository empty.</span>
          </div>
        ) : (
          <div className="space-y-12 relative before:absolute before:inset-0 before:right-auto before:left-3.5 before:w-0.5 before:bg-white/5">
            {exps.map((exp, idx) => (
              <div key={exp._id} className="relative pl-10 group">
                {/* Node Bullet */}
                <div className="absolute left-1.5 top-1.5 h-4 w-4 rounded-full border-4 border-slate-900 bg-purple-500 group-hover:bg-blue-400 group-hover:scale-125 transition-transform duration-300" />

                <div className="glass rounded-xl p-6 border border-white/5 hover:border-purple-500/10 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-4 mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-wide">{exp.role}</h2>
                      <h3 className="text-xs font-semibold text-blue-400 font-mono mt-1 uppercase tracking-wider">{exp.company}</h3>
                    </div>
                    
                    <div className="space-y-1 text-left sm:text-right font-mono text-[10px] text-slate-500">
                      <div className="flex items-center sm:justify-end gap-1"><Calendar className="h-3 w-3" /> <span>{exp.period}</span></div>
                      <div className="flex items-center sm:justify-end gap-1"><MapPin className="h-3 w-3" /> <span>{exp.location}</span></div>
                    </div>
                  </div>

                  {/* Bullet description highlights */}
                  <ul className="space-y-3">
                    {exp.description.map((line, lIdx) => (
                      <li key={lIdx} className="flex items-start text-xs text-slate-300 leading-relaxed font-sans">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
