import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { audioShieldEngine } from '../services/audioEngine';
import { bluetoothManager } from '../services/bluetoothService';
import {
  BluetoothConnectionState,
  AncMode,
  DecibelTelemetry,
  AudioPreset
} from '../types';

interface AudioContextValue {
  // Bluetooth Tier A State
  bluetoothState: BluetoothConnectionState;
  ancMode: AncMode;
  connectedDeviceName: string | null;
  isBluetoothSupported: boolean;
  connectBluetooth: () => Promise<boolean>;
  setAncMode: (mode: AncMode) => Promise<void>;
  simulateBluetooth: (tier: 'TIER_A' | 'TIER_B') => void;
  disconnectBluetooth: () => void;

  // Tier B Audio Shield State
  telemetry: DecibelTelemetry;
  thresholdDb: number;
  setThresholdDb: (db: number) => void;
  isStandbyMode: boolean;
  isShieldEngaged: boolean;
  isMonitoring: boolean;
  manualDeepHumEnabled: boolean;
  toggleManualDeepHum: () => void;
  toggleMonitoring: () => Promise<void>;

  // Emergency Bypass
  emergencyAlertTriggered: boolean;
  dismissEmergencyAlert: () => void;
  simulateEmergencyAlarm: () => void;

  // Stats & Presets
  shieldEngagementCount: number;
  selectedPresetId: number | null;
  applyPreset: (preset: AudioPreset) => void;
}

const defaultTelemetry: DecibelTelemetry = {
  currentDb: 34,
  peakDb: 36,
  rawRms: 0.01,
  status: 'QUIET',
  timestamp: Date.now(),
  shieldActive: false,
};

const AudioContext = createContext<AudioContextValue | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Bluetooth Tier A
  const [bluetoothState, setBluetoothState] = useState<BluetoothConnectionState>('DISCONNECTED');
  const [ancMode, setAncModeState] = useState<AncMode>('OFF');
  const [connectedDeviceName, setConnectedDeviceName] = useState<string | null>(null);

  // Audio Shield Tier B
  const [telemetry, setTelemetry] = useState<DecibelTelemetry>(defaultTelemetry);
  const [thresholdDb, setThresholdDbState] = useState<number>(48.0);
  const [isStandbyMode, setIsStandbyMode] = useState<boolean>(true);
  const [isShieldEngaged, setIsShieldEngaged] = useState<boolean>(false);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [manualDeepHumEnabled, setManualDeepHumEnabled] = useState<boolean>(false);
  const [shieldEngagementCount, setShieldEngagementCount] = useState<number>(0);
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(1);

  // Emergency
  const [emergencyAlertTriggered, setEmergencyAlertTriggered] = useState<boolean>(false);

  // Initialize Bluetooth listeners
  useEffect(() => {
    bluetoothManager.onStateChange((state, deviceName) => {
      setBluetoothState(state);
      if (deviceName) setConnectedDeviceName(deviceName);
      if (state === 'DISCONNECTED') setConnectedDeviceName(null);
    });

    bluetoothManager.onAncModeChange((mode) => {
      setAncModeState(mode);
    });
  }, []);

  const connectBluetooth = useCallback(async () => {
    return await bluetoothManager.requestHardwareDevice();
  }, []);

  const setAncMode = useCallback(async (mode: AncMode) => {
    await bluetoothManager.lockHardwareAnc(mode);
    setAncModeState(mode);
  }, []);

  const simulateBluetooth = useCallback((tier: 'TIER_A' | 'TIER_B') => {
    bluetoothManager.simulateHardwareConnection(tier);
  }, []);

  const disconnectBluetooth = useCallback(() => {
    bluetoothManager.disconnect();
  }, []);

  // Audio Engine threshold
  const setThresholdDb = useCallback((db: number) => {
    setThresholdDbState(db);
    audioShieldEngine.setThresholdDb(db);
  }, []);

  const toggleManualDeepHum = useCallback(() => {
    setManualDeepHumEnabled((prev) => {
      const next = !prev;
      audioShieldEngine.setManualDeepHum(next);
      setIsStandbyMode(!next && !isShieldEngaged);
      return next;
    });
  }, [isShieldEngaged]);

  const dismissEmergencyAlert = useCallback(() => {
    audioShieldEngine.dismissEmergencyBypass();
    setEmergencyAlertTriggered(false);
  }, []);

  const simulateEmergencyAlarm = useCallback(() => {
    audioShieldEngine.triggerEmergencyBypass();
    setEmergencyAlertTriggered(true);
  }, []);

  const toggleMonitoring = useCallback(async () => {
    if (isMonitoring) {
      audioShieldEngine.stopAmbientDecibelMonitor();
      setIsMonitoring(false);
      setIsShieldEngaged(false);
      setIsStandbyMode(true);
    } else {
      await audioShieldEngine.startAmbientDecibelMonitor(
        (data) => setTelemetry(data),
        (engaged) => {
          setIsShieldEngaged(engaged);
          setIsStandbyMode(!engaged && !manualDeepHumEnabled);
          if (engaged) {
            setShieldEngagementCount((prev) => prev + 1);
          }
        },
        (alarmDetected) => {
          setEmergencyAlertTriggered(alarmDetected);
        }
      );
      setIsMonitoring(true);
    }
  }, [isMonitoring, manualDeepHumEnabled]);

  const applyPreset = useCallback((preset: AudioPreset) => {
    if (preset.id) setSelectedPresetId(preset.id);
    setThresholdDbState(preset.thresholdDb);
    audioShieldEngine.setThresholdDb(preset.thresholdDb);
    setManualDeepHumEnabled(preset.subAudibleHumEnabled);
    audioShieldEngine.setManualDeepHum(preset.subAudibleHumEnabled);
  }, []);

  // Auto-start ambient monitor on load
  useEffect(() => {
    audioShieldEngine.startAmbientDecibelMonitor(
      (data) => setTelemetry(data),
      (engaged) => {
        setIsShieldEngaged(engaged);
        setIsStandbyMode(!engaged);
        if (engaged) {
          setShieldEngagementCount((prev) => prev + 1);
        }
      },
      (alarmDetected) => {
        setEmergencyAlertTriggered(alarmDetected);
      }
    );
    setIsMonitoring(true);

    return () => {
      audioShieldEngine.stopAmbientDecibelMonitor();
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        bluetoothState,
        ancMode,
        connectedDeviceName,
        isBluetoothSupported: bluetoothManager.isSupported(),
        connectBluetooth,
        setAncMode,
        simulateBluetooth,
        disconnectBluetooth,
        telemetry,
        thresholdDb,
        setThresholdDb,
        isStandbyMode,
        isShieldEngaged,
        isMonitoring,
        manualDeepHumEnabled,
        toggleManualDeepHum,
        toggleMonitoring,
        emergencyAlertTriggered,
        dismissEmergencyAlert,
        simulateEmergencyAlarm,
        shieldEngagementCount,
        selectedPresetId,
        applyPreset,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextValue => {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
};
