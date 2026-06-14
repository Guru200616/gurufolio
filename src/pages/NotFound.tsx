import React from 'react';
import { Link } from 'react-router-dom';
import GlowBg from '../components/GlowBg';
import { ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4 transition-colors duration-300 dark:bg-slate-950 light:bg-slate-50">
      <GlowBg />

      <div className="relative z-10 text-center max-w-sm space-y-6">
        
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 animate-bounce">
            <ShieldAlert className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-4xl font-extrabold text-white tracking-tight">404 Exception</h1>
          <p className="font-mono text-[10px] uppercase text-slate-500 tracking-wider">requested routing address resolved void</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed pt-2">
            The resource coordinate you are attempting to address is not loaded in our database parameters. Better Call Guru!
          </p>
        </div>

        <div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold hover:scale-[1.01] transition-transform shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
