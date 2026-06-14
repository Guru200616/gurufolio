import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages import coordinates
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Certifications from './pages/Certifications';
import Experience from './pages/Experience';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import NotFound from './pages/NotFound';

import { X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Hide Navbar/Footer on specific gateways like full login / dashboard or NotFound to reduce focus noise
  const isMinimalPage = location.pathname === '/admin/login' || location.pathname === '/404';

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-800">
      {!isMinimalPage && <Navbar />}
      <main className="flex-grow relative z-10">{children}</main>
      {!isMinimalPage && <Footer />}
    </div>
  );
}

function FloatingToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3 max-w-sm w-full font-mono text-xs select-none pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-2.5 p-4 rounded-xl border bg-slate-950/95 text-slate-200 shadow-2xl animate-float"
          style={{
            borderColor: t.type === 'success' ? '#22c55e' : t.type === 'error' ? '#ef4444' : '#3b82f6',
          }}
        >
          {t.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : t.type === 'error' ? (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          ) : (
            <Sparkles className="h-5 w-5 text-blue-500 flex-shrink-0 animate-spin" />
          )}

          <div className="flex-1">
            <span className="font-semibold text-white">SYSTEM NOTIFICATION</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.text}</p>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
        <FloatingToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
