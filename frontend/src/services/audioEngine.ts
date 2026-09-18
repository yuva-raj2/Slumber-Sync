import { DecibelTelemetry, AmbientStatus } from '../types';

export class AudioShieldEngine {
  private audioContext: AudioContext | null = null;

  // Synthesis Nodes
  private noiseSourceNode: AudioBufferSourceNode | null = null;
  private speechBandpassHighpass: BiquadFilterNode | null = null;
  private speechBandpassLowpass: BiquadFilterNode | null = null;
  private subAudibleHumGain: GainNode | null = null;
  private shieldGainNode: GainNode | null = null;

  // Microphone & Analysis
  private micStream: MediaStream | null = null;
  private micSourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private monitorIntervalId: number | null = null;

  // State
  private isStandbyMode: boolean = true; // True = 0 dB gain (pure silence)
  private isShieldEngaged: boolean = false;
  private isMonitoring: boolean = false;
  private thresholdDb: number = 48.0; // Default 48 dB trigger
  private manualDeepHumEnabled: boolean = false;
  private peakDb: number = 30.0;
  private shieldEngagementCount: number = 0;

  // Emergency Sentinel
  private alarmFramesCount: number = 0;
  private emergencyMuted: boolean = false;
  private onEmergencyAlarmCallback: ((detected: boolean) => void) | null = null;
  private onTelemetryCallback: ((telemetry: DecibelTelemetry) => void) | null = null;
  private onShieldStateChange: ((engaged: boolean) => void) | null = null;

  private getOrCreateContext(): AudioContext {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * Initializes the procedural speech-masking audio graph in standby (Gain = 0.0)
   */
  private initAudioGraph(): void {
    const ctx = this.getOrCreateContext();
    if (this.noiseSourceNode) return; // Already initialized

    // 5-second procedural white/pink noise buffer
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Warm, organic noise base
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.09;
    }

    this.noiseSourceNode = ctx.createBufferSource();
    this.noiseSourceNode.buffer = buffer;
    this.noiseSourceNode.loop = true;

    // Calibrated Speech-Shielding Bandpass Filter (250 Hz - 1.8 kHz)
    // Specifically targeted to swallow human vocal formants, consonant fricatives, and chatter
    this.speechBandpassHighpass = ctx.createBiquadFilter();
    this.speechBandpassHighpass.type = 'highpass';
    this.speechBandpassHighpass.frequency.setValueAtTime(250, ctx.currentTime);
    this.speechBandpassHighpass.Q.setValueAtTime(0.7, ctx.currentTime);

    this.speechBandpassLowpass = ctx.createBiquadFilter();
    this.speechBandpassLowpass.type = 'lowpass';
    this.speechBandpassLowpass.frequency.setValueAtTime(1800, ctx.currentTime);
    this.speechBandpassLowpass.Q.setValueAtTime(0.7, ctx.currentTime);

    // Master Shield Gain Node: Default = 0.0 (Pure Silence / Zero-Sound Standby)
    this.shieldGainNode = ctx.createGain();
    this.shieldGainNode.gain.setValueAtTime(0.00001, ctx.currentTime);

    // Sub-audible Hum Gain (optional manual override)
    this.subAudibleHumGain = ctx.createGain();
    this.subAudibleHumGain.gain.setValueAtTime(0.00001, ctx.currentTime);

    // Wire graph: NoiseSource -> Highpass(250Hz) -> Lowpass(1.8kHz) -> ShieldGain -> Destination
    this.noiseSourceNode.connect(this.speechBandpassHighpass);
    this.speechBandpassHighpass.connect(this.speechBandpassLowpass);
    this.speechBandpassLowpass.connect(this.shieldGainNode);
    this.shieldGainNode.connect(ctx.destination);

    this.noiseSourceNode.start(0);
    this.isStandbyMode = true;
  }

