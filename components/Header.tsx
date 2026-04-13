import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { Shield, LayoutDashboard, BrainCircuit, PenTool, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { cn } from '../utils';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export default function Header({ currentTab, setTab }: HeaderProps) {
  const { user, logout } = useAuthStore();

  const TABS = [
    { id: 'MANUAL', label: 'Manual Practice', icon: PenTool },
    { id: 'AI_PRACTICE', label: 'AI Practice', icon: BrainCircuit },
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'PROFILE', label: 'Profile', icon: UserIcon },
  ];

  if (user?.isAdmin) {
    TABS.push({ id: 'ADMIN', label: 'Admin', icon: Settings });
  }

  return (
    <header className="h-auto min-h-[80px] border-b border-olq-border flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-0 bg-olq-bg/80 backdrop-blur-md sticky top-0 z-50 print:hidden gap-4 shadow-xl">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-olq-olive rounded-lg flex items-center justify-center border border-olq-gold/20 shrink-0 shadow-[0_0_15px_rgba(61,68,30,0.5)]">
            <Shield className="text-olq-gold w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-wider text-white uppercase font-display">SSB Engine</h1>
            <p className="text-[8px] text-olq-gold/60 font-bold tracking-[0.3em] uppercase font-display">Selection Intelligence</p>
          </div>
        </div>
        
        {/* Mobile menu could be toggled here but keeping flat for now */}
      </div>

      <nav className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all font-display whitespace-nowrap",
                isActive 
                  ? "bg-olq-gold/10 text-olq-gold border border-olq-gold/30 shadow-[0_0_15px_rgba(197,160,89,0.2)]" 
                  : "text-gray-500 hover:text-white hover:bg-olq-card border border-transparent"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-4 shrink-0 justify-end w-full md:w-auto">
        <div className="text-right hidden sm:block">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] block font-display">Logged In</span>
          <span className="text-xs font-mono text-olq-gold">{user?.email || 'Admin'}</span>
        </div>
        <button 
          onClick={logout}
          className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
