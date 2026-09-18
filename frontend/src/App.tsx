import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { SleepScene } from './components/canvas/SleepScene';
import { ShieldDashboard } from './components/dashboard/ShieldDashboard';
import { SleepAnalytics } from './components/analytics/SleepAnalytics';
import { SubscriptionModal } from './components/monetization/SubscriptionModal';
import { UserManualModal } from './components/manual/UserManualModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState(false);

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
      onOpenManualModal={() => setIsUserManualOpen(true)}
    >
      {activeTab === 'dashboard' ? (
        <div className="space-y-6">
          {/* Hero Header & 3D Celestial Acoustic Sphere */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Smart Acoustic Isolation Shield
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Dual-tier sleep protection: Web Bluetooth hardware ANC lock & zero-sound dynamic speech masking.
                </p>
              </div>
            </div>

            {/* 3D Celestial Sphere */}
            <SleepScene />
          </div>

          {/* Dual-Tier Shield Dashboard */}
          <ShieldDashboard />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Overnight Telemetry & Shield History
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Noise disturbance spikes, shield activation durations, and PostgreSQL session history.
            </p>
          </div>

          <SleepAnalytics />
        </div>
      )}

      {/* SaaS Dorm Pass / Subscription Modal */}
      <SubscriptionModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      {/* Official User Manual & Field Guide Modal (with PDF Download/Print) */}
      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
      />
    </Layout>
  );
};

export default App;
