import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, Sun, Moon, Sparkles, Terminal, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { theme, toggleTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Check if current page is in admin view to style differently or add back-links
  const isAdminPage = location.pathname.startsWith('/admin');

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Experience', path: '/experience' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Resume', path: '/resume' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/5 bg-slate-900/40 text-slate-100 backdrop-blur-md transition-colors duration-300 dark:bg-slate-950/60 dark:text-slate-100 light:bg-white/80 light:text-slate-800 light:border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo element */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 font-display text-lg font-bold tracking-tight text-blue-500 hover:text-blue-400">
              <Terminal className="h-5 w-5 text-purple-500 animate-pulse" />
              <span>Guru<span className="text-purple-500">Portfolio</span>Pro</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900/50 light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Practical utility interactions (Theme + Admin link) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full cursor-pointer transition-colors duration-200 text-slate-300 dark:text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Toggle Theme"
              aria-label="Toggle visual contrast"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
            </button>

            <Link
              to={isAdminPage ? '/admin/dashboard' : '/admin/login'}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-purple-500/30 text-purple-400 bg-purple-500/5 text-sm font-medium hover:bg-purple-500/10 transition-all duration-200 shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              <span>{isAdminPage ? 'Dashboard' : 'Admin'}</span>
            </Link>
          </div>

          {/* Mobile hamburger icon */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-300 hover:bg-slate-800"
              aria-label="Theme shortcut"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
            </button>

            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none"
              aria-label="Primary navigation trigger"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Animate Presence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/5 bg-slate-900 dark:bg-slate-950 light:bg-white light:border-slate-200"
          >
            <div className="space-y-1 px-3 pb-4 pt-2">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 dark:text-slate-300 dark:hover:bg-slate-800 light:text-slate-600 light:hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-white/5">
                <Link
                  to={isAdminPage ? '/admin/dashboard' : '/admin/login'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span>{isAdminPage ? 'Admin Workspace' : 'Admin Login'}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
