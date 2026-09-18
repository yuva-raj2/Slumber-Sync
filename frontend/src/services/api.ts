import { SleepSession, AudioPreset } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? (import.meta.env.VITE_API_URL as string).replace(/\/$/, '') : '') + '/api/v1';

export const apiService = {
  // Dual-Tier Presets
  async getPresets(): Promise<AudioPreset[]> {
    try {
      const res = await fetch(`${API_BASE}/presets`);
      if (!res.ok) throw new Error(`Failed to fetch presets: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using default presets:', err);
      return [
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
    }
  },

  async savePreset(preset: Partial<AudioPreset>): Promise<AudioPreset> {
    const res = await fetch(`${API_BASE}/presets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preset),
    });
    if (!res.ok) throw new Error('Failed to create preset');
    return await res.json();
  },

  // Sessions & Telemetry
  async getSessionHistory(): Promise<SleepSession[]> {
    try {
      const res = await fetch(`${API_BASE}/sessions/history`);
      if (!res.ok) throw new Error(`Failed to fetch history: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend unreachable, using simulated session history:', err);
      return [
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
    }
  },

  async persistSession(session: Partial<SleepSession>): Promise<SleepSession> {
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
      if (!res.ok) throw new Error('Failed to persist session');
      return await res.json();
    } catch (err) {
      console.warn('Failed to save to PostgreSQL backend:', err);
      return {
        id: Date.now(),
        startTime: session.startTime || new Date().toISOString(),
        endTime: session.endTime || new Date().toISOString(),
        avgDecibels: session.avgDecibels || 35.0,
        maxDecibelSpike: session.maxDecibelSpike || 50.0,
        disturbancesShieldedCount: session.disturbancesShieldedCount || 0,
        hardwareModeUsed: session.hardwareModeUsed || "TIER_B_SOFTWARE_SHIELD",
      };
    }
  }
};
