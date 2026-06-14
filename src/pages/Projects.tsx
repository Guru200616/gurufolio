import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import GlowBg from '../components/GlowBg';
import { Search, ArrowRight, ShieldAlert, Star } from 'lucide-react';

export default function Projects() {
  const { trackPageView } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  useEffect(() => {
    trackPageView();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.warn('Could not read projects data.', e);
    } finally {
      setLoading(false);
    }
  };

  // Derive active categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = proj.title.toLowerCase().includes(search.toLowerCase()) || 
                          proj.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCat === 'All' || proj.category === selectedCat;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-blue-500 font-mono text-xs font-bold tracking-widest uppercase mb-1">
              ENGINEER SHOWCASE
            </span>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">Code Repositories</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              An index of active legal products, microservice orchestration workers, and AI agents built for MNC standards.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by keyword, tool, or context..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 font-mono"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Tab category filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-800/40 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-xl bg-slate-950/20 max-w-xl mx-auto">
            <ShieldAlert className="h-10 w-10 text-slate-500 mx-auto mb-3 animate-bounce" />
            <span className="text-sm text-slate-400 font-medium block">No matching code cases published yet.</span>
            <span className="text-xs text-slate-600 block mt-1 font-mono">Try adjusting your filters or query strings.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj._id}
                className="group flex flex-col rounded-2xl overflow-hidden glass border border-white/5 hover:border-purple-500/25 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative bg-slate-950">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600/90 text-white font-mono text-[9px] font-bold px-2 py-1 rounded">
                    {proj.category}
                  </div>
                  {proj.featured && (
                    <div className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 font-mono text-[9px] font-bold px-2 py-1 rounded flex items-center space-x-1">
                      <Star className="h-2.5 w-2.5 fill-slate-950" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.technologies.map((tech) => (
                        <span key={tech} className="font-mono text-[8px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/projects/${proj._id}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-400 hover:text-white transition-colors"
                    >
                      <span>Read Deep-Dive Specs</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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
