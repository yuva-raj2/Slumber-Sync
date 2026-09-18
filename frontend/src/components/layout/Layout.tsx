import React from 'react';
import { Navbar } from './Navbar';
import { BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'analytics') => void;
  onOpenUpgradeModal: () => void;
  onOpenManualModal: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  onOpenUpgradeModal,
  onOpenManualModal
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-night-950 text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpgradeModal={onOpenUpgradeModal}
        onOpenManualModal={onOpenManualModal}
      />
      
      {/* Background ambient light effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-celestial-indigo/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-celestial-cyan/8 rounded-full blur-[120px]" />
      </div>

      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="relative z-10 py-6 border-t border-white/5 text-center text-xs text-slate-500 print:hidden flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 gap-2 w-full">
        <p>© 2026 SlumberSync SaaS. AI-Driven Adaptive Acoustic Shield & Smart Isolation.</p>
        <button
          onClick={onOpenManualModal}
          className="hover:text-celestial-cyan transition-colors flex items-center space-x-1 underline underline-offset-4"
        >
          <BookOpen className="w-3.5 h-3.5 mr-1" />
          <span>View / Download User Manual (PDF)</span>
        </button>
      </footer>
    </div>
  );
};
