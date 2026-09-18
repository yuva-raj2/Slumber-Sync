import { SleepSession, AudioPreset } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? (import.meta.env.VITE_API_URL as string).replace(/\/$/, '') : '') + '/api/v1';

const PRESETS_STORAGE_KEY = 'slumber_presets';
const SESSIONS_STORAGE_KEY = 'slumber_sessions';

const DEFAULT_PRESETS: AudioPreset[] = [
  {
    id: 1,
    name: "Roommate Speech Bandpass Shield",
    thresholdDb: 48.0,
    maskingFrequencyBand: "SPEECH_BANDPASS_250_1800HZ",
    subAudibleHumEnabled: false,
    isDefault: true,
  },
  {
    id: 2,
    name: "Deep Sub-Bass & Footstep Barrier",
    thresholdDb: 45.0,
    maskingFrequencyBand: "SUB_BASS_75HZ",
    subAudibleHumEnabled: true,
    isDefault: false,
  },
  {
    id: 3,
    name: "Urban High-Traffic Broadband",
    thresholdDb: 52.0,
    maskingFrequencyBand: "BROADBAND",
    subAudibleHumEnabled: false,
    isDefault: false,
  }
];

const DEFAULT_SESSIONS: SleepSession[] = [
  {
    id: 1,
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 28800000).toISOString(),
    avgDecibels: 34.8,
    maxDecibelSpike: 68.4,
    disturbancesShieldedCount: 8,
    hardwareModeUsed: "TIER_A_ANC",
    sleepQualityScore: 94,
  },
  {
    id: 2,
    startTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 2 + 27000000).toISOString(),
    avgDecibels: 37.2,
    maxDecibelSpike: 74.1,
    disturbancesShieldedCount: 14,
    hardwareModeUsed: "TIER_B_SOFTWARE_SHIELD",
    sleepQualityScore: 86,
  },
  {
    id: 3,
    startTime: new Date(Date.now() - 86400000 * 3).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 3 + 29520000).toISOString(),
    avgDecibels: 32.5,
    maxDecibelSpike: 49.2,
    disturbancesShieldedCount: 2,
    hardwareModeUsed: "HYBRID",
    sleepQualityScore: 98,
  }
];

export const apiService = {
  // Dual-Tier Presets (Offline-First / Autonomous)
  async getPresets(): Promise<AudioPreset[]> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await fetch(`${API_BASE}/presets`);
        if (res.ok) {
          const presets = await res.json();
          localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
          return presets;
        }
      } catch (err) {
        console.info('Cloud backend unavailable, using local client storage:', err);
      }
    }

    try {
      const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore JSON parse error
    }

    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(DEFAULT_PRESETS));
    return DEFAULT_PRESETS;
  },

  async savePreset(preset: Partial<AudioPreset>): Promise<AudioPreset> {
    const current = await this.getPresets();
    const newPreset: AudioPreset = {
      id: preset.id || Date.now(),
      name: preset.name || "Custom Acoustic Shield",
      thresholdDb: preset.thresholdDb ?? 48.0,
      maskingFrequencyBand: preset.maskingFrequencyBand || "SPEECH_BANDPASS_250_1800HZ",
      subAudibleHumEnabled: preset.subAudibleHumEnabled ?? false,
      isDefault: false,
    };

    const updated = [newPreset, ...current.filter(p => p.id !== newPreset.id)];
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));

    if (import.meta.env.VITE_API_URL) {
      fetch(`${API_BASE}/presets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreset),
      }).catch(err => console.warn('Background preset sync failed:', err));
    }

    return newPreset;
  },

  // Sessions & Telemetry (Offline-First / Autonomous)
  async getSessionHistory(): Promise<SleepSession[]> {
    if (import.meta.env.VITE_API_URL) {
      try {
        const res = await fetch(`${API_BASE}/sessions/history`);
        if (res.ok) {
          const sessions = await res.json();
          localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
          return sessions;
        }
      } catch (err) {
        console.info('Cloud backend unreachable, reading local session telemetry:', err);
      }
    }

    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_SESSIONS));
    return DEFAULT_SESSIONS;
  },

  async persistSession(session: Partial<SleepSession>): Promise<SleepSession> {
    const disturbances = session.disturbancesShieldedCount || 0;
    const avgDb = session.avgDecibels || 35.0;
    const calculatedScore = Math.max(40, Math.min(100, Math.round(100 - (disturbances * 2) - Math.max(0, avgDb - 35) * 1.5)));

    const newSession: SleepSession = {
      id: session.id || Date.now(),
      startTime: session.startTime || new Date().toISOString(),
      endTime: session.endTime || new Date().toISOString(),
      avgDecibels: avgDb,
      maxDecibelSpike: session.maxDecibelSpike || 52.0,
      disturbancesShieldedCount: disturbances,
      hardwareModeUsed: session.hardwareModeUsed || "TIER_B_SOFTWARE_SHIELD",
      sleepQualityScore: session.sleepQualityScore ?? calculatedScore,
    };

    try {
      const current = await this.getSessionHistory();
      const updated = [newSession, ...current];
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
    } catch {
      // ignore storage error
    }

    if (import.meta.env.VITE_API_URL) {
      fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      }).catch(err => console.warn('Background telemetry sync skipped:', err));
    }

    return newSession;
  }
};
