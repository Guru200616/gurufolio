import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Blog } from '../types';
import GlowBg from '../components/GlowBg';
import { Search, Calendar, Tag, ShieldAlert, Library } from 'lucide-react';

export default function BlogPage() {
  const { trackPageView } = useApp();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    trackPageView();
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (e) {
      console.warn('Trace blog load anomaly.', e);
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique tags
  const rawTags: string[] = [];
  blogs.forEach((b) => {
    if (b && Array.isArray(b.tags)) {
      b.tags.forEach((tag) => {
        if (typeof tag === 'string') {
          rawTags.push(tag);
        }
      });
    }
  });
  const uniqueTags = Array.from(new Set(rawTags));
  const tagsList: string[] = ['All', ...uniqueTags];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                          blog.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === 'All' || blog.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-purple-400 font-mono text-xs font-bold tracking-widest uppercase mb-1">
              ENGINEER JOURNAL
            </span>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">Technical Publications</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Analyzing model integrations, distributed cache invalidations, and system scaling paradigms.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search publications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 font-mono"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-1.5 mb-10 pb-4 border-b border-white/5">
          {tagsList.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-medium tracking-wider transition-colors duration-200 cursor-pointer ${
                selectedTag === t
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950 border border-transparent'
              }`}
            >
              #{t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* List items */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-800/40 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-xl bg-slate-950/20 max-w-xl mx-auto">
            <Library className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <span className="text-sm text-slate-400 font-semibold block">Journal archives empty.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group flex flex-col md:flex-row glass border border-white/5 rounded-2xl hover:border-purple-500/25 overflow-hidden transition-all duration-300"
              >
                {/* Thumbnail card */}
                <div className="w-full md:w-44 h-44 md:h-full overflow-hidden relative bg-slate-950 flex-shrink-0">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Text blocks content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-purple-400 flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{blog.publishedAt.substring(0, 10)}</span>
                    </span>
                    <h2 className="font-display text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed font-sans">
                      {blog.content.replace(/[#*`]/g, '')}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[8px] text-slate-500 bg-slate-850 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="ml-auto font-mono text-[10px] text-purple-400 hover:text-white transition-colors uppercase tracking-wider font-bold"
                    >
                      Read post
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
