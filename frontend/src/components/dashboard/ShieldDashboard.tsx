import React from 'react';
import {
  Bluetooth,
  Shield,
  VolumeX,
  Volume2,
  BellRing,
  AlertTriangle,
  Headphones,
  Zap
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const ShieldDashboard: React.FC = () => {
  const {
    bluetoothState,
    ancMode,
    connectedDeviceName,
    connectBluetooth,
    setAncMode,
    simulateBluetooth,
    disconnectBluetooth,
    telemetry,
    thresholdDb,
    setThresholdDb,
    isShieldEngaged,
    manualDeepHumEnabled,
    toggleManualDeepHum,
    emergencyAlertTriggered,
    dismissEmergencyAlert,
    simulateEmergencyAlarm,
    shieldEngagementCount,
  } = useAudio();

  const minDb = 25;
  const maxDb = 90;
  const percentage = Math.min(100, Math.max(0, ((telemetry.currentDb - minDb) / (maxDb - minDb)) * 100));
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;

  const isOverThreshold = telemetry.currentDb > thresholdDb;

  return (
    <div className="space-y-6">
      {/* Emergency Alarm Banner */}
      {emergencyAlertTriggered && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-200 flex items-center justify-between animate-pulse shadow-lg shadow-rose-500/10">
          <div className="flex items-center space-x-3">
            <BellRing className="w-6 h-6 text-rose-400 animate-bounce" />
            <div>
              <span className="text-sm font-bold block">EMERGENCY / MORNING ALARM DETECTED</span>
              <span className="text-xs text-rose-300">
                Acoustic shielding immediately muted to protect your safety and awareness.
              </span>
            </div>
          </div>
          <button
            onClick={dismissEmergencyAlert}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all shadow-md"
          >
            Acknowledge & Resume
          </button>
        </div>
      )}

      {/* Dual-Tier Architecture Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tier A: Hardware Bluetooth ANC Controller */}
        <div className="glass-panel-glow rounded-2xl p-6 border border-celestial-cyan/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-celestial-cyan/20 text-celestial-cyan border border-celestial-cyan/30">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">Tier A: Hardware ANC Device</h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-celestial-cyan/20 text-celestial-cyan border border-celestial-cyan/30">
                      GATT Lock
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Web Bluetooth BLE lock for supported ANC earbuds</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-xs">
                <span className={`w-2 h-2 rounded-full ${
                  bluetoothState === 'TIER_A_HARDWARE_LOCKED' ? 'bg-emerald-400 animate-pulse' :
                  bluetoothState === 'CONNECTING' ? 'bg-amber-400 animate-ping' : 'bg-slate-500'
                }`} />
                <span className="font-semibold text-slate-300">
                  {bluetoothState === 'TIER_A_HARDWARE_LOCKED' ? 'Locked' :
                   bluetoothState === 'CONNECTING' ? 'Connecting...' :
                   bluetoothState === 'TIER_B_SOFTWARE_SHIELD' ? 'Software Mode' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Connection Status Card */}
            <div className="py-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-night-900/80 border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Headphones className="w-5 h-5 text-celestial-cyan" />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {connectedDeviceName || 'No BLE ANC Device Paired'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {bluetoothState === 'TIER_A_HARDWARE_LOCKED'
                        ? 'Hardware Noise Cancellation Locked Active'
                        : 'Using Tier B Dynamic Acoustic Shield'}
                    </span>
                  </div>
                </div>

                {bluetoothState === 'TIER_A_HARDWARE_LOCKED' ? (
                  <button
                    onClick={disconnectBluetooth}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-all"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={connectBluetooth}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-celestial-cyan/20 hover:bg-celestial-cyan/30 text-celestial-cyan border border-celestial-cyan/40 text-xs font-bold transition-all shadow-sm"
                  >
                    <Bluetooth className="w-3.5 h-3.5" />
                    <span>Pair BLE Earbuds</span>
                  </button>
                )}
              </div>

              {/* Hardware ANC Mode Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
                  Hardware Isolation Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAncMode('ANC_ON')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      ancMode === 'ANC_ON'
                        ? 'bg-celestial-cyan/20 border-celestial-cyan/60 text-white shadow-md shadow-celestial-cyan/15'
                        : 'bg-night-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    ANC Locked ON
                  </button>
                  <button
                    onClick={() => setAncMode('TRANSPARENCY')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      ancMode === 'TRANSPARENCY'
                        ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-md shadow-amber-500/15'
                        : 'bg-night-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Awareness
                  </button>
                  <button
                    onClick={() => setAncMode('OFF')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      ancMode === 'OFF'
                        ? 'bg-slate-700/40 border-slate-500 text-white'
                        : 'bg-night-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Passive Off
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fallback Simulation Selector */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Simulator Testing:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => simulateBluetooth('TIER_A')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-celestial-cyan text-[11px] font-semibold border border-white/5"
              >
                Simulate Tier A
              </button>
              <button
                onClick={() => simulateBluetooth('TIER_B')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold border border-white/5"
              >
                Simulate Tier B
              </button>
            </div>
          </div>
        </div>

        {/* Tier B: Dynamic Speech Shield & Decibel Meter */}
        <div className="glass-panel-glow rounded-2xl p-6 border border-celestial-indigo/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-celestial-indigo/20 text-celestial-indigo border border-celestial-indigo/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">Tier B: Dynamic Speech Shield</h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-celestial-indigo/20 text-celestial-indigo border border-celestial-indigo/30">
                      Standard Earbuds
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Zero-Sound standby until room noise crosses threshold</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 ${
                isShieldEngaged
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isShieldEngaged ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-rose-400" />
                    <span>SHIELD ENGAGED (250Hz-1.8kHz)</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ZERO-SOUND STANDBY (0 dB)</span>
                  </>
                )}
              </div>
            </div>

            {/* Gauge & Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-around py-4 gap-4">
              {/* Circular dB Gauge */}
              <div className="relative flex items-center justify-center w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-slate-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={isOverThreshold ? '#f43f5e' : '#10b981'}
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-150 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-white">{telemetry.currentDb}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">dB SPL</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Threshold: {thresholdDb} dB</span>
                </div>
              </div>

              {/* Threshold Slider & Telemetry */}
              <div className="flex flex-col space-y-3 w-full sm:w-60">
                <div className="p-3 rounded-xl bg-night-900/80 border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">Activation Threshold</span>
                    <span className="font-bold text-celestial-cyan">{thresholdDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="65"
                    step="1"
                    value={thresholdDb}
                    onChange={(e) => setThresholdDb(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-night-800 rounded-lg appearance-none cursor-pointer accent-celestial-cyan"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Sensitive (40 dB)</span>
                    <span>Relaxed (65 dB)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-night-900/80 border border-white/5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Shield Activations Tonight</span>
                    <span className="text-lg font-bold text-white">{shieldEngagementCount} spikes</span>
                  </div>
                  <Shield className="w-5 h-5 text-celestial-indigo" />
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Audible Deep Hum Manual Override */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Sub-Audible Deep Hum Override</span>
                <span className="text-[10px] text-slate-400">Continuous 40Hz pink hum instead of pure silence</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={manualDeepHumEnabled}
                onChange={toggleManualDeepHum}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-night-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-celestial-indigo"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Emergency Bypass Test Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <BellRing className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <strong className="text-slate-200">Emergency Bypass Sentinel Active:</strong> Harmonic analyzer actively
            listens for 2.5–4.0 kHz sirens and morning alarms to instantly silence masking.
          </div>
        </div>

        <button
          onClick={simulateEmergencyAlarm}
          className="px-3.5 py-1.5 rounded-xl bg-night-900 hover:bg-night-800 border border-white/10 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Test Emergency Siren Bypass</span>
        </button>
      </div>
    </div>
  );
};
