import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Scale, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/80 text-slate-400 py-10 transition-colors duration-300 dark:bg-slate-950/90 dark:text-slate-400 light:bg-slate-100 light:text-slate-600 light:border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand block */}
          <div className="md:col-span-2">
            <h3 className="font-display text-md font-bold text-white tracking-wide mb-3">
              Better Call Guru!
            </h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Guru Rengarajan is a full-stack distributed engineer specializing in scalable, secure microservice architectures and interactive systems integrations.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://github.com/gururengarajan" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub Portal Profile"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/in/gururengarajan" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label="LinkedIn Specialist Network"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/gururengarajan" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors"
                aria-label="Twitter Feed"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Portfolio
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Story</Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-white transition-colors">Skills Spectrum</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">Code Showcases</Link>
              </li>
              <li>
                <Link to="/experience" className="hover:text-white transition-colors">Milestones</Link>
              </li>
            </ul>
          </div>

          {/* Legal references */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Security & Admin
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin/login" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <ShieldCheck className="h-4 w-4 text-purple-400" />
                  <span>Administrative Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-white transition-colors">Articles Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Form Contact</Link>
              </li>
              <li className="flex items-center space-x-1 text-xs text-slate-500">
                <Scale className="h-3 w-3" />
                <span>"Better Call Guru!" © {currentYear}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} Guru Rengarajan. All rights reserved. Made for MNC Placements.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Engineered with <Heart className="h-3 w-3 text-red-500 mx-1 animate-pulse" /> using React 19 & Tailwind CSS v4.
          </p>
        </div>
      </div>
    </footer>
  );
}
