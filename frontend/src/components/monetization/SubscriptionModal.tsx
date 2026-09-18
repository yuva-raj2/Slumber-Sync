import React from 'react';
import { X, Check, Sparkles, GraduationCap, Crown, ShieldCheck } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-md mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-celestial-cyan/20 border border-celestial-cyan/30 text-celestial-cyan text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Roommate Acoustic Defense</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sleep Soundly in Any Dorm or Shared Flat
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Unlock AI Vocal & Beat Cloaking, 3Hz Binaural Delta Waves, and exportable Acoustic Reports.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Plan 1: Dorm Pass */}
          <div className="p-6 rounded-2xl bg-night-900/90 border border-celestial-indigo/40 hover:border-celestial-indigo/70 transition-all flex flex-col justify-between relative group">
            <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-celestial-indigo text-[10px] font-bold uppercase text-white shadow-md">
              Most Popular in Dorms
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <GraduationCap className="w-5 h-5 text-celestial-indigo" />
                <h3 className="text-lg font-bold text-white">Student Dorm Pass</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Tailored for college students & shared roommate spaces.
              </p>

              <div className="flex items-baseline space-x-1 mb-6">
                <span className="text-3xl font-extrabold text-white">$3.99</span>
                <span className="text-xs text-slate-400">/ month</span>
                <span className="text-[10px] text-emerald-400 font-semibold ml-2">(Save 40% with .edu)</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Real-Time Vocal Formant Cloaking</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Sub-Bass Barrier (Speaker & Kickdrum)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Stereo 3Hz Binaural Delta Sleep Waves</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Exportable Roommate Decibel Reports</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-celestial-indigo hover:bg-indigo-600 text-white font-semibold text-xs transition-all shadow-lg shadow-celestial-indigo/25"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Plan 2: Slumber Pro */}
          <div className="p-6 rounded-2xl bg-night-900/90 border border-celestial-cyan/40 hover:border-celestial-cyan/70 transition-all flex flex-col justify-between relative group">
            <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-celestial-cyan text-[10px] font-bold uppercase text-night-950 shadow-md">
              Full Acoustic Suite
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-celestial-cyan" />
                <h3 className="text-lg font-bold text-white">Slumber Pro</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                For city apartments, heavy sleepers & multi-device sentries.
              </p>

              <div className="flex items-baseline space-x-1 mb-6">
                <span className="text-3xl font-extrabold text-white">$6.99</span>
                <span className="text-xs text-slate-400">/ month</span>
                <span className="text-[10px] text-slate-400 ml-2">or $49 billed annually</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-celestial-cyan flex-shrink-0" />
                  <span>Everything in Student Dorm Pass</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-celestial-cyan flex-shrink-0" />
                  <span>Multi-Device "Door Sentry" Sync (WebSockets)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-celestial-cyan flex-shrink-0" />
                  <span>Generative "Music-to-Rain" AI Camouflage</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-celestial-cyan flex-shrink-0" />
                  <span>Lifetime Historical PostgreSQL Cloud Telemetry</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-celestial-cyan to-celestial-indigo text-night-950 font-bold text-xs transition-all shadow-lg shadow-celestial-cyan/20"
            >
              Get Slumber Pro
            </button>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="p-3.5 rounded-xl bg-night-850 border border-white/5 flex items-center justify-center space-x-2 text-center text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>No hardware needed • Works with any Bluetooth earbuds, AirPods, or wired headphones.</span>
        </div>
      </div>
    </div>
  );
};
