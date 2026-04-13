import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthGuard from './components/AuthGuard';
import OnboardingFlow from './components/OnboardingFlow';

import RoadmapTab from './tabs/RoadmapTab';
import ManualPracticeTab from './tabs/ManualPracticeTab';
import OIRPracticeTab from './tabs/OIRPracticeTab';
import PPDTTab from './tabs/PPDTTab';
import SDTTab from './tabs/SDTTab';
import GTOTab from './tabs/GTOTab';
import AIPracticeTab from './tabs/AIPracticeTab';
import GrowthDashboard from './tabs/GrowthDashboard';
import LeaderboardTab from './tabs/LeaderboardTab';
import KnowledgeTab from './tabs/KnowledgeTab';
import ProfileTab from './tabs/ProfileTab';
import AdminPortal from './pages/AdminPortal';

import { useAuthStore } from './stores/authStore';
import { useOnboardingStore } from './stores/onboardingStore';
import { useGamificationStore } from './stores/gamificationStore';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentTab, setTab] = useState('ROADMAP');
  const { user } = useAuthStore();
  const { profile, isLoaded, loadProfile } = useOnboardingStore();
  const { load: loadGamification } = useGamificationStore();

  // Load user profile and gamification data when authenticated
  useEffect(() => {
    if (user) {
      loadProfile(user.uid);
      loadGamification(user.uid);
    }
  }, [user]);

  // Check if user needs onboarding
  const needsOnboarding = user && isLoaded && (!profile || !profile.onboardingComplete);
  const showLoadingProfile = user && !isLoaded;

  return (
    <AuthGuard>
      {showLoadingProfile ? (
        <div className="min-h-screen bg-olq-bg flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-olq-gold animate-spin" />
        </div>
      ) : needsOnboarding ? (
        <OnboardingFlow />
      ) : (
        <div className="min-h-screen bg-olq-bg text-gray-300 flex flex-col selection:bg-olq-gold/30">
          <Header currentTab={currentTab} setTab={setTab} />
          
          <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-8">
            {currentTab === 'ROADMAP' && <RoadmapTab />}
            {currentTab === 'MANUAL' && <ManualPracticeTab />}
            {currentTab === 'OIR' && <OIRPracticeTab />}
            {currentTab === 'PPDT' && <PPDTTab />}
            {currentTab === 'SDT' && <SDTTab />}
            {currentTab === 'GTO' && <GTOTab />}
            {currentTab === 'AI_PRACTICE' && <AIPracticeTab />}
            {currentTab === 'DASHBOARD' && <GrowthDashboard />}
            {currentTab === 'LEADERBOARD' && <LeaderboardTab />}
            {currentTab === 'KNOWLEDGE' && <KnowledgeTab />}
            {currentTab === 'PROFILE' && <ProfileTab />}
            {currentTab === 'ADMIN' && <AdminPortal />}
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
