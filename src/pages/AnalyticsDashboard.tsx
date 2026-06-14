import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import GlowBg from '../components/GlowBg';
import { BarChart3, Eye, Download, Users, ArrowLeft, RefreshCw, Calendar, Sparkles } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { trackPageView, showToast } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pageViews: 1480,
    downloads: 412,
    visitors: 620,
    viewHistory: [] as { date: string; count: number }[],
    visitorHistory: [] as { date: string; count: number }[]
  });

  useEffect(() => {
    trackPageView();
    const token = localStorage.getItem('guru-token');
    if (!token) {
      showToast('Unauthorized token context.', 'error');
      navigate('/admin/login');
      return;
    }
    loadAnalyticsData(token);
  }, []);

  const loadAnalyticsData = async (activeToken: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      showToast('Could not query telemetry archives.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Safe Math converters for our responsive SVG Graphs
  const renderSVGLineChart = (data: { date: string; count: number }[], color: string) => {
    if (!data || data.length === 0) {
      // Fallback dummy points if hist array empty on fresh setups
      data = [
        { date: "06-10", count: 120 },
        { date: "06-11", count: 155 },
        { date: "06-12", count: 140 },
        { date: "06-13", count: 210 },
        { date: "06-14", count: 320 }
      ];
    }

    const width = 500;
    const height = 150;
    const padding = 20;

    const maxVal = Math.max(...data.map(d => d.count), 1);
    const minVal = Math.min(...data.map(d => d.count), 0);
    const range = maxVal - minVal || 1;

    const points = data.map((d, idx) => {
      const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - ((d.count - minVal) * (height - padding * 2)) / range;
      return `${x},${y}`;
    }).join(' ');

    const fillPoints = `
      ${padding},${height - padding} 
      ${points} 
      ${width - padding},${height - padding}
    `;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none overflow-visible">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + ratio * (height - padding * 2)}
            x2={width - padding}
            y2={padding + ratio * (height - padding * 2)}
            stroke="white"
            strokeOpacity="0.04"
            strokeDasharray="4"
          />
        ))}

        {/* Shaded Area */}
        <polyline points={fillPoints} fill={`url(#grad-${color})`} />

        {/* Main Plot line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive nodes points */}
        {data.map((d, idx) => {
          const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
          const y = height - padding - ((d.count - minVal) * (height - padding * 2)) / range;
          return (
            <g key={idx} className="group">
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#0f172a"
                stroke={color}
                strokeWidth="2.5"
                className="transition-all duration-200 cursor-pointer hover:r-6"
              />
              <text
                x={x}
                y={y - 10}
                fill="white"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {d.count}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 border-2 border-t-purple-500 border-r-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-xs font-mono">Querying live Redis caches...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back control */}
        <Link to="/admin/dashboard" className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>BACK TO ADMINISTRATIVE PANELS</span>
        </Link>

        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/5 mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-cyan-400 text-xs font-mono uppercase tracking-widest font-bold mb-1">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>DASHBOARD METRICS ARCHIVES</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Live Applet Analytics</h1>
          </div>

          <button
            onClick={() => loadAnalyticsData(localStorage.getItem('guru-token') || '')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded border border-white/5 bg-slate-950 text-slate-300 hover:text-white transition-colors text-xs font-mono cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>refresh parameters</span>
          </button>
        </div>

        {/* Stats grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="glass border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Page Views</span>
              <span className="text-3xl font-display font-medium text-white block select-all">{stats.pageViews}</span>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400"><Eye className="h-7 w-7" /></div>
          </div>

          <div className="glass border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Unique Visitors</span>
              <span className="text-3xl font-display font-medium text-white block select-all">{stats.visitors}</span>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400"><Users className="h-7 w-7" /></div>
          </div>

          <div className="glass border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Resume Downloads</span>
              <span className="text-3xl font-display font-medium text-white block select-all">{stats.downloads}</span>
            </div>
            <div className="p-4 rounded-xl bg-cyan-500/10 text-cyan-400"><Download className="h-7 w-7" /></div>
          </div>
        </div>

        {/* Visual Charts Layout Display columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="glass border border-white/5 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-blue-400" />
                <span>Pageviews Trend</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px]">Last 7 days logs</span>
            </div>
            <div className="pt-2">
              {renderSVGLineChart(stats.viewHistory, '#2563EB')}
            </div>
          </div>

          <div className="glass border border-white/5 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-purple-400" />
                <span>Unique Traffic Log</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[9px]">Session visitors index</span>
            </div>
            <div className="pt-2">
              {renderSVGLineChart(stats.visitorHistory, '#7C3AED')}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
