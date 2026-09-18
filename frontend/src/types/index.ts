// Web Bluetooth ambient declarations
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: any): Promise<any>;
    };
  }
}

export type BluetoothDevice = any;
export type BluetoothRemoteGATTServer = any;
export type BluetoothRemoteGATTCharacteristic = any;

export type HardwareMode = 'TIER_A_ANC' | 'TIER_B_SOFTWARE_SHIELD' | 'HYBRID';

export type BluetoothConnectionState = 
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'TIER_A_HARDWARE_LOCKED'
  | 'TIER_B_SOFTWARE_SHIELD';

export type AncMode = 'ANC_ON' | 'TRANSPARENCY' | 'OFF';

export type AmbientStatus = 'QUIET' | 'MODERATE' | 'DISRUPTIVE';

export type NoiseColor = 'BROWN' | 'PINK' | 'WHITE';

export type IncidentType = 'BASS_TRANSIENT' | 'VOCAL_CHATTER' | 'SHARP_IMPACT' | 'SUSTAINED_PARTY';

export interface AudioPreset {
  id?: number;
  name: string;
  thresholdDb: number;
  maskingFrequencyBand: string; // SPEECH_BANDPASS_250_1800HZ, SUB_BASS_75HZ, BROADBAND
  subAudibleHumEnabled: boolean;
  isDefault?: boolean;
  // Optional / backward compatibility
  noiseColor?: NoiseColor;
  baseVolume?: number;
  sensitivityThresholdDb?: number;
  description?: string;
}

export interface NoiseIncident {
  id?: number;
  sessionId?: string;
  timestamp: string;
  decibelLevel: number;
  durationSeconds: number;
  incidentType: IncidentType;
  actionTaken: string;
}

export interface SleepSession {
  id?: number;
  sessionId?: string;
  startTime: string;
  endTime?: string;
  avgDecibels: number;
  maxDecibelSpike: number;
  disturbancesShieldedCount: number;
  hardwareModeUsed: HardwareMode;
  sleepQualityScore?: number;
  createdAt?: string;
  // Backward compatibility
  averageDecibelLevel?: number;
  peakDecibelLevel?: number;
  disturbancesDetected?: number;
  noiseType?: string;
}

export interface DecibelTelemetry {
  currentDb: number;
  peakDb: number;
  rawRms: number;
  status: AmbientStatus;
  timestamp: number;
  shieldActive: boolean;
}

export interface ShieldTelemetryPoint {
  timeLabel: string;
  ambientDb: number;
  shieldEngaged: boolean;
  shieldLevel: number;
}

export interface RoommateReport {
  sessionId: string;
  startTime: string;
  endTime: string;
  averageDecibels: number;
  peakDecibels: number;
  whoGuidelineThresholdDb: number;
  decibelsOverGuideline: number;
  totalDisturbances: number;
  quietHoursViolations: number;
  sleepQualityScore: number;
  impactSeverity: 'MILD' | 'MODERATE' | 'SEVERE';
  executiveSummary: string;
  incidents: NoiseIncident[];
}

export interface CloakingState {
  vocalCloakingEnabled: boolean;
  bassBarrierEnabled: boolean;
  binauralBeatsEnabled: boolean;
  binauralVolume: number;
  alarmSentinelActive: boolean;
  alarmPassthroughTriggered: boolean;
}
