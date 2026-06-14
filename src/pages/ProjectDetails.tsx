import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import GlowBg from '../components/GlowBg';
import { ArrowLeft, Github, ExternalLink, ShieldCheck, Cpu, Layout, FileCode } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { trackPageView } = useApp();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    } catch (e) {
      console.warn('Trace project parse mismatch.', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 border-2 border-t-purple-500 border-r-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-xs font-mono">Retuning database schemas...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="relative min-h-screen bg-slate-900 text-slate-100 py-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Project Specs Not Resolved</h2>
          <p className="text-xs text-slate-500 max-w-sm">The target project identifier does not register on our active cloud servers.</p>
          <Link to="/projects" className="inline-block px-4 py-2 bg-blue-600 text-white rounded text-xs font-mono">
            Return to codes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/projects" className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>BACK TO CODE REPOSITORIES</span>
        </Link>

        {/* Hero image showcase banner */}
        <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden glass border border-white/10 mb-10 relative">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-blue-600 text-white font-mono text-[9px] font-bold px-2 py-1 rounded inline-block mb-2">
              {project.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main content body specs */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">PROJECT BRIEF</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{project.description}</p>
            </div>

            {project.detailedDescription && (
              <div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">ARCHITECTURAL LOGS & CHALLENGES</h2>
                <div className="text-slate-400 text-xs leading-relaxed space-y-3 whitespace-pre-line bg-slate-950/40 p-4 border border-white/5 rounded-xl font-sans">
                  {project.detailedDescription}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Specifications */}
          <div className="glass border border-white/5 p-5 rounded-xl space-y-6">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-slate-500 mb-3 tracking-wider">TECHNOLOGY SPEC</h3>
              <div className="flex flex-wrap gap-1.5Packed">
                {project.technologies.map((t) => (
                  <span key={t} className="font-mono text-[10px] text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-white/5 font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2.5">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-slate-200 hover:text-white transition-colors text-xs font-medium border border-white/5"
                >
                  <Github className="h-4 w-4 text-purple-400" />
                  <span>Inspect Github Code</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-xs"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Launch Production Demo</span>
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 font-mono text-[10px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Record Index</span>
                <span>{project._id}</span>
              </div>
              <div className="flex justify-between">
                <span>Created At</span>
                <span>{project.createdAt.substring(0, 10)}</span>
              </div>
              <div className="flex justify-between items-center text-cyan-400">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Fully verified</span>
                <span>MNC-ready</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
