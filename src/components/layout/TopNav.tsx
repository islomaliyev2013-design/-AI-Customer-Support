import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  Bell,
  Check,
  Copy,
  ChevronDown,
  Building2,
  Calendar,
} from 'lucide-react';
import { DateFilterOption } from '../../types';

interface TopNavProps {
  onToggleSidebar: () => void;
  dateFilter?: DateFilterOption;
  onDateFilterChange?: (filter: DateFilterOption) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleSidebar,
  dateFilter = '30d',
  onDateFilterChange,
}) => {
  const { user, business } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const copySupportLink = () => {
    if (!business?.slug) return;
    const url = `${window.location.origin}/support/${business.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090B12]/85 backdrop-blur-md border-b border-[#1A1E2D] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Business identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            {business?.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.name}
                className="w-9 h-9 rounded-xl object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                {business?.name || 'My Business'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live AI
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{business?.category || 'Retail SaaS'}</span>
              <span>&bull;</span>
              <span className="text-purple-300 font-mono font-medium">
                {business?.currency || 'USD'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Copy support link button */}
        <button
          onClick={copySupportLink}
          className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141724] border border-white/10 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Copy customer support URL"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-purple-400" />
              <span>Share Support Link</span>
            </>
          )}
        </button>

        {/* Global Date Filter Dropdown */}
        {onDateFilterChange && (
          <div className="relative">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141724] border border-white/10 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value as DateFilterOption)}
                className="bg-transparent text-xs text-white outline-none cursor-pointer pr-1"
              >
                <option value="7d" className="bg-[#141724]">Last 7 Days</option>
                <option value="30d" className="bg-[#141724]">Last 30 Days</option>
                <option value="90d" className="bg-[#141724]">Last 90 Days</option>
                <option value="month" className="bg-[#141724]">This Month</option>
                <option value="year" className="bg-[#141724]">This Year</option>
              </select>
            </div>
          </div>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#141724] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0F121C] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-purple-400">2 unread</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="font-medium text-purple-300">New Customer Chat</div>
                  <div className="text-[11px] text-slate-400">Jasur asked about iPhone 17 colors in Uzbek.</div>
                  <div className="text-[9px] text-slate-500 mt-1">15 min ago</div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-medium text-emerald-300">Revenue Recorded</div>
                  <div className="text-[11px] text-slate-400">+$6,890 SLA contract added to financial ledger.</div>
                  <div className="text-[9px] text-slate-500 mt-1">1 hour ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile capsule */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 p-[1.5px]">
            <img
              src={
                user?.avatar_url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.full_name || 'Admin'}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">
              {user?.full_name || 'Admin'}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {user?.email || 'admin@nexus.io'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
