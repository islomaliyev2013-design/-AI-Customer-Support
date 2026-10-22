import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  HelpCircle,
  Users,
  MessageSquare,
  TrendingUp,
  Receipt,
  Settings,
  LogOut,
  ExternalLink,
  Bot,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { business, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'FAQs', path: '/faqs', icon: HelpCircle },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Conversations', path: '/conversations', icon: MessageSquare },
    { label: 'Financial Analytics', path: '/analytics', icon: TrendingUp },
    { label: 'Financial Records', path: '/financial-records', icon: Receipt },
    { label: 'Business Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A0C13] border-r border-[#1B1F2E] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-[#1B1F2E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1">
                Nexus<span className="text-purple-400">AI</span>
                <Sparkles className="w-3 h-3 text-purple-400" />
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block -mt-0.5">
                Enterprise SaaS
              </span>
            </div>
          </div>
        </div>

        {/* Public Support Link Quick Card */}
        {business?.slug && (
          <div className="p-4 mx-3 my-3 rounded-2xl bg-[#111420] border border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Public Support URL</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 truncate mb-2.5">
              /support/{business.slug}
            </p>
            <a
              href={`/support/${business.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium group-hover:translate-x-0.5 transition-transform"
            >
              <span>Open Customer Chat</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Navigation list */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider px-3 py-2">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#131724]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-purple-400'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer profile & logout */}
        <div className="p-3 border-t border-[#1B1F2E]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
