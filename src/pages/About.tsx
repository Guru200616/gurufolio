import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import GlowBg from '../components/GlowBg';
import { Award, BookOpen, Heart, GraduationCap, Server, Target } from 'lucide-react';

export default function About() {
  const { trackPageView } = useApp();

  useEffect(() => {
    trackPageView();
  }, []);

  const timeline = [
    {
      year: '2023 - 2027',
      institution: 'PSG College of Technology',
      degree: 'B.E. Computer Science and Engineering',
      description: 'Focusing on database engines, distributed networks, and compiler design. Graduating with a high GPA in core algorithm parameters.',
    },
    {
      year: '2021 - 2023',
      institution: 'Bharathi Premium Senior Secondary',
      degree: 'Higher Secondary Certificate (HSC)',
      description: 'Major: Pure Mathematics, Computer Science, and Physics. Scored 96% aggregate with top-tier honors in technology projects.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-12">
          <span className="text-blue-500 font-mono text-xs font-bold tracking-widest uppercase mb-1">BIOGRAPHICAL RECALL</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">About Guru Rengarajan</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            A developer who constructs modern servers, resolves runtime bottleneck queues, and designs intuitive interactive dashboards.
          </p>
        </div>

        {/* Narrative & Photo Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start">
          <div className="lg:col-span-7 space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
            <h2 className="text-xl font-display font-semibold text-white">"Better Call Guru!"</h2>
            <p>
              Hi recruiter! I'm Guru. My journey into programming commenced with tuning local terminal scripts, but it rapidly shifted into an all-consuming passion for enterprise-architected services. Today, I build full-stack interfaces, write lightning-fast memory caches using Redis, and train custom Gemini generative assistance assistants.
            </p>
            <p>
              Currently studying Computer Science and Engineering, I aim to merge high-performance server routines with beautiful user experiences. I seek opportunities to make an immediate impact at a fast-paced product company or progressive MNC.
            </p>
            <p>
              Whenever I am not coding, you can find me reviewing technical documentation on emerging RFC parameters, composing developer tutorials, or playing action strategy simulators.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="border border-white/5 bg-white/5 rounded-lg p-4">
                <Target className="h-5 w-5 text-purple-400 mb-2" />
                <h3 className="text-xs font-bold text-white uppercase font-mono">Immediate Target</h3>
                <p className="text-[11px] text-slate-400 mt-1">Summer Internship & MNC placements</p>
              </div>
              <div className="border border-white/5 bg-white/5 rounded-lg p-4">
                <Server className="h-5 w-5 text-blue-400 mb-2" />
                <h3 className="text-xs font-bold text-white uppercase font-mono">Core Focus</h3>
                <p className="text-[11px] text-slate-400 mt-1">Distributed Queues, Microservices & AI APIs</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 border border-white/10 p-5 rounded-2xl glass">
            <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase mb-4 text-center">Quick Profile Brief</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Full Name</span>
                <span className="text-slate-200">Guru Rengarajan</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Degree</span>
                <span className="text-slate-200">B.E. CSE</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Location</span>
                <span className="text-slate-200">Bangalore, India</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Target Segment</span>
                <span className="text-slate-200 font-bold text-cyan-400">Enterprise MNCs</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">E-mail</span>
                <span className="text-blue-400 text-[11px]">rguru160706@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timothy / Educational timeline */}
        <div className="border-t border-white/5 pt-12">
          <h2 className="font-display text-2xl font-bold text-white mb-8 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            <span>Educational Milestones</span>
          </h2>

          <div className="space-y-8 relative before:absolute before:inset-0 before:right-auto before:left-3.5 before:w-0.5 before:bg-white/5">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative pl-10 group">
                {/* Marker bullet */}
                <div className="absolute left-1.5 top-1 h-4.5 w-4.5 rounded-full border-4 border-slate-900 bg-blue-500 ring-2 ring-blue-500/10 group-hover:bg-purple-500 group-hover:ring-purple-500/20 transition-all duration-300" />
                
                <div className="glass rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs text-purple-400 font-semibold">{item.year}</span>
                    <h3 className="text-md font-bold text-white">{item.degree}</h3>
                  </div>
                  <h4 className="text-xs font-mono text-slate-400 font-medium mb-2">{item.institution}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
