import React from 'react';
import {
  X,
  Download,
  BookOpen,
  Bluetooth,
  Shield,
  Activity,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Sliders
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-10 max-h-[92vh] overflow-y-auto relative print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0 print:text-black print:bg-white">
        
        {/* Top Floating Actions (Hidden when printing to PDF) */}
        <div className="sticky top-0 z-30 flex items-center justify-between pb-4 mb-6 border-b border-white/10 bg-night-950/80 backdrop-blur-md print:hidden">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-celestial-cyan" />
            <span className="text-sm font-bold text-white">SlumberSync Official User Manual & Field Guide</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-celestial-cyan hover:bg-cyan-400 text-night-950 text-xs font-extrabold transition-all shadow-lg shadow-celestial-cyan/25 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PRINTABLE MANUAL DOCUMENT CONTENT */}
        {/* ============================================================ */}
        <div id="printable-user-manual" className="space-y-8 text-slate-200 print:text-neutral-900 print:bg-white">
          
          {/* Document Header */}
          <div className="pb-6 border-b border-white/10 print:border-neutral-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl font-black tracking-tight text-white print:text-neutral-950">
                    SlumberSync™
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-celestial-cyan/20 text-celestial-cyan border border-celestial-cyan/30 print:bg-neutral-100 print:text-neutral-800 print:border-neutral-300">
                    Dual-Tier ANC SaaS
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white print:text-neutral-900">
                  Comprehensive User Manual & Acoustic Operation Guide
                </h1>
                <p className="text-xs text-slate-400 print:text-neutral-600 mt-1">
                  Document Reference: <span className="font-mono">SS-MAN-2026-V2</span> • Classification: Public Consumer Guide
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-400 print:text-neutral-500">
                <p>System Version: <strong>v2.4 LTS</strong></p>
                <p>Hardware Tier: <strong>Tier A & B Dual-Support</strong></p>
                <p>Architecture: <strong>Zero-Sound Reactive Bandpass</strong></p>
              </div>
            </div>
          </div>

          {/* Section 1: Core System Architecture Overview */}
          <section className="space-y-3">
            <h2 className="text-base font-extrabold text-celestial-cyan print:text-neutral-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>1. System Architecture & Operation Philosophy</span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 print:text-neutral-700">
              SlumberSync is engineered around a fundamental sleep science principle: the human brain is not awoken by noise itself, but by sudden acoustic changes and intelligible speech formants. SlumberSync resolves this without subjecting the sleeper to fatiguing continuous white noise loops through a synchronized <strong>Dual-Tier Architecture</strong>:
            </p>

            {/* Architecture Diagram Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 print:grid-cols-2">
              <div className="p-4 rounded-2xl bg-night-900/90 border border-celestial-cyan/30 print:border-neutral-300 print:bg-neutral-50">
                <div className="flex items-center space-x-2 text-celestial-cyan print:text-neutral-900 font-bold text-xs mb-1">
                  <Bluetooth className="w-4 h-4" />
                  <span>TIER A: Hardware ANC Earbuds (BLE GATT)</span>
                </div>
                <p className="text-xs text-slate-300 print:text-neutral-600 leading-snug">
                  Connects to supported Bluetooth noise-cancelling earbuds (Sony, Apple, Bose, Anker) via Web Bluetooth API. Sends GATT vendor opcodes to lock hardware active noise cancellation ON throughout sleep.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-night-900/90 border border-celestial-indigo/30 print:border-neutral-300 print:bg-neutral-50">
                <div className="flex items-center space-x-2 text-celestial-indigo print:text-neutral-900 font-bold text-xs mb-1">
                  <Shield className="w-4 h-4" />
                  <span>TIER B: Standard Earbuds (Zero-Sound Shield)</span>
                </div>
                <p className="text-xs text-slate-300 print:text-neutral-600 leading-snug">
                  Maintains absolute silence (0 dB) during quiet hours. An on-device 250 Hz - 1.8 kHz speech-shielding bandpass filter activates in 50ms upon decibel spikes, fading back to silence in 400ms.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Visual UI Schematic & Control Map */}
          <section className="space-y-4">
            <h2 className="text-base font-extrabold text-celestial-cyan print:text-neutral-900 uppercase tracking-wider flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>2. Visual User Interface Schematic</span>
            </h2>
            <p className="text-xs text-slate-300 print:text-neutral-700">
              The illustration below outlines the core controls of the SlumberSync night dashboard:
            </p>

            {/* Embedded High-Fidelity UI Diagram (SVG Schematic) */}
            <div className="p-4 sm:p-6 rounded-2xl bg-night-950 border border-white/10 print:border-neutral-400 print:bg-white text-center">
              <svg className="w-full max-w-2xl mx-auto h-auto" viewBox="0 0 700 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Window Frame */}
                <rect x="10" y="10" width="680" height="300" rx="16" fill="#0b1120" stroke="#334155" strokeWidth="2" className="print:fill-neutral-50 print:stroke-neutral-300"/>
                
                {/* Header Bar */}
                <rect x="25" y="25" width="650" height="40" rx="8" fill="#1e293b" className="print:fill-neutral-200" />
                <circle cx="45" cy="45" r="7" fill="#6366f1"/>
                <text x="60" y="50" fill="#f8fafc" fontSize="13" fontWeight="bold" className="print:fill-neutral-900">SlumberSync Dashboard</text>
                <rect x="530" y="32" width="130" height="26" rx="6" fill="#06b6d4" fillOpacity="0.2" stroke="#06b6d4" strokeWidth="1"/>
                <text x="542" y="49" fill="#06b6d4" fontSize="11" fontWeight="bold" className="print:fill-neutral-800">● Tier B Armed (48dB)</text>

                {/* Left Card: 3D Celestial Acoustic Sphere */}
                <rect x="25" y="80" width="200" height="210" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" className="print:fill-neutral-100 print:stroke-neutral-300"/>
                <circle cx="125" cy="170" r="50" fill="#6366f1" fillOpacity="0.25" stroke="#818cf8" strokeWidth="2"/>
                <circle cx="125" cy="170" r="28" fill="#06b6d4" fillOpacity="0.3"/>
                <text x="50" y="105" fill="#e2e8f0" fontSize="11" fontWeight="bold" className="print:fill-neutral-900">3D Acoustic Sphere</text>
                <text x="45" y="245" fill="#94a3b8" fontSize="9" className="print:fill-neutral-600">Calm Breathing in Standby</text>
                <text x="42" y="260" fill="#06b6d4" fontSize="9" fontWeight="bold">Morphs on Roommate Spikes</text>

                {/* Center Card: Tier A Web Bluetooth Controller */}
                <rect x="240" y="80" width="205" height="210" rx="12" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.6" className="print:fill-neutral-100 print:stroke-neutral-300"/>
                <text x="255" y="105" fill="#06b6d4" fontSize="11" fontWeight="bold" className="print:fill-neutral-900">Tier A: Bluetooth ANC</text>
                <rect x="255" y="125" width="175" height="32" rx="6" fill="#1e293b" className="print:fill-neutral-200"/>
                <text x="268" y="145" fill="#94a3b8" fontSize="10">BLE Earbuds Paired: </text>
                <text x="365" y="145" fill="#10b981" fontSize="10" fontWeight="bold">LOCKED</text>
                <rect x="255" y="170" width="54" height="28" rx="6" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4"/>
                <text x="263" y="187" fill="#ffffff" fontSize="9" fontWeight="bold" className="print:fill-neutral-900">ANC ON</text>
                <rect x="315" y="170" width="54" height="28" rx="6" fill="#1e293b"/>
                <text x="323" y="187" fill="#94a3b8" fontSize="9">Awareness</text>
                <rect x="375" y="170" width="54" height="28" rx="6" fill="#1e293b"/>
                <text x="388" y="187" fill="#94a3b8" fontSize="9">Off</text>
                <text x="255" y="235" fill="#64748b" fontSize="9">Direct GATT lock command</text>
                <text x="255" y="250" fill="#64748b" fontSize="9">Zero sound latency needed</text>

                {/* Right Card: Tier B Dynamic Speech Shield */}
                <rect x="460" y="80" width="215" height="210" rx="12" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" className="print:fill-neutral-100 print:stroke-neutral-300"/>
                <text x="475" y="105" fill="#818cf8" fontSize="11" fontWeight="bold" className="print:fill-neutral-900">Tier B: Speech Shield</text>
                
                {/* Circular Meter graphic */}
                <circle cx="515" cy="165" r="32" stroke="#1e293b" strokeWidth="6" fill="none"/>
                <circle cx="515" cy="165" r="32" stroke="#10b981" strokeWidth="6" strokeDasharray="140" strokeDashoffset="45" fill="none"/>
                <text x="502" y="165" fill="#ffffff" fontSize="14" fontWeight="bold" className="print:fill-neutral-900">34</text>
                <text x="503" y="178" fill="#94a3b8" fontSize="8">dB SPL</text>

                {/* Sliders and specs */}
                <text x="560" y="145" fill="#e2e8f0" fontSize="10" fontWeight="bold" className="print:fill-neutral-900">Trigger: 48 dB</text>
                <rect x="560" y="155" width="100" height="4" rx="2" fill="#334155"/>
                <circle cx="610" cy="157" r="5" fill="#06b6d4"/>
                
                <rect x="475" y="215" width="185" height="30" rx="6" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1"/>
                <text x="488" y="234" fill="#34d399" fontSize="10" fontWeight="bold" className="print:fill-neutral-900">ZERO-SOUND STANDBY (0 dB)</text>
                <text x="475" y="265" fill="#64748b" fontSize="9">50ms Attack / 400ms Decay</text>
              </svg>
              <p className="text-[11px] text-slate-400 print:text-neutral-500 mt-2 font-mono">
                Figure 1: SlumberSync Nighttime Control Architecture & Decibel Processing Graph
              </p>
            </div>
          </section>

          {/* Section 3: Step-by-Step Operating Instructions */}
          <section className="space-y-4">
            <h2 className="text-base font-extrabold text-celestial-cyan print:text-neutral-900 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>3. Step-by-Step Operating Directions</span>
            </h2>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-night-900/80 border border-white/5 print:border-neutral-300 print:bg-white flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-celestial-cyan text-night-950 text-xs font-black flex-shrink-0">
                  1
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white print:text-neutral-900">
                    Connect Earbuds & Hardware Selection
                  </h3>
                  <p className="text-xs text-slate-300 print:text-neutral-600 mt-1 leading-relaxed">
                    Insert your sleep earbuds before getting into bed. If using <strong>ANC hardware</strong> (Sony, AirPods, Bose), click <strong>"Pair BLE Earbuds"</strong> to allow Web Bluetooth GATT connection and lock hardware noise cancellation ON. If using standard or wired earbuds, SlumberSync will automatically activate <strong>Tier B Software Acoustic Shield</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-night-900/80 border border-white/5 print:border-neutral-300 print:bg-white flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-celestial-cyan text-night-950 text-xs font-black flex-shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white print:text-neutral-900">
                    Set Decibel Activation Threshold (Default: 48 dB)
                  </h3>
                  <p className="text-xs text-slate-300 print:text-neutral-600 mt-1 leading-relaxed">
                    Observe the real-time circular decibel gauge in the Tier B card. Normal quiet bedroom background is 30 - 36 dB. Adjust the <strong>Activation Threshold Slider</strong>:
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-400 print:text-neutral-600 mt-1 space-y-0.5 ml-2">
                    <li><strong>40 – 45 dB:</strong> Sensitive (activates on soft whispers or distant footsteps).</li>
                    <li><strong>48 dB (Recommended):</strong> Balanced (activates on roommate talking, TV bleed, or laughter).</li>
                    <li><strong>52 – 65 dB:</strong> High tolerance (activates only on loud shouting or party music).</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-night-900/80 border border-white/5 print:border-neutral-300 print:bg-white flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-celestial-cyan text-night-950 text-xs font-black flex-shrink-0">
                  3
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white print:text-neutral-900">
                    Sleep Peacefully in Zero-Sound Standby
                  </h3>
                  <p className="text-xs text-slate-300 print:text-neutral-600 mt-1 leading-relaxed">
                    Unlike standard apps that play static noise all night, SlumberSync stays <strong>100% silent</strong> until an external disturbance occurs. When roommates speak or drop something, the 250 Hz - 1.8 kHz bandpass filter engages within 50ms to disguise vocal formants, and decays back to complete silence within 400ms once the room calms down.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-night-900/80 border border-white/5 print:border-neutral-300 print:bg-white flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-celestial-cyan text-night-950 text-xs font-black flex-shrink-0">
                  4
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white print:text-neutral-900">
                    Safety Sentinel & Emergency Alarm Bypass
                  </h3>
                  <p className="text-xs text-slate-300 print:text-neutral-600 mt-1 leading-relaxed">
                    The integrated harmonic analyzer samples 2.5 kHz - 4.0 kHz alarm frequencies. If a smoke detector, fire alarm, or morning wake-up alarm sounds, all active masking immediately drops to 0.0 dB to ensure emergency safety. You can test this at any time by clicking <strong>"Test Emergency Siren Bypass"</strong>.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-xl bg-night-900/80 border border-white/5 print:border-neutral-300 print:bg-white flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-celestial-cyan text-night-950 text-xs font-black flex-shrink-0">
                  5
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white print:text-neutral-900">
                    Morning Review & PostgreSQL Session Persistence
                  </h3>
                  <p className="text-xs text-slate-300 print:text-neutral-600 mt-1 leading-relaxed">
                    Upon waking up, navigate to the <strong>"Analytics"</strong> tab. Review the overnight Chart.js graph indicating exact timestamps of noise disruptions and shield engagements. Click <strong>"Persist Current Session"</strong> to record the night's telemetry to the PostgreSQL backend (POST /api/v1/sessions).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Technical Specifications & Performance Matrix */}
          <section className="space-y-3">
            <h2 className="text-base font-extrabold text-celestial-cyan print:text-neutral-900 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>4. Technical Specifications & Performance Parameters</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-white/10 print:border-neutral-300">
                <thead className="bg-night-900 print:bg-neutral-100 text-slate-300 print:text-neutral-800 font-bold">
                  <tr>
                    <th className="p-2.5 border-b border-white/10 print:border-neutral-300">Parameter</th>
                    <th className="p-2.5 border-b border-white/10 print:border-neutral-300">Specification</th>
                    <th className="p-2.5 border-b border-white/10 print:border-neutral-300">Engineering Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-neutral-200 text-slate-400 print:text-neutral-700">
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-neutral-900">Speech Masking Bandpass</td>
                    <td className="p-2.5 font-mono text-celestial-cyan print:text-neutral-800">250 Hz – 1,800 Hz</td>
                    <td className="p-2.5">Dissolves vowel formants & consonant intelligibility</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-neutral-900">Attack Velocity (Ramp-up)</td>
                    <td className="p-2.5 font-mono text-emerald-400 print:text-neutral-800">&lt; 50 ms</td>
                    <td className="p-2.5">Exponential gain rise before sound startles auditory cortex</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-neutral-900">Decay Velocity (Fade-out)</td>
                    <td className="p-2.5 font-mono text-slate-200 print:text-neutral-800">400 ms</td>
                    <td className="p-2.5">Smooth, unnoticeable transition back to pure silence</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-neutral-900">Emergency Siren Detector</td>
                    <td className="p-2.5 font-mono text-rose-400 print:text-neutral-800">2,500 Hz – 4,000 Hz</td>
                    <td className="p-2.5">Instant mute of active synthesis on alarm harmonics</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-neutral-900">Decibel Sampling Rate</td>
                    <td className="p-2.5 font-mono text-purple-400 print:text-neutral-800">150 ms intervals</td>
                    <td className="p-2.5">Continuous true RMS calculation via AnalyserNode</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5: Troubleshooting & FAQ */}
          <section className="space-y-3">
            <h2 className="text-base font-extrabold text-celestial-cyan print:text-neutral-900 uppercase tracking-wider flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>5. Troubleshooting & Frequently Asked Questions</span>
            </h2>

            <div className="space-y-2.5 text-xs text-slate-300 print:text-neutral-700">
              <div className="p-3 rounded-xl bg-night-900/60 border border-white/5 print:border-neutral-200">
                <p className="font-bold text-white print:text-neutral-900 mb-0.5">
                  Q: My Bluetooth earbuds aren't pairing via the "Pair BLE Earbuds" button?
                </p>
                <p className="text-slate-400 print:text-neutral-600">
                  <strong>A:</strong> Web Bluetooth requires a Chromium-based browser (Chrome, Edge, Opera, Brave) on desktop or Android. If using iOS Safari or an unexposed GATT profile, click <strong>"Simulate Tier A"</strong> or rely on <strong>Tier B Software Acoustic Shield</strong>, which works universally on all browsers with standard wired or wireless audio.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-night-900/60 border border-white/5 print:border-neutral-200">
                <p className="font-bold text-white print:text-neutral-900 mb-0.5">
                  Q: Why is the app silent when I turn it on?
                </p>
                <p className="text-slate-400 print:text-neutral-600">
                  <strong>A:</strong> This is intentional! SlumberSync is built on <em>Zero-Sound Standby</em>. As long as your room is quiet, gain is set to 0 dB. The speech-shielding bandpass only activates when room decibels spike past your threshold (e.g. 48 dB). If you prefer continuous sound, turn ON the <strong>"Sub-Audible Deep Hum Override"</strong> switch.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-night-900/60 border border-white/5 print:border-neutral-200">
                <p className="font-bold text-white print:text-neutral-900 mb-0.5">
                  Q: How do I export this manual to a physical PDF file?
                </p>
                <p className="text-slate-400 print:text-neutral-600">
                  <strong>A:</strong> Click the <strong>"Download / Save as PDF"</strong> button at the top of this dialog (or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Ctrl + P</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Cmd + P</kbd>). In the print destination dropdown, select <strong>"Save as PDF"</strong>. The print stylesheet is already pre-configured for crisp white A4/Letter rendering without background clutter.
                </p>
              </div>
            </div>
          </section>

          {/* Document Footer */}
          <div className="pt-6 border-t border-white/10 print:border-neutral-300 text-center text-xs text-slate-500 print:text-neutral-500">
            <p>© 2026 SlumberSync SaaS Inc. All rights reserved. Registered under Acoustic Health & Sleep Defense Standards.</p>
            <p className="mt-0.5">Support & Telemetry Gateway: <span className="font-mono">https://slumbersync.app/support</span></p>
          </div>

        </div>
      </div>
    </div>
  );
};
