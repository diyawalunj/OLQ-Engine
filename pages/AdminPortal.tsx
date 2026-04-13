import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ShieldAlert, Database, UploadCloud, Users, LayoutDashboard, Settings, Activity } from 'lucide-react';
import { cn } from '../utils';

export default function AdminPortal() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'DATASETS' | 'USERS' | 'ANALYTICS'>('DATASETS');

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-500/10 border border-red-500/30 rounded-xl animate-in zoom-in duration-500">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h2 className="text-3xl font-bold text-white uppercase tracking-widest font-display mb-2">Access Denied</h2>
        <p className="text-red-400 font-mono text-sm max-w-md text-center">Your biometric or clearance level is insufficient to access the Pro Admin Headquarters. Disconnect immediately.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 w-full max-w-[1600px] mx-auto pb-12">
      
      {/* Header Widget */}
      <div className="bg-olq-card border border-olq-gold/40 rounded-xl p-6 sm:p-10 shadow-[0_0_30px_rgba(197,160,89,0.15)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-olq-gold/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="z-10 w-full md:w-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-olq-gold/10 border border-olq-gold/30 rounded-full text-[10px] font-bold text-olq-gold uppercase tracking-[0.2em] font-display mb-4">
            <ShieldAlert className="w-3 h-3" /> Level 5 Clearance
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-widest font-display mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            Command Center
          </h2>
          <p className="text-sm text-olq-gold/80 italic max-w-xl">
            "Control the narrative. Shape the selection. Manage the psychological parameters."
          </p>
        </div>

        <div className="flex gap-4 relative z-10 w-full md:w-auto shrink-0 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'DATASETS', icon: Database, label: 'Protocols' },
            { id: 'USERS', icon: Users, label: 'Candidates' },
            { id: 'ANALYTICS', icon: Activity, label: 'Telemetry' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border min-w-[100px] transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-olq-gold text-olq-bg border-olq-gold shadow-[0_0_20px_rgba(197,160,89,0.5)] scale-105" 
                  : "bg-olq-bg border-olq-border text-gray-500 hover:text-olq-gold hover:border-olq-gold/50"
              )}
            >
              <tab.icon className="w-6 h-6 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 min-w-0">
        
        {/* Sidebar Status (Always visible) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-olq-card border border-olq-border rounded-xl p-6 shadow-sm">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] font-display mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-olq-border/50 pb-3">
                <span className="text-xs text-gray-500 uppercase tracking-widest">AI Engine</span>
                <span className="text-xs font-bold text-olq-green flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-olq-green rounded-full shadow-[0_0_8px_rgba(132,141,98,0.8)]" /> Online</span>
              </div>
              <div className="flex items-center justify-between border-b border-olq-border/50 pb-3">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Active Candidates</span>
                <span className="text-xs font-bold text-white font-mono">142</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Global Readiness</span>
                <span className="text-xs font-bold text-olq-gold font-mono">68%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-2">
          {activeTab === 'DATASETS' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-olq-card border border-olq-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] font-display flex items-center gap-2">
                    <Database className="w-4 h-4 text-olq-gold" />
                    Dataset Management
                  </h3>
                  <button className="px-4 py-2 bg-olq-olive text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(61,68,30,0.4)] border border-olq-gold/20 hover:border-olq-gold hover:bg-olq-olive/90 transition-all">
                     Push Updates
                  </button>
                </div>

                <div className="space-y-6">
                  {/* TAT Image Upload Mock */}
                  <div className="border border-olq-border rounded-lg p-5 bg-olq-bg/50">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">TAT Stimulus Library</h4>
                    <div className="border-2 border-dashed border-olq-border rounded-lg h-32 flex flex-col items-center justify-center gap-2 hover:border-olq-gold/40 hover:bg-olq-gold/5 transition-all cursor-pointer group">
                      <UploadCloud className="w-8 h-8 text-gray-600 group-hover:text-olq-gold/60 transition-colors" />
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-olq-gold/80 transition-colors">Upload New Image Matrix</span>
                    </div>
                  </div>

                  {/* WAT Dictionary Mock */}
                  <div className="border border-olq-border rounded-lg p-5 bg-olq-bg/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">WAT Dictionary</h4>
                      <span className="text-[10px] text-gray-500 font-mono">Total: 450 Words</span>
                    </div>
                    <textarea 
                      className="w-full bg-olq-bg border border-olq-border rounded-lg p-4 text-xs font-mono text-gray-400 focus:outline-none focus:border-olq-gold/50 transition-colors h-32 resize-none leading-relaxed"
                      defaultValue={"Courage, Determination, Fear, Family, Duty, Sacrifice...\n\n// Manage comma separated lists of words here. Will sync with Firebase."}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="bg-olq-card border border-olq-border rounded-xl p-6 flex items-center justify-center h-full min-h-[400px] animate-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest font-display mb-2">Candidate Ledger Offline</h3>
                <p className="text-xs text-gray-500">Awaiting Firebase Firestore implementation for user management.</p>
              </div>
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="bg-olq-card border border-olq-border rounded-xl p-6 flex items-center justify-center h-full min-h-[400px] animate-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest font-display mb-2">Global Telemetry Offline</h3>
                <p className="text-xs text-gray-500">Awaiting aggregation pipelines for platform-wide analytics.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
