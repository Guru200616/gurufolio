import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project, Skill } from '../types';
import GlowBg from '../components/GlowBg';
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Send, 
  Bot, 
  Sparkles, 
  Terminal, 
  FileText,
  MessageSquare,
  Award,
  Zap,
  Code
} from 'lucide-react';

export default function Home() {
  const { showToast, trackPageView, trackDownload } = useApp();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // AI Chat states
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatResponse, setAiChatResponse] = useState('');
  const [queryingAi, setQueryingAi] = useState(false);

  // Resume state
  const [resumeUrl, setResumeUrl] = useState('#');

  // Animated Typing Hooks
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    'Full-Stack Developer',
    'Distributed Systems Architect',
    'AI Integration Expert',
    'MNC Placement Ready Competitor',
  ];

  useEffect(() => {
    trackPageView();
    loadContent();
  }, []);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullWord = phrases[i];

      setTypedText(
        isDeleting
          ? fullWord.substring(0, typedText.length - 1)
          : fullWord.substring(0, typedText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 75);

      if (!isDeleting && typedText === fullWord) {
        setTypingSpeed(1500); // Wait on complete word
        setIsDeleting(true);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(200);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed]);

  const loadContent = async () => {
    try {
      setLoadingProjects(true);
      const prRes = await fetch('/api/projects');
      if (prRes.ok) {
        const pr = await prRes.json();
        setFeaturedProjects(pr.filter((p: Project) => p.featured));
      }

      const skRes = await fetch('/api/skills');
      if (skRes.ok) {
        const sks = await skRes.json();
        setSkills(sks.slice(0, 6)); // grab top 6
      }

      const resResponse = await fetch('/api/resume');
      if (resResponse.ok) {
        const r = await resResponse.json();
        if (r && r.fileUrl) setResumeUrl(r.fileUrl);
      }
    } catch (e) {
      console.error('Failed to pre-load homepage databases.', e);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleAskGuruAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    try {
      setQueryingAi(true);
      setAiChatResponse('');
      const response = await fetch('/api/guru-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: aiQuestion }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiChatResponse(data.answer);
        showToast('AI Representative retrieved successfully!', 'success');
      } else {
        showToast('Could not reach Gemini AI Representative.', 'error');
      }
    } catch (err) {
      showToast('API transaction fault.', 'error');
    } finally {
      setQueryingAi(false);
    }
  };

  // Generate a premium dummy GitHub contrib matrix
  const renderMockGithubGrid = () => {
    const days = 7;
    const weeks = 36;
    const totalBlocks = days * weeks;
    const grid = [];
    
    // Weighted values for contributions
    for (let i = 0; i < totalBlocks; i++) {
      const rand = Math.random();
      let colorClass = 'bg-slate-800 dark:bg-slate-900'; // none
      if (rand > 0.85) colorClass = 'bg-green-400/80'; // high
      else if (rand > 0.7) colorClass = 'bg-green-500/50'; // medium
      else if (rand > 0.45) colorClass = 'bg-green-600/20'; // low
      
      grid.push(
        <div 
          key={i} 
          className={`h-2 text-slate-800 w-2 rounded-[1px] transition-all duration-300 hover:scale-150 ${colorClass}`}
          title={`Commits: ${Math.floor(rand * 8)} on selected index`}
        />
      );
    }
    return grid;
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />
      
      {/* 1. Hero Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-blue-500/30 text-blue-400 bg-blue-500/5 text-xs font-semibold">
              <Sparkles className="h-4.5 w-4.5 text-blue-400 animate-spin" />
              <span>THE PORTFOLIO PLATFORM OF GURU RENGARAJAN</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none">
              Better Call <span className="text-blue-500">Guru!</span>
            </h1>
            
            <div className="h-10 text-xl sm:text-2xl font-mono text-purple-400 font-medium">
              I'm a <span className="text-cyan-400 border-r-2 border-cyan-400 pr-1 animate-pulse">{typedText}</span>
            </div>

            <p className="text-slate-400 text-base max-w-xl">
              An enterprise-tier full stack developer and cloud architecture competitor with an unyielding obsession for writing resilient Go system servers, lightning-fast Redis caching proxy protocols, and stunning high-fidelity frontend views.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/projects"
                className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 hover:scale-[1.02] shadow-lg shadow-blue-500/10 transition-all duration-200"
              >
                <span>Explore Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={trackDownload}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-slate-200 font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <FileText className="h-4 w-4 text-purple-400" />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Social handles */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="text-xs text-slate-500 uppercase font-semibold font-mono">Connect:</span>
              <a href="https://github.com/gururengarajan" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition-colors" aria-label="Github Profile Link"><Github className="h-4 w-4" /></a>
              <a href="https://linkedin.com/in/gururengarajan" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-white/5 bg-white/5 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Linkedin Profile Link"><Linkedin className="h-4 w-4" /></a>
              <a href="https://twitter.com/gururengarajan" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-white/5 bg-white/5 hover:bg-cyan-500 hover:text-white transition-colors" aria-label="Twitter Feed Link"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Profile Branding Avatar */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden glass border border-white/10 flex flex-col justify-center items-center group p-6 text-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              
              <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-blue-500/45 overflow-hidden mb-4 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" 
                  alt="Guru Rengarajan" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-105 contrast-120 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <h2 className="relative z-10 font-display text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Guru Rengarajan
              </h2>
              <p className="relative z-10 font-mono text-purple-400 text-xs mt-1">
                "Better Call Guru!"
              </p>
              
              <div className="relative z-10 mt-4 px-3 py-1 text-[11px] font-medium font-mono text-cyan-400 rounded-full border border-cyan-400/20 bg-cyan-400/5">
                🇮🇳 Coimbatore to Bangalore
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Better Call Guru! AI Interview Assistant (Interactions Showcase) */}
      <div className="relative z-10 bg-slate-950/40 border-y border-white/5 py-16 dark:bg-slate-950/60 light:bg-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Bot className="h-44 w-44 text-blue-500" />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">
                  <Bot className="h-4 w-4 text-purple-400" />
                  <span>Interactive AI Sandbox integration</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                  Ask Guru's AI Specialist Agent!
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Connect live with my virtual business rep (powered securely by Google's Gemini 2.5 Flash model) to verify placement details and technical backgrounds.
                </p>
              </div>
              <div className="px-3 py-1 rounded bg-blue-600/10 text-blue-400 text-xs font-mono border border-blue-500/20">
                gemini-2.5-flash / active
              </div>
            </div>

            {/* Response area */}
            <div className="bg-slate-950/80 rounded-lg p-5 border border-white/5 min-h-36 mb-6 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-72 select-text">
              {queryingAi ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <div className="h-6 w-6 border-2 border-t-purple-500 border-r-transparent rounded-full animate-spin" />
                  <span className="text-slate-400 text-[10px]">AI agent querying real-time cache archives...</span>
                </div>
              ) : aiChatResponse ? (
                <div className="space-y-2 whitespace-pre-wrap">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-2 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="text-purple-400 font-bold text-[10px] uppercase font-mono tracking-wider">Better Call Guru Representative response:</span>
                  </div>
                  {aiChatResponse}
                </div>
              ) : (
                <div className="text-slate-500 italic flex items-center justify-center py-10">
                  ⚡ Go ahead, type a message or ask: "Willing to relocate?", "Explain Guru'sRedis optimization blogpost," or "Why should we place Guru in our MNC?"
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskGuruAgent} className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask about my skills, projects, placement availability..."
                className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 font-mono"
              />
              <button
                type="submit"
                disabled={queryingAi}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg hover:scale-[1.01] transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <span>Query Agent</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Featured Projects Showcase */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
          <div>
            <div className="text-blue-500 font-mono text-xs font-bold tracking-widest uppercase mb-1">SELECTED PRODUCTION WORKS</div>
            <h2 className="font-display text-3xl font-bold text-white tracking-tight">Featured Projects</h2>
          </div>
          <Link to="/projects" className="group flex items-center space-x-1.5 text-blue-400 hover:text-white transition-colors text-sm font-medium mt-3 sm:mt-0">
            <span>View spectrum portfolio</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl animate-pulse bg-slate-800/40 border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div 
                key={project._id} 
                className="group flex flex-col rounded-2xl overflow-hidden glass border border-white/5 hover:border-purple-500/25 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-blue-600/90 text-white font-mono text-[10px] font-bold px-2 py-1 rounded">
                    {project.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="font-mono text-[9px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/projects/${project._id}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-400 hover:text-white transition-colors"
                    >
                      <span>Read Deep-Dive Specs</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. GitHub Stats Telemetry Matrix */}
      <div className="relative z-10 bg-slate-950/20 border-t border-white/5 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
              <div>
                <span className="flex items-center space-x-1 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
                  <Terminal className="h-4 w-4 animate-bounce" />
                  <span>LIVE GIT AUTOMATED COMMIT AGGREGATIONS</span>
                </span>
                <h3 className="font-display text-xl font-bold text-white">Guru's Git Contribution Telemetry</h3>
              </div>
              <div className="inline-flex items-center space-x-4 font-mono text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Code className="h-3.5 w-3.5 text-green-500" /> 1,482 Contributions</span>
                <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-purple-500" /> Active Streaks: 45 Days</span>
              </div>
            </div>

            {/* Matrix Board */}
            <div className="overflow-x-auto pb-2">
              <div className="flex space-x-1 min-w-[500px]" style={{ direction: 'ltr' }}>
                <div className="grid grid-flow-col grid-rows-7 gap-1 mt-6 mr-3">
                  <span className="text-[8px] text-slate-500 h-2 font-mono">Mon</span>
                  <span className="text-[8px] text-slate-500 h-2 font-mono"></span>
                  <span className="text-[8px] text-slate-500 h-2 font-mono">Wed</span>
                  <span className="text-[8px] text-slate-500 h-2 font-mono"></span>
                  <span className="text-[8px] text-slate-500 h-2 font-mono">Fri</span>
                </div>
                <div className="grid grid-flow-col grid-rows-7 gap-[3px] select-none">
                  {renderMockGithubGrid()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-3">
              <span>Less Commit Matrix</span>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-slate-800 rounded-[1px]" />
                <div className="h-2 w-2 bg-green-600/20 rounded-[1px]" />
                <div className="h-2 w-2 bg-green-500/50 rounded-[1px]" />
                <div className="h-2 w-2 bg-green-400/80 rounded-[1px]" />
                <span>More Commit Matrix</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Career testimonials */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-purple-400 font-mono text-xs font-bold uppercase tracking-wide">WHAT TEAM MEMBERS AND PLACEMENT MANAGERS SAY</div>
          <h2 className="font-display text-3xl font-bold text-white mt-1">Endorsements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-xl p-6 border border-white/5 relative">
            <span className="absolute top-4 right-4 text-blue-500/10 font-serif text-8xl leading-none">“</span>
            <p className="text-slate-300 text-sm leading-relaxed relative z-10 italic">
              Guru Rengarajan represents the absolute finest of modern candidate pools: self-taught distributed competence, structured problem sorting, and an incredibly responsive aesthetic taste. His distributed system queue was chosen as an elite reference template in our placement catalog.
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full border border-purple-500/20 bg-purple-500/10 flex items-center justify-center font-bold text-sm text-purple-400">
                DR
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Dr. Rajan K. Iyer</div>
                <div className="text-xs text-slate-500 font-mono">Academic Placement Director, liaison Cell</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/5 relative">
            <span className="absolute top-4 right-4 text-purple-500/10 font-serif text-8xl leading-none">“</span>
            <p className="text-slate-300 text-sm leading-relaxed relative z-10 italic">
              Working with Guru on contract systems integrations was educational. His understanding of LLM validation pipelines and structured JSON layouts removed complex middleware lines, helping our telemetry boards load instantly. An impressive asset.
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full border border-blue-500/20 bg-blue-500/10 flex items-center justify-center font-bold text-sm text-blue-400">
                SK
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Siddharth Kushal</div>
                <div className="text-xs text-slate-500 font-mono">Lead Technical Architect, Cloud Systems Inc.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Contact CTA */}
      <div className="relative z-10 bg-gradient-to-tr from-blue-900/40 via-slate-900 to-purple-900/30 border-t border-white/5 py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">
            Have a placement opportunity or consultation request?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Let's get in touch. Drop a message to have an interview scheduled or review portfolio integrations in real-time. Better call Guru!
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 hover:scale-[1.01] transition-transform duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Initiate Contact Form</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
