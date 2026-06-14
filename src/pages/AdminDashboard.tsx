import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project, Blog, Skill, Certification, Message, Experience } from '../types';
import GlowBg from '../components/GlowBg';
import { 
  FolderGit2, 
  BookOpen, 
  Cpu, 
  Award, 
  MessageSquare, 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut, 
  Sparkles,
  BarChart2,
  MailCheck, Check
} from 'lucide-react';

export default function AdminDashboard() {
  const { showToast, trackPageView } = useApp();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'blogs' | 'skills' | 'certs' | 'messages'>('overview');

  // Database states
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [resumeUrl, setResumeUrl] = useState('#');

  // Loading states
  const [loading, setLoading] = useState(true);

  // Forms editing state tracking
  const [editingId, setEditingId] = useState<string | null>(null);

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', detailedDescription: '', technologies: '', githubUrl: '', liveUrl: '', image: '', category: 'Development', featured: false
  });

  // Blog Form State
  const [blogForm, setBlogForm] = useState({
    title: '', content: '', tags: '', thumbnail: ''
  });

  // Skill Form State
  const [skillForm, setSkillForm] = useState({
    name: '', category: 'Frontend' as any, proficiency: 80
  });

  // Certificate Form State
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', issueDate: '', certificateUrl: ''
  });

  useEffect(() => {
    trackPageView();
    const storedToken = localStorage.getItem('guru-token');
    if (!storedToken) {
      showToast('Unauthorized. Log in first.', 'error');
      navigate('/admin/login');
      return;
    }
    setToken(storedToken);
    loadAllAdminData(storedToken);
  }, []);

  const loadAllAdminData = async (activeToken: string) => {
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${activeToken}` };

      const [prRes, blRes, skRes, ceRes, meRes, reRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/blogs'),
        fetch('/api/skills'),
        fetch('/api/certificates'),
        fetch('/api/contact', { headers }),
        fetch('/api/resume')
      ]);

      if (prRes.ok) setProjects(await prRes.json());
      if (blRes.ok) setBlogs(await blRes.json());
      if (skRes.ok) setSkills(await skRes.json());
      if (ceRes.ok) setCerts(await ceRes.json());
      if (meRes.ok) setMessages(await meRes.json());
      if (reRes.ok) {
        const rc = await reRes.json();
        if (rc && rc.fileUrl) setResumeUrl(rc.fileUrl);
      }

    } catch (e) {
      showToast('Database fetch connection failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guru-token');
    localStorage.removeItem('guru-user');
    showToast('Admin session terminated successfully.', 'info');
    navigate('/admin/login');
  };

  // Headers Utility helper
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  // --- CRUD TRANSACTIONS HANDLERS ---

  // Project submits
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/projects/${editingId}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(projectForm)
      });

      if (res.ok) {
        showToast(isEdit ? 'Project specs detailed successfully.' : 'New project published.', 'success');
        setEditingId(null);
        setProjectForm({ title: '', description: '', detailedDescription: '', technologies: '', githubUrl: '', liveUrl: '', image: '', category: 'Development', featured: false });
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Project database update failed.', 'error');
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!window.confirm('Clear index file record?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Project record clear.', 'success');
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Transaction error.', 'error');
    }
  };

  // Blog submits
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/blogs/${editingId}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(blogForm)
      });

      if (res.ok) {
        showToast(isEdit ? 'Article specifications modified.' : 'New article cataloged.', 'success');
        setEditingId(null);
        setBlogForm({ title: '', content: '', tags: '', thumbnail: '' });
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Blog indexing write failed.', 'error');
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (!window.confirm('Prune article permanently?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Article metadata clear.', 'success');
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Blog transaction exception.', 'error');
    }
  };

  // Skill submits
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/skills/${editingId}` : '/api/skills';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(skillForm)
      });

      if (res.ok) {
        showToast(isEdit ? 'Technical competency index rewritten.' : 'New skill element appended.', 'success');
        setEditingId(null);
        setSkillForm({ name: '', category: 'Frontend', proficiency: 80 });
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Competency block failed to store.', 'error');
    }
  };

  const handleSkillDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Competency node removed.', 'success');
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Exception clearance error.', 'error');
    }
  };

  // Cert submits
  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/certificates/${editingId}` : '/api/certificates';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(certForm)
      });

      if (res.ok) {
        showToast(isEdit ? 'Credential specifications registered.' : 'New credential block indexed.', 'success');
        setEditingId(null);
        setCertForm({ title: '', issuer: '', issueDate: '', certificateUrl: '' });
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Credential write state failure.', 'error');
    }
  };

  const handleCertDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Credential block purged.', 'success');
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Deletion state failure.', 'error');
    }
  };

  // Message read/delete
  const handleMarkMessageRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Message status: Read', 'success');
        loadAllAdminData(token);
      }
    } catch (e) {}
  };

  const handleMessageDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Message removed from servers.', 'success');
        loadAllAdminData(token);
      }
    } catch (e) {}
  };

  // Resume file link updates
  const handleResumeSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resume', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ fileUrl: resumeUrl })
      });
      if (res.ok) {
        showToast('Secure Resume redirect URL registered.', 'success');
        loadAllAdminData(token);
      }
    } catch (e) {
      showToast('Upload simulation failed.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 border-2 border-t-purple-500 border-r-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-xs font-mono">Syncing admin credentials key hashes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 py-16 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      <GlowBg />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5 mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-cyan-400 text-xs font-mono uppercase tracking-widest font-bold mb-1">
              <Sparkles className="h-4 w-4 animate-spin text-purple-500" />
              <span>GURU PORTFOLIO CONTROLLER SUITE</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Console Overview</h1>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Link
              to="/admin/analytics"
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg border border-cyan-500/30 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium select-none"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit Console</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-1.5 mb-10 border-b border-white/5 pb-4">
          {[
            { id: 'overview', name: 'Dashboard' },
            { id: 'projects', name: 'Projects' },
            { id: 'blogs', name: 'Blogs' },
            { id: 'skills', name: 'Skills' },
            { id: 'certs', name: 'Credentials' },
            { id: 'messages', name: `Inbox (${messages.filter(m => !m.read).length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setEditingId(null); }}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide transition-colors duration-150 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-950 border border-transparent'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* --- TABS INNER SECTIONS --- */}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Stat counts cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass border border-white/5 p-5 rounded-xl flex items-center space-x-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><FolderGit2 className="h-6 w-6" /></div>
                <div>
                  <div className="text-slate-500 text-[10px] font-mono uppercase">Total Projects</div>
                  <div className="text-2xl font-bold font-display text-white">{projects.length}</div>
                </div>
              </div>

              <div className="glass border border-white/5 p-5 rounded-xl flex items-center space-x-4">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg"><BookOpen className="h-6 w-6" /></div>
                <div>
                  <div className="text-slate-500 text-[10px] font-mono uppercase">Total Blogs</div>
                  <div className="text-2xl font-bold font-display text-white">{blogs.length}</div>
                </div>
              </div>

              <div className="glass border border-white/5 p-5 rounded-xl flex items-center space-x-4">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg"><Cpu className="h-6 w-6" /></div>
                <div>
                  <div className="text-slate-500 text-[10px] font-mono uppercase">Skills Catalog</div>
                  <div className="text-2xl font-bold font-display text-white">{skills.length}</div>
                </div>
              </div>

              <div className="glass border border-white/5 p-5 rounded-xl flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><MessageSquare className="h-6 w-6" /></div>
                <div>
                  <div className="text-slate-500 text-[10px] font-mono uppercase">Total Messages</div>
                  <div className="text-2xl font-bold font-display text-white">{messages.length}</div>
                </div>
              </div>

            </div>

            {/* Resume Upload Module */}
            <div className="glass border border-white/5 p-6 rounded-2xl max-w-xl">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-3">Resume Settings</h3>
              <form onSubmit={handleResumeSave} className="flex gap-2">
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="URL of resume file copy..."
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg flex items-center space-x-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>Update File Redirect</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Projects manager */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleProjectSubmit} className="glass border border-white/5 p-6 rounded-2xl space-y-4">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  {editingId ? 'Edit Project Specs' : 'Publish New Project'}
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Title Name *</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    placeholder="E.g. OmniQueue distributed balancer"
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Category Scope</label>
                  <input
                    type="text"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                    placeholder="E.g. Distributed Infrastructure / Artificial Intelligence"
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Brief Description *</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    placeholder="A concise, high-impact description statement..."
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Detailed specifications & logs</label>
                  <textarea
                    value={projectForm.detailedDescription}
                    onChange={(e) => setProjectForm({...projectForm, detailedDescription: e.target.value})}
                    placeholder="Detailed architecture challenges resolved block..."
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none font-sans whitespace-pre-line"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Technologies Used (Commas separated) *</label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                    placeholder="E.g. Go, Redis, Docker, gRPC, PostgreSQL"
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Github source URL</label>
                    <input
                      type="url"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({...projectForm, githubUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Demo live URL</label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({...projectForm, liveUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Display cover image URL</label>
                  <input
                    type="url"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                    placeholder="https://images.unsplash.com/etc"
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 select-none">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                    className="h-4 w-4 bg-slate-950 border border-white/5 text-blue-600 rounded"
                  />
                  <label htmlFor="featured" className="text-xs text-slate-300">Feature this in homepage grids</label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg">
                    {editingId ? 'Modify Specs' : 'Publish catalog specs'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setProjectForm({ title: '', description: '', detailedDescription: '', technologies: '', githubUrl: '', liveUrl: '', image: '', category: 'Development', featured: false });
                      }}
                      className="px-3.5 py-2.5 bg-slate-950 border border-white/5 text-slate-400 hover:text-white rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">PROJECT CATALOGUE INDEX</h3>
              <div className="space-y-3">
                {projects.map(p => (
                  <div key={p._id} className="glass p-4 rounded-lg flex items-center justify-between border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase tracking-wider">{p.category}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(p._id);
                          setProjectForm({
                            title: p.title,
                            description: p.description,
                            detailedDescription: p.detailedDescription || '',
                            technologies: p.technologies.join(', '),
                            githubUrl: p.githubUrl,
                            liveUrl: p.liveUrl,
                            image: p.image,
                            category: p.category,
                            featured: p.featured
                          });
                        }}
                        className="p-1.5 rounded hover:bg-slate-900 border border-white/5 text-slate-300"
                      >
                        <Edit className="h-4.5 w-4.5" />
                      </button>

                      <button
                        onClick={() => handleProjectDelete(p._id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Blogs manager */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Form */}
            <div className="lg:col-span-6">
              <form onSubmit={handleBlogSubmit} className="glass border border-white/5 p-6 rounded-2xl space-y-4">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  {editingId ? 'Edit Article Specifications' : 'Publish Journal Node'}
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Title *</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                    placeholder="Article title name..."
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Hashtag tags (comma separated) *</label>
                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                    placeholder="E.g. AI, Gemini, TypeScript, Caching"
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Main markdown Content (Raw markdown support) *</label>
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                    rows={8}
                    placeholder="Insert main markdown content here..."
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none font-mono resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Thumbnail image URL</label>
                  <input
                    type="url"
                    value={blogForm.thumbnail}
                    onChange={(e) => setBlogForm({...blogForm, thumbnail: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg">
                    {editingId ? 'Modify publication Specs' : 'Publish publication'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setBlogForm({ title: '', content: '', tags: '', thumbnail: '' });
                      }}
                      className="px-3 py-2 bg-slate-950 text-slate-500 hover:text-white rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">JOURNAL RECORDS LIST</h3>
              <div className="space-y-3">
                {blogs.map(b => (
                  <div key={b._id} className="glass p-4 rounded-lg flex items-center justify-between border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-white">{b.title}</h4>
                      <p className="font-mono text-[9px] text-slate-500 mt-1">/{b.slug}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(b._id);
                          setBlogForm({
                            title: b.title,
                            content: b.content,
                            tags: b.tags.join(', '),
                            thumbnail: b.thumbnail
                          });
                        }}
                        className="p-1.5 rounded hover:bg-slate-900 border border-white/5 text-slate-300"
                      >
                        <Edit className="h-4.5 w-4.5" />
                      </button>

                      <button
                        onClick={() => handleBlogDelete(b._id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Skills manager */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleSkillSubmit} className="glass border border-white/5 p-6 rounded-2xl space-y-4">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Add competency element
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Element name *</label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                    placeholder="E.g. Go (Golang) / NestJS"
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Category Segment</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({...skillForm, category: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="Frontend">Frontend Development</option>
                    <option value="Backend">Backend Systems</option>
                    <option value="Database">Database Management</option>
                    <option value="DevOps">Cloud / DevOps</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Competency scale value (0 - 100) *</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={skillForm.proficiency}
                    onChange={(e) => setSkillForm({...skillForm, proficiency: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg">
                  Append element portfolio
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">COMPETENCY LIST INDEX</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map(s => (
                  <div key={s._id} className="glass p-3.5 rounded-lg flex items-center justify-between border border-white/5 text-xs">
                    <div>
                      <h4 className="font-bold text-white">{s.name}</h4>
                      <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase tracking-wider">{s.category} ({s.proficiency}%)</p>
                    </div>

                    <button
                      onClick={() => handleSkillDelete(s._id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 5: Certifications manager */}
        {activeTab === 'certs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleCertSubmit} className="glass border border-white/5 p-6 rounded-2xl space-y-4">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Index credential certification
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Credential title *</label>
                  <input
                    type="text"
                    value={certForm.title}
                    onChange={(e) => setCertForm({...certForm, title: e.target.value})}
                    placeholder="Credential title name..."
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Issuer / Agency *</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                    placeholder="E.g. Google Cloud / AWS Platform"
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Issue month/date</label>
                    <input
                      type="text"
                      value={certForm.issueDate}
                      onChange={(e) => setCertForm({...certForm, issueDate: e.target.value})}
                      placeholder="E.g. Nov 2025"
                      className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Credential verification URL link</label>
                    <input
                      type="url"
                      value={certForm.certificateUrl}
                      onChange={(e) => setCertForm({...certForm, certificateUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg">
                  Index credential
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">QUALIFICATION CERT LIST</h3>
              <div className="space-y-3">
                {certs.map(c => (
                  <div key={c._id} className="glass p-4 rounded-lg flex items-center justify-between border border-white/5 text-xs">
                    <div>
                      <h4 className="font-bold text-white">{c.title}</h4>
                      <p className="font-mono text-[9px] text-slate-500 mt-1 uppercase tracking-wider">{c.issuer} ({c.issueDate})</p>
                    </div>

                    <button
                      onClick={() => handleCertDelete(c._id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 6: Inbox Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Recruiter Correspondence Inbox</h3>
            
            {messages.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/5 rounded-xl bg-slate-950/20 max-w-xl mx-auto">
                <MessageSquare className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                <span className="text-sm text-slate-400 block font-semibold">Your mail container is clear.</span>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map(msg => (
                  <div 
                    key={msg._id} 
                    className={`glass p-6 rounded-2xl border transition-all duration-300 relative ${
                      msg.read 
                        ? 'border-white/5 bg-slate-950/30' 
                        : 'border-blue-500/25 bg-slate-900/60'
                    }`}
                  >
                    {!msg.read && (
                      <div className="absolute top-4 right-4 h-2.5 w-2.5 bg-blue-500 rounded-full animate-ping" />
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-3 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">{msg.subject}</h4>
                        <p className="font-mono text-[10px] text-blue-400 mt-1">FROM: {msg.name} ({msg.email})</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{msg.createdAt.substring(0, 10)}</span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed font-sans select-all bg-slate-950/40 p-4 border border-white/5 rounded-lg">
                      "{msg.message}"
                    </p>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-4 text-xs font-mono">
                      {!msg.read && (
                        <button
                          onClick={() => handleMarkMessageRead(msg._id)}
                          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                          <MailCheck className="h-4 w-4" />
                          <span>Mark message read</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleMessageDelete(msg._id)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg hover:bg-red-500/10 text-red-500 font-semibold"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Purge record</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
