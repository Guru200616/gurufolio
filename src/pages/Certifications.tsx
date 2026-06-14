import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Certification } from '../types';
import GlowBg from '../components/GlowBg';
import { Award, Briefcase, Calendar, ShieldCheck, ChevronRight, GraduationCap } from 'lucide-react';

export default function Certifications() {
  const { trackPageView } = useApp();
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/certificates');
      if (res.ok) {
        const data = await res.json();
        setCerts(data);
      }
    } catch (e) {
      console.warn('Trace certification query mismatch.', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-12">
          <span className="text-purple-400 font-mono text-xs font-bold tracking-widest uppercase mb-1">
            QUALIFICATION AUDITS
          </span>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Credentials & Certifications</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Verified academic badges and industry certifications matching cloud engineering patterns.
          </p>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-32 rounded-xl bg-slate-800/40 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : certs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-xl bg-slate-950/20 max-w-lg mx-auto">
            <Award className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <span className="text-sm text-slate-400 font-medium block">Credentials catalogue currently loading.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((cert) => (
              <div
                key={cert._id}
                className="group relative glass rounded-xl p-6 border border-white/5 hover:border-purple-600/20 transition-all duration-300 flex items-start space-x-4 overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                <div className="p-3 bg-slate-950 rounded-lg flex-shrink-0 border border-white/5 group-hover:border-purple-500/25 transition-colors">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-blue-400 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                      <span>{cert.issuer}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Issued {cert.issueDate}</span>
                    </span>

                    {cert.certificateUrl && cert.certificateUrl !== '#' && (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-[10px] font-mono text-purple-400 hover:text-white transition-colors uppercase tracking-widest font-bold"
                      >
                        <span>verify badge</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
