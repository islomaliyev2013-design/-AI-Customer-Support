import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { DateFilterOption } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  dateFilter?: DateFilterOption;
  onDateFilterChange?: (filter: DateFilterOption) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  dateFilter,
  onDateFilterChange,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content body */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopNav
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};
