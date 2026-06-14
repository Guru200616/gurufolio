import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Skill } from '../types';
import GlowBg from '../components/GlowBg';
import { Search, Server, Monitor, Database, Terminal, ShieldAlert } from 'lucide-react';

export default function Skills() {
  const { trackPageView } = useApp();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Frontend' | 'Backend' | 'Database' | 'DevOps'>('All');

  useEffect(() => {
    trackPageView();
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (e) {
      console.warn('Could not read skills Database info.', e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps'];

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeTab === 'All' || skill.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Frontend':
        return <Monitor className="h-4 w-4 text-cyan-400" />;
      case 'Backend':
        return <Server className="h-4 w-4 text-purple-400" />;
      case 'Database':
        return <Database className="h-4 w-4 text-blue-400" />;
      default:
        return <Terminal className="h-4 w-4 text-green-400" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase mb-1">
              ENGINEERING MATRIX
            </span>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Skills Spectrum
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-md">
              A detailed quantitative look at my technological competence across various segments of distributed engineering.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search specific stack element..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 font-mono"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                activeTab === cat
                  ? 'bg-blue-600 text-white border border-blue-500/10 shadow-lg'
                  : 'text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading / Empty / Skills display Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-24 rounded-xl bg-slate-800/40 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-xl bg-slate-950/20 max-w-xl mx-auto">
            <ShieldAlert className="h-10 w-10 text-slate-500 mx-auto mb-3 animate-bounce" />
            <span className="text-sm text-slate-400 font-medium block">No matching tech specifications loaded.</span>
            <span className="text-xs text-slate-600 block mt-1 font-mono">Try adjusting your filters or search query keys.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                className="glass rounded-xl p-5 border border-white/5 hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded bg-slate-950">{getCategoryIcon(skill.category)}</span>
                    <h3 className="text-sm font-bold text-white tracking-wide">{skill.name}</h3>
                  </div>
                  <span className="font-mono text-[10px] text-blue-400 font-semibold">{skill.proficiency}%</span>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono mt-1 pt-1.5">
                  <span>Scope: {skill.category} Standard</span>
                  <span>Competent rating</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
