import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { 
  Shield, LayoutDashboard, BrainCircuit, PenTool, User as UserIcon, 
  LogOut, Settings, Map, Brain, Image, FileText, Users, Trophy, BookOpen,
  ChevronDown, Menu, X
} from 'lucide-react';
import { cn } from '../utils';
import XPBar from './XPBar';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const PRACTICE_TABS = [
  { id: 'MANUAL', label: 'WAT/TAT/SRT', icon: PenTool },
  { id: 'OIR', label: 'OIR Test', icon: Brain },
  { id: 'PPDT', label: 'PPDT', icon: Image },
  { id: 'SDT', label: 'SDT', icon: FileText },
  { id: 'GTO', label: 'GTO Tasks', icon: Users },
  { id: 'AI_PRACTICE', label: 'AI Analysis', icon: BrainCircuit },
];

export default function Header({ currentTab, setTab }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const [showPracticeMenu, setShowPracticeMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isPracticeTab = PRACTICE_TABS.some(t => t.id === currentTab);

  const MAIN_TABS = [
    { id: 'ROADMAP', label: 'Roadmap', icon: Map },
    { id: 'PRACTICE_MENU', label: 'Practice', icon: PenTool, isMenu: true },
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'LEADERBOARD', label: 'Ranks', icon: Trophy },
    { id: 'KNOWLEDGE', label: 'Knowledge', icon: BookOpen },
    { id: 'PROFILE', label: 'Profile', icon: UserIcon },
  ];

  if (user?.isAdmin) {
    MAIN_TABS.push({ id: 'ADMIN', label: 'Admin', icon: Settings });
  }

  const handleTabClick = (tabId: string) => {
    if (!user && tabId !== 'ROADMAP' && tabId !== 'KNOWLEDGE' && tabId !== 'PRACTICE_MENU') {
      useAuthStore.getState().setShowAuthModal(true);
      return;
    }
    if (tabId === 'PRACTICE_MENU') {
      setShowPracticeMenu(!showPracticeMenu);
      return;
    }
    setTab(tabId);
    setShowPracticeMenu(false);
    setShowMobileMenu(false);
  };

  const handlePracticeSelect = (tabId: string) => {
    if (!user) {
      useAuthStore.getState().setShowAuthModal(true);
      return;
    }
    setTab(tabId);
    setShowPracticeMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="border-b border-olq-border bg-olq-bg/80 backdrop-blur-md sticky top-0 z-50 print:hidden shadow-xl">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 bg-olq-olive rounded-lg flex items-center justify-center border border-olq-gold/20 shadow-[0_0_15px_rgba(61,68,30,0.5)]">
            <Shield className="text-olq-gold w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-wider text-white uppercase font-display">SSB Engine</h1>
            <p className="text-[8px] text-olq-gold/60 font-bold tracking-[0.3em] uppercase font-display">Command Center</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 relative">
          {MAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === 'PRACTICE_MENU' ? isPracticeTab : currentTab === tab.id;
            return (
              <div key={tab.id} className="relative">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all font-display whitespace-nowrap",
                    isActive 
                      ? "bg-olq-gold/10 text-olq-gold border border-olq-gold/30 shadow-[0_0_15px_rgba(197,160,89,0.2)]" 
                      : "text-gray-500 hover:text-white hover:bg-olq-card border border-transparent"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.id === 'PRACTICE_MENU' && <ChevronDown className={cn("w-3 h-3 transition-transform", showPracticeMenu && "rotate-180")} />}
                </button>

                {/* Practice Dropdown */}
                {tab.id === 'PRACTICE_MENU' && showPracticeMenu && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-olq-card border border-olq-border rounded-xl overflow-hidden shadow-2xl z-50">
                    {PRACTICE_TABS.map((pt) => {
                      const PIcon = pt.icon;
                      return (
                        <button
                          key={pt.id}
                          onClick={() => handlePracticeSelect(pt.id)}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-olq-gold/10 transition-colors flex items-center gap-3",
                            currentTab === pt.id && "bg-olq-gold/5 text-olq-gold"
                          )}
                        >
                          <PIcon className="w-4 h-4 text-olq-gold/60" />
                          <div>
                            <span className="text-xs font-bold text-white block">{pt.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 shrink-0">
          {user && <XPBar />}

          {user && (
            <div className="hidden sm:block text-right">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] block font-display">Logged In</span>
              <span className="text-xs font-mono text-olq-gold">{user?.email || 'Admin'}</span>
            </div>
          )}

          {user && (
            <button 
              onClick={logout}
              className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-xl bg-olq-card border border-olq-border text-gray-400 hover:text-white transition-colors"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-olq-border bg-olq-card px-4 py-4 space-y-1">
          {MAIN_TABS.filter(t => t.id !== 'PRACTICE_MENU').map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                  currentTab === tab.id ? "bg-olq-gold/10 text-olq-gold" : "text-gray-400 hover:text-white hover:bg-olq-bg"
                )}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}

          <div className="border-t border-olq-border pt-2 mt-2">
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-2">Practice Modules</p>
            {PRACTICE_TABS.map((pt) => {
              const PIcon = pt.icon;
              return (
                <button
                  key={pt.id}
                  onClick={() => handlePracticeSelect(pt.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                    currentTab === pt.id ? "bg-olq-gold/10 text-olq-gold" : "text-gray-500 hover:text-white hover:bg-olq-bg"
                  )}
                >
                  <PIcon className="w-3.5 h-3.5" /> {pt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Close practice menu on outside click */}
      {showPracticeMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowPracticeMenu(false)} />
      )}
    </header>
  );
}
