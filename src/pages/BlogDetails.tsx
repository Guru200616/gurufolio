import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Blog } from '../types';
import GlowBg from '../components/GlowBg';
import { ArrowLeft, Calendar, User, Share2, CornerDownRight, Bookmark, ArrowUpRight } from 'lucide-react';

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const { trackPageView, showToast } = useApp();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    if (id) {
       loadBlog(id);
    }
  }, [id]);

  const loadBlog = async (slugOrId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blogs/${slugOrId}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
      }
    } catch (e) {
      console.warn('Trace blog details parse fail.', e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Publication link copied to clipboard!', 'success');
  };

  // Safe custom Markdown renderer
  const renderMarkdownContent = (text: string) => {
    const lines = text.split('\n');
    let insideCodeBlock = false;
    let codeContent: string[] = [];
    let codeLang = '';

    return lines.map((line, idx) => {
      // Handle Code Block transitions
      if (line.trim().startsWith('```')) {
        if (!insideCodeBlock) {
          insideCodeBlock = true;
          codeLang = line.replace('```', '').trim() || 'code';
          codeContent = [];
          return null;
        } else {
          insideCodeBlock = false;
          const segment = codeContent.join('\n');
          return (
            <div key={`code-${idx}`} className="my-6 rounded-lg bg-slate-950 border border-white/5 overflow-hidden font-mono text-xs text-slate-300">
              <div className="bg-slate-900 border-b border-white/5 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                <span>{codeLang}</span>
                <span className="text-green-500 font-bold">● verified compiled</span>
              </div>
              <pre className="p-4 overflow-x-auto select-all">
                <code>{segment}</code>
              </pre>
            </div>
          );
        }
      }

      if (insideCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // Handle standard structures
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return (
          <h3 key={idx} className="font-display text-md font-bold text-white tracking-wide mt-6 mb-3 flex items-center gap-1.5 pt-4">
            <CornerDownRight className="h-4 w-4 text-purple-400" />
            <span>{trimmed.replace('###', '').trim()}</span>
          </h3>
        );
      }

      if (trimmed.startsWith('##')) {
        return (
          <h2 key={idx} className="font-display text-lg font-bold text-white tracking-tight mt-8 mb-4 border-b border-white/5 pb-2 pt-6">
            {trimmed.replace('##', '').trim()}
          </h2>
        );
      }

      if (trimmed.startsWith('#')) {
        return (
          <h1 key={idx} className="font-display text-xl font-bold text-white tracking-tight mt-10 mb-4">
            {trimmed.replace('#', '').trim()}
          </h1>
        );
      }

      // Handle Bullet Lists
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return (
          <ul key={idx} className="list-disc pl-5 my-2 space-y-1 text-slate-300 text-xs">
            <li>{trimmed.substring(1).trim()}</li>
          </ul>
        );
      }

      if (trimmed.match(/^\d+\./)) {
        return (
          <ol key={idx} className="list-decimal pl-5 my-2 space-y-1 text-slate-300 text-xs">
            <li>{trimmed.replace(/^\d+\./, '').trim()}</li>
          </ol>
        );
      }

      // Generic lines
      if (trimmed === '') return <div key={idx} className="h-4" />;

      return (
        <p key={idx} className="text-slate-300 text-xs leading-relaxed font-sans mb-4">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 border-2 border-t-purple-500 border-r-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-xs font-mono">Aligning journal metrics...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="relative min-h-screen bg-slate-900 text-slate-100 py-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Journal Node Missing</h2>
          <p className="text-xs text-slate-500 max-w-sm">The target publication identifier mismatch or cache expired.</p>
          <Link to="/blogs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded text-xs font-mono">
            Return to journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link to="/blogs" className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>BACK TO JOURNAL INDEX</span>
        </Link>

        {/* Hero details card */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-500">
            <span className="flex items-center space-x-1.5">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span>Published {blog.publishedAt.substring(0, 10)}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <User className="h-4 w-4 text-blue-400" />
              <span>Guru Rengarajan</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Bookmark className="h-4 w-4 text-green-400" />
              <span>Verified MNC Publication</span>
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="aspect-[21/9] w-full rounded-xl overflow-hidden glass border border-white/5 relative bg-slate-950">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Blog markdown body display */}
        <div className="art-body pb-12 border-b border-white/5 select-text">
          {renderMarkdownContent(blog.content)}
        </div>

        {/* Footer controls (share / back) */}
        <div className="flex items-center justify-between py-6">
          <div className="flex space-x-1">
            {blog.tags.map((t) => (
              <span key={t} className="font-mono text-[9px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-white/5 font-semibold">
                #{t.toUpperCase()}
              </span>
            ))}
          </div>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-900 border border-white/5 text-xs font-mono select-none"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Copy share link</span>
          </button>
        </div>

      </div>
    </div>
  );
}
