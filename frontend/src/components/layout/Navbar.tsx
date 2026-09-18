import React from 'react';
import { Moon, Shield, Bluetooth, Radio, Activity, BarChart2, Sparkles, BookOpen } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface NavbarProps {
  activeTab: 'dashboard' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'analytics') => void;
  onOpenUpgradeModal: () => void;
  onOpenManualModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpgradeModal,
  onOpenManualModal
}) => {
  const { bluetoothState, telemetry, isShieldEngaged } = useAudio();

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/5 px-4 sm:px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-celestial-indigo to-celestial-cyan shadow-lg shadow-celestial-indigo/20">
            <Moon className="w-5 h-5 text-white" />
            {isShieldEngaged && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-celestial-cyan">
                SlumberSync
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-celestial-cyan/20 text-celestial-cyan border border-celestial-cyan/30">
                Dual-Tier ANC
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI-Driven Adaptive Acoustic Shield & Isolation SaaS</p>
          </div>
        </div>

        {/* Live Status Badges */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-night-850/80 border border-white/5 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Room:</span>
            <span className="font-bold text-white">{telemetry.currentDb} dB</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              telemetry.status === 'QUIET' ? 'bg-emerald-500/20 text-emerald-400' :
              telemetry.status === 'MODERATE' ? 'bg-amber-500/20 text-amber-400' :
              'bg-rose-500/20 text-rose-400'
            }`}>
              {telemetry.status}
            </span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-night-850/80 border border-white/5 text-xs text-slate-300">
            {bluetoothState === 'TIER_A_HARDWARE_LOCKED' ? (
              <Bluetooth className="w-3.5 h-3.5 text-celestial-cyan animate-pulse" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-celestial-indigo" />
            )}
            <span>Mode:</span>
            <span className="font-bold text-celestial-cyan">
              {bluetoothState === 'TIER_A_HARDWARE_LOCKED' ? 'Tier A (Hardware ANC)' : 'Tier B (Speech Shield)'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero-Server Active (100% Free)</span>
          </div>
        </div>

        {/* Navigation, User Manual & Dorm Pass */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <nav className="flex items-center space-x-1 p-1 rounded-xl bg-night-900 border border-white/5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-celestial-indigo text-white shadow-lg shadow-celestial-indigo/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Shield</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-celestial-indigo text-white shadow-lg shadow-celestial-indigo/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* User Manual (PDF) Button */}
          <button
            onClick={onOpenManualModal}
            title="Download / View User Manual & Step-by-Step Directions"
            className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-night-850 hover:bg-night-800 border border-white/10 hover:border-celestial-cyan/40 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-celestial-cyan" />
            <span className="hidden md:inline">User Manual (PDF)</span>
            <span className="md:hidden">Manual</span>
          </button>

          {/* Dorm Pass */}
          <button
            onClick={onOpenUpgradeModal}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-celestial-indigo/20 to-celestial-cyan/20 hover:from-celestial-indigo/30 hover:to-celestial-cyan/30 border border-celestial-cyan/40 text-celestial-cyan text-xs font-bold transition-all shadow-md shadow-celestial-cyan/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dorm Pass</span>
            <span className="sm:hidden">Pro</span>
          </button>
        </div>
      </div>
    </header>
  );
};
