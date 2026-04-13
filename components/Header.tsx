import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { 
  Shield, LayoutDashboard, BrainCircuit, PenTool, User as UserIcon, 
  LogOut, Settings, Map, Brain, Image, FileText, Users, Trophy, BookOpen,
  Menu, X, Newspaper, ChevronLeft, ChevronRight, Database, Activity, 
  ShieldAlert, UploadCloud, BarChart3, UserCog
} from 'lucide-react';
import { cn } from '../utils';
import XPBar from './XPBar';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

// ---- NORMAL USER NAV ----
const USER_NAV_SECTIONS = [
  {
    title: 'Command',
    items: [
      { id: 'ROADMAP', label: 'Roadmap', icon: Map },
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

// ---- ADMIN NAV ----
const ADMIN_NAV_SECTIONS = [
  {
    title: 'Admin HQ',
    items: [
      { id: 'ADMIN', label: 'Dashboard', icon: ShieldAlert },
    ],
  },
  {
    title: 'Management',
    items: [
      { id: 'ADMIN_USERS', label: 'User Management', icon: UserCog },
      { id: 'ADMIN_DATASETS', label: 'Datasets', icon: Database },
      { id: 'ADMIN_ANALYTICS', label: 'Analytics', icon: BarChart3 },
      { id: 'ADMIN_CONTENT', label: 'Content', icon: UploadCloud },
    ],
  },
  {
    title: 'Platform',
    items: [
      { id: 'ADMIN_SETTINGS', label: 'Settings', icon: Settings },
      { id: 'ADMIN_ACTIVITY', label: 'Activity Log', icon: Activity },
    ],
  },
  {
    title: 'Switch View',
    items: [
      { id: 'ROADMAP', label: 'User View', icon: UserIcon },
    ],
  },
];

const PROTECTED_TABS = ['ROADMAP', 'AI_PRACTICE', 'PROFILE', 'ADMIN', 'MANUAL', 'OIR', 'PPDT', 'SDT', 'GTO',
  'ADMIN_USERS', 'ADMIN_DATASETS', 'ADMIN_ANALYTICS', 'ADMIN_CONTENT', 'ADMIN_SETTINGS', 'ADMIN_ACTIVITY'];

export default function Header({ currentTab, setTab }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.isAdmin === true;
  const isAdminView = isAdmin && currentTab.startsWith('ADMIN');

  // Pick sections based on whether user is in admin view
  const sections = isAdminView ? ADMIN_NAV_SECTIONS : (isAdmin
    ? [...USER_NAV_SECTIONS, { title: 'Admin', items: [{ id: 'ADMIN', label: 'Admin HQ', icon: ShieldAlert }] }]
    : USER_NAV_SECTIONS
  );

  const handleTabClick = (tabId: string) => {
    if (!user && PROTECTED_TABS.includes(tabId)) {
      useAuthStore.getState().setShowAuthModal(true);
      return;
    }
    // Block non-admin users from admin tabs
    if (tabId.startsWith('ADMIN') && !isAdmin) {
      return;
    }
    setTab(tabId);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-olq-border", collapsed && "justify-center px-2")}>
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center border shrink-0",
          isAdminView
            ? "bg-red-500/20 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            : "bg-olq-olive border-olq-gold/20 shadow-[0_0_15px_rgba(61,68,30,0.5)]"
        )}>
          {isAdminView
            ? <ShieldAlert className="text-red-400 w-5 h-5" />
            : <Shield className="text-olq-gold w-5 h-5" />
          }
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className={cn(
              "text-xs font-bold tracking-wider uppercase font-display truncate",
              isAdminView ? "text-red-400" : "text-white"
            )}>
              {isAdminView ? 'Admin Panel' : 'SSB Engine'}
            </h1>
            <p className={cn(
              "text-[7px] font-bold tracking-[0.2em] uppercase font-display",
              isAdminView ? "text-red-500/60" : "text-olq-gold/60"
            )}>
              {isAdminView ? 'Level 5 Clearance' : 'Command Center'}
            </p>
          </div>
        )}
      </div>

      {/* XP Bar (user view only, expanded) */}
      {user && !collapsed && !isAdminView && (
        <div className="px-4 py-3 border-b border-olq-border">
          <XPBar />
        </div>
      )}

      {/* Admin badge (admin view only) */}
      {isAdminView && !collapsed && (
        <div className="px-4 py-3 border-b border-olq-border">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest font-display">Admin Active</span>
          </div>
        </div>
      )}

      {/* Nav Sections */}
      <nav className="flex-1 py-3 overflow-y-auto space-y-1">
        {sections.map((section) => (
          <div key={section.title} className="mb-2">
            {!collapsed && (
              <p className={cn(
                "px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] font-display",
                isAdminView && section.title === 'Admin HQ' ? "text-red-500/60" : "text-gray-600"
              )}>
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isAdminItem = item.id.startsWith('ADMIN');
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 w-full transition-all duration-200 rounded-lg mx-auto",
                    collapsed ? "justify-center p-2.5 mx-1 my-0.5" : "px-4 py-2.5 mx-2",
                    isActive
                      ? isAdminItem
                        ? "bg-red-500/10 text-red-400 border-r-2 border-red-500"
                        : "bg-olq-gold/10 text-olq-gold border-r-2 border-olq-gold"
                      : isAdminItem && isAdminView
                        ? "text-gray-500 hover:text-red-400 hover:bg-red-500/5"
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
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border",
              isAdmin ? "bg-red-500/10 border-red-500/20" : "bg-olq-gold/10 border-olq-gold/20"
            )}>
              {isAdmin
                ? <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                : <UserIcon className="w-3.5 h-3.5 text-olq-gold" />
              }
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn("text-[9px] font-mono truncate", isAdmin ? "text-red-400" : "text-olq-gold")}>
                {user.email || 'User'}
              </p>
              {isAdmin && <p className="text-[7px] font-bold text-red-500/60 uppercase tracking-widest">Admin</p>}
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
      <div className={cn(
        "lg:hidden flex items-center justify-between px-4 py-3 backdrop-blur-md border-b sticky top-0 z-50 print:hidden",
        isAdminView ? "bg-red-950/80 border-red-500/20" : "bg-olq-bg/80 border-olq-border"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center border",
            isAdminView ? "bg-red-500/20 border-red-500/30" : "bg-olq-olive border-olq-gold/20"
          )}>
            {isAdminView ? <ShieldAlert className="text-red-400 w-4 h-4" /> : <Shield className="text-olq-gold w-4 h-4" />}
          </div>
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider font-display",
            isAdminView ? "text-red-400" : "text-white"
          )}>
            {isAdminView ? 'Admin Panel' : 'SSB Engine'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {user && !isAdminView && <XPBar />}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "p-2 rounded-lg border",
              isAdminView
                ? "bg-red-500/10 border-red-500/20 text-red-400 hover:text-white"
                : "bg-olq-card border-olq-border text-gray-400 hover:text-white"
            )}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-64 border-r flex flex-col shadow-2xl z-50",
            isAdminView ? "bg-[#0d0a0a] border-red-500/20" : "bg-olq-bg border-olq-border"
          )}>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 border-r z-40 print:hidden transition-all duration-300 shadow-xl",
          collapsed ? "w-16" : "w-56",
          isAdminView ? "bg-[#0d0a0a] border-red-500/20" : "bg-olq-bg border-olq-border"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