  /**
   * Starts ambient decibel monitoring via microphone or fallback acoustic room simulator
   */
  public async startAmbientDecibelMonitor(
    onTelemetry: (telemetry: DecibelTelemetry) => void,
    onShieldState?: (engaged: boolean) => void,
    onEmergencyAlarm?: (detected: boolean) => void
  ): Promise<boolean> {
    const ctx = this.getOrCreateContext();
    this.initAudioGraph();

    this.onTelemetryCallback = onTelemetry;
    this.onShieldStateChange = onShieldState || null;
    this.onEmergencyAlarmCallback = onEmergencyAlarm || null;
    this.isMonitoring = true;

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });

      this.micSourceNode = ctx.createMediaStreamSource(this.micStream);
      this.analyserNode = ctx.createAnalyser();
      this.analyserNode.fftSize = 1024;
      this.analyserNode.smoothingTimeConstant = 0.8;

      this.micSourceNode.connect(this.analyserNode);
      this.startSamplingLoop();
      return true;
    } catch (err) {
      console.warn('Microphone permission denied or unavailable; starting realistic acoustic simulation:', err);
      this.startSimulatedSamplingLoop();
      return false;
    }
  }

  public stopAmbientDecibelMonitor(): void {
    if (this.monitorIntervalId) {
      clearInterval(this.monitorIntervalId);
      this.monitorIntervalId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSourceNode) {
      this.micSourceNode.disconnect();
      this.micSourceNode = null;
    }
    this.fadeShieldToSilence(100);
    this.isMonitoring = false;
  }

  /**
   * Samples true RMS decibels every 150ms and drives the Dynamic Speech Shield
   */
  private startSamplingLoop(): void {
    if (this.monitorIntervalId) clearInterval(this.monitorIntervalId);

    const bufferLength = this.analyserNode?.fftSize || 1024;
    const timeData = new Float32Array(bufferLength);
    const freqData = new Uint8Array(bufferLength / 2);

    this.monitorIntervalId = window.setInterval(() => {
      if (!this.analyserNode) return;

      this.analyserNode.getFloatTimeDomainData(timeData);
      this.analyserNode.getByteFrequencyData(freqData);

      // Emergency alarm detection (2.5 kHz - 4 kHz continuous harmonic peak)
      const sirenDetected = this.checkSirenFrequencies(freqData);
      if (sirenDetected && !this.emergencyMuted) {
        this.triggerEmergencyBypass();
      }

      // Compute true Root-Mean-Square (RMS)
      let sumSquares = 0.0;
      for (let i = 0; i < bufferLength; i++) {
        sumSquares += timeData[i] * timeData[i];
      }
      const rms = Math.sqrt(sumSquares / bufferLength);

      // Calibrated dB SPL estimation
      const safeRms = Math.max(rms, 0.0001);
      const calculatedDb = Math.max(28, Math.min(95, Math.round(20 * Math.log10(safeRms) + 95)));

      // Peak tracking
      if (calculatedDb > this.peakDb) {
        this.peakDb = calculatedDb;
      } else {
        this.peakDb = Math.max(calculatedDb, this.peakDb - 0.6);
      }

      let status: AmbientStatus = 'QUIET';
      if (calculatedDb > 55) status = 'DISRUPTIVE';
      else if (calculatedDb > 42) status = 'MODERATE';

      // Dynamic Speech Shield Activation Logic
      this.evaluateDynamicShield(calculatedDb);

      if (this.onTelemetryCallback) {
        this.onTelemetryCallback({
          currentDb: calculatedDb,
          peakDb: Math.round(this.peakDb),
          rawRms: rms,
          status,
          timestamp: Date.now(),
          shieldActive: this.isShieldEngaged,
        });
      }
    }, 150);
  }

  private startSimulatedSamplingLoop(): void {
    if (this.monitorIntervalId) clearInterval(this.monitorIntervalId);
    let simulatedBaseline = 35.0;

    this.monitorIntervalId = window.setInterval(() => {
      const jitter = (Math.random() - 0.5) * 3.5;
      // Roommate voice or door disturbance spike
      const occasionalSpike = Math.random() > 0.90 ? Math.random() * 26.0 : 0;
      const currentDb = Math.round(Math.max(30, Math.min(85, simulatedBaseline + jitter + occasionalSpike)));

      if (currentDb > this.peakDb) {
        this.peakDb = currentDb;
      } else {
        this.peakDb = Math.max(currentDb, this.peakDb - 0.8);
      }

      let status: AmbientStatus = 'QUIET';
      if (currentDb > 55) status = 'DISRUPTIVE';
      else if (currentDb > 42) status = 'MODERATE';

      this.evaluateDynamicShield(currentDb);

      if (this.onTelemetryCallback) {
        this.onTelemetryCallback({
          currentDb,
          peakDb: Math.round(this.peakDb),
          rawRms: 0.02,
          status,
          timestamp: Date.now(),
          shieldActive: this.isShieldEngaged,
        });
      }
    }, 150);
  }

  /**
   * Tier B Dynamic Speech Shield:
   * - Room dB > threshold: Ramps up 250Hz-1.8kHz bandpass within 50ms
   * - Room dB <= threshold: Fades back to 0.0 (Pure silence) within 400ms
   */
  private evaluateDynamicShield(currentDb: number): void {
    if (this.emergencyMuted || !this.shieldGainNode || !this.audioContext) return;
    const ctx = this.audioContext;

    if (currentDb > this.thresholdDb) {
      if (!this.isShieldEngaged) {
        this.isShieldEngaged = true;
        this.isStandbyMode = false;
        this.shieldEngagementCount++;
        if (this.onShieldStateChange) this.onShieldStateChange(true);
      }

      // Calculate target masking gain (scaled 0.4 to 0.85)
      const excess = currentDb - this.thresholdDb;
      const targetGain = Math.min(0.85, 0.45 + (excess * 0.015));

      // Fast 50ms ramp-up
      this.shieldGainNode.gain.cancelScheduledValues(ctx.currentTime);
      this.shieldGainNode.gain.setValueAtTime(Math.max(0.0001, this.shieldGainNode.gain.value), ctx.currentTime);
      this.shieldGainNode.gain.exponentialRampToValueAtTime(targetGain, ctx.currentTime + 0.05);
    } else {
      // Room is quiet: fade back to 0.0 (Pure silence) within 400ms
      if (this.isShieldEngaged) {
        this.fadeShieldToSilence(400);
      }
    }
  }

  private fadeShieldToSilence(durationMs: number): void {
    if (!this.shieldGainNode || !this.audioContext) return;
    const ctx = this.audioContext;
    const fadeSec = durationMs / 1000;

    this.shieldGainNode.gain.cancelScheduledValues(ctx.currentTime);
    this.shieldGainNode.gain.setValueAtTime(Math.max(0.0001, this.shieldGainNode.gain.value), ctx.currentTime);
    this.shieldGainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + fadeSec);

    setTimeout(() => {
      if (this.shieldGainNode && this.audioContext) {
        this.shieldGainNode.gain.setValueAtTime(0.0, this.audioContext.currentTime);
      }
      this.isShieldEngaged = false;
      this.isStandbyMode = !this.manualDeepHumEnabled;
      if (this.onShieldStateChange) this.onShieldStateChange(false);
    }, durationMs);
  }

  /**
   * Checks for sustained 2.5 kHz - 4 kHz siren or morning alarm frequencies
   */
  private checkSirenFrequencies(freqData: Uint8Array): boolean {
    if (!this.audioContext) return false;
    const binStart = Math.floor(2500 / (this.audioContext.sampleRate / 1024));
    const binEnd = Math.floor(4000 / (this.audioContext.sampleRate / 1024));

    let sirenEnergy = 0;
    for (let i = binStart; i <= binEnd; i++) {
      if (freqData[i] > 195) sirenEnergy++;
    }

    if (sirenEnergy >= 6) {
      this.alarmFramesCount++;
      if (this.alarmFramesCount >= 3) return true; // ~450ms sustained
    } else {
      this.alarmFramesCount = Math.max(0, this.alarmFramesCount - 1);
    }
    return false;
  }

  public triggerEmergencyBypass(): void {
    this.emergencyMuted = true;
    if (this.shieldGainNode && this.audioContext) {
      this.shieldGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
      this.shieldGainNode.gain.setValueAtTime(0.0, this.audioContext.currentTime);
    }
    if (this.onEmergencyAlarmCallback) {
      this.onEmergencyAlarmCallback(true);
    }
  }

  public dismissEmergencyBypass(): void {
    this.emergencyMuted = false;
    this.alarmFramesCount = 0;
    if (this.onEmergencyAlarmCallback) {
      this.onEmergencyAlarmCallback(false);
    }
  }

  public setThresholdDb(db: number): void {
    this.thresholdDb = Math.max(35, Math.min(70, db));
  }

  public setManualDeepHum(enabled: boolean): void {
    this.manualDeepHumEnabled = enabled;
    if (!this.shieldGainNode || !this.audioContext) return;
    const ctx = this.audioContext;

    if (enabled) {
      this.isStandbyMode = false;
      this.shieldGainNode.gain.cancelScheduledValues(ctx.currentTime);
      this.shieldGainNode.gain.setTargetAtTime(0.35, ctx.currentTime, 0.2);
    } else if (!this.isShieldEngaged) {
      this.fadeShieldToSilence(300);
    }
  }

  public getState() {
    return {
      isStandbyMode: this.isStandbyMode,
      isShieldEngaged: this.isShieldEngaged,
      isMonitoring: this.isMonitoring,
      thresholdDb: this.thresholdDb,
      manualDeepHumEnabled: this.manualDeepHumEnabled,
      emergencyMuted: this.emergencyMuted,
      shieldEngagementCount: this.shieldEngagementCount,
    };
  }
}

export const audioShieldEngine = new AudioShieldEngine();
