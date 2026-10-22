import React from 'react';
import spacePlanetBg from '../../assets/space_planet_bg.jpg';
import { Sparkles, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-black selection:bg-purple-600 selection:text-white">
      {/* Background Planet Image matching Reference Image 1 */}
      <div className="absolute inset-0 z-0">
        <img
          src={spacePlanetBg}
          alt="Glowing Purple Cosmic Planet"
          className="w-full h-full object-cover object-top opacity-90 scale-105 transform duration-1000"
        />
        {/* Deep vignette & atmospheric glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-black/60" />
        <div className="absolute inset-0 bg-radial from-purple-900/20 via-transparent to-black/80" />
      </div>

      {/* Subtle star particle twinkling elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[15%] left-[20%] w-1.5 h-1.5 bg-purple-200 rounded-full animate-twinkle" />
        <div className="absolute top-[35%] left-[10%] w-1 h-1 bg-white rounded-full animate-twinkle [animation-delay:1s]" />
        <div className="absolute top-[60%] left-[25%] w-2 h-2 bg-indigo-300 rounded-full animate-twinkle [animation-delay:2s]" />
        <div className="absolute top-[25%] right-[30%] w-1 h-1 bg-purple-300 rounded-full animate-twinkle [animation-delay:1.5s]" />
        <div className="absolute bottom-[20%] right-[15%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle [animation-delay:0.5s]" />
        <div className="absolute top-[80%] left-[45%] w-1 h-1 bg-purple-400 rounded-full animate-twinkle [animation-delay:2.5s]" />
      </div>

      {/* Main Glass Card container */}
      <div className="relative z-10 w-full max-w-md my-8">
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-purple-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/50">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Nexus<span className="text-purple-400">AI</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            </span>
          </Link>
        </div>

        {/* Translucent Black Glass Card */}
        <div className="glass-card glass-card-hover rounded-3xl p-8 md:p-10 border border-purple-500/30 shadow-[0_0_60px_rgba(147,51,234,0.25)] relative overflow-hidden">
          {/* Subtle top edge neon highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-70" />

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-400 mt-2 font-normal">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Protected by Supabase Enterprise Security &bull; Grounded AI Architecture
        </div>
      </div>
    </div>
  );
};
