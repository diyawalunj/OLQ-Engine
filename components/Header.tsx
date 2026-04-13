import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { 
  Shield, LayoutDashboard, BrainCircuit, PenTool, User as UserIcon, 
  LogOut, Settings, Map, Brain, Image, FileText, Users, Trophy, BookOpen,
  Menu, X, Newspaper, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '../utils';
import XPBar from './XPBar';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const NAV_SECTIONS = [
  {
    title: 'Command',
    items: [
      { id: 'ROADMAP', label: 'Roadmap', icon: Map },
      { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Practice',
    items: [
      { id: 'MANUAL', label: 'WAT / TAT / SRT', icon: PenTool },
      { id: 'OIR', label: 'OIR Test', icon: Brain },
      { id: 'PPDT', label: 'PPDT', icon: Image },
      { id: 'SDT', label: 'SDT', icon: FileText },
      { id: 'GTO', label: 'GTO Tasks', icon: Users },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'AI_PRACTICE', label: 'AI Analysis', icon: BrainCircuit },
    ],
  },
  {
    title: 'Resources',
    items: [
      { id: 'NEWS', label: 'Daily News', icon: Newspaper },
      { id: 'KNOWLEDGE', label: 'Knowledge Hub', icon: BookOpen },
      { id: 'LEADERBOARD', label: 'Ranks', icon: Trophy },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'PROFILE', label: 'Profile', icon: UserIcon },
    ],
  },
];

const PROTECTED_TABS = ['ROADMAP', 'DASHBOARD', 'AI_PRACTICE', 'PROFILE', 'ADMIN', 'MANUAL', 'OIR', 'PPDT', 'SDT', 'GTO'];

export default function Header({ currentTab, setTab }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allSections = user?.isAdmin
    ? [...NAV_SECTIONS, { title: 'Admin', items: [{ id: 'ADMIN', label: 'Admin Portal', icon: Settings }] }]
    : NAV_SECTIONS;

  const handleTabClick = (tabId: string) => {
    if (!user && PROTECTED_TABS.includes(tabId)) {
      useAuthStore.getState().setShowAuthModal(true);
      return;
    }
    setTab(tabId);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-olq-border", collapsed && "justify-center px-2")}>
        <div className="w-9 h-9 bg-olq-olive rounded-lg flex items-center justify-center border border-olq-gold/20 shadow-[0_0_15px_rgba(61,68,30,0.5)] shrink-0">
          <Shield className="text-olq-gold w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-xs font-bold tracking-wider text-white uppercase font-display truncate">SSB Engine</h1>
            <p className="text-[7px] text-olq-gold/60 font-bold tracking-[0.2em] uppercase font-display">Command Center</p>
          </div>
        )}
      </div>

      {/* XP Bar (when expanded) */}
      {user && !collapsed && (
        <div className="px-4 py-3 border-b border-olq-border">
          <XPBar />
        </div>
      )}

      {/* Nav Sections */}
      <nav className="flex-1 py-3 overflow-y-auto space-y-1">
        {allSections.map((section) => (
          <div key={section.title} className="mb-2">
            {!collapsed && (
              <p className="px-4 py-1.5 text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] font-display">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 w-full transition-all duration-200 rounded-lg mx-auto",
                    collapsed ? "justify-center p-2.5 mx-1 my-0.5" : "px-4 py-2.5 mx-2",
                    isActive
                      ? "bg-olq-gold/10 text-olq-gold border-r-2 border-olq-gold"
                      : "text-gray-500 hover:text-white hover:bg-olq-card"
                  )}
                >
                  <Icon className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                  {!collapsed && (
                    <span className="text-[11px] font-bold uppercase tracking-widest font-display truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: user & logout */}
      <div className={cn("border-t border-olq-border px-3 py-3", collapsed && "px-1")}>
        {user && !collapsed && (
          <div className="flex items-center gap-2 px-2 pb-2">
            <div className="w-7 h-7 rounded-full bg-olq-gold/10 border border-olq-gold/20 flex items-center justify-center shrink-0">
              <UserIcon className="w-3.5 h-3.5 text-olq-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-mono text-olq-gold truncate">{user.email || 'User'}</p>
            </div>
          </div>
        )}
        {user && (
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-2 w-full rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all",
              collapsed ? "justify-center p-2.5" : "px-3 py-2"
            )}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-[10px] font-bold uppercase tracking-widest font-display">Sign Out</span>}
          </button>
        )}
      </div>

      {/* Collapse Toggle (desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center w-full py-2 border-t border-olq-border text-gray-600 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-olq-bg/80 backdrop-blur-md border-b border-olq-border sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-olq-olive rounded-lg flex items-center justify-center border border-olq-gold/20">
            <Shield className="text-olq-gold w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider font-display">SSB Engine</span>
        </div>
        <div className="flex items-center gap-2">
          {user && <XPBar />}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-olq-card border border-olq-border text-gray-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-olq-bg border-r border-olq-border flex flex-col shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-olq-bg border-r border-olq-border z-40 print:hidden transition-all duration-300 shadow-xl",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
