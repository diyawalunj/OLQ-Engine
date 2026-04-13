import React, { useState } from 'react';
import Header from './components/Header';
import AuthGuard from './components/AuthGuard';

import AIPracticeTab from './tabs/AIPracticeTab';
import ManualPracticeTab from './tabs/ManualPracticeTab';
import GrowthDashboard from './tabs/GrowthDashboard';
import ProfileTab from './tabs/ProfileTab';
import AdminPortal from './pages/AdminPortal';

export default function App() {
  const [currentTab, setTab] = useState('MANUAL');

  return (
    <AuthGuard>
      <div className="min-h-screen bg-olq-bg text-gray-300 flex flex-col selection:bg-olq-gold/30">
        <Header currentTab={currentTab} setTab={setTab} />
        
        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-8">
          {currentTab === 'MANUAL' && <ManualPracticeTab />}
          {currentTab === 'AI_PRACTICE' && <AIPracticeTab />}
          {currentTab === 'DASHBOARD' && <GrowthDashboard />}
          {currentTab === 'PROFILE' && <ProfileTab />}
          {currentTab === 'ADMIN' && <AdminPortal />}
        </div>
      </div>
    </AuthGuard>
  );
}
