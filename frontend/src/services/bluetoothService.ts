import {
  BluetoothConnectionState,
  AncMode,
  BluetoothDevice,
  BluetoothRemoteGATTServer,
  BluetoothRemoteGATTCharacteristic
} from '../types';

export class BluetoothManager {
  private device: BluetoothDevice | null = null;
  private gattServer: BluetoothRemoteGATTServer | null = null;
  private ancCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

  private connectionState: BluetoothConnectionState = 'DISCONNECTED';
  private currentAncMode: AncMode = 'OFF';
  private onStateChangeCallback: ((state: BluetoothConnectionState, deviceName?: string) => void) | null = null;
  private onAncModeChangeCallback: ((mode: AncMode) => void) | null = null;

  // Standard & Vendor ANC GATT Service UUIDs
  private readonly ANC_SERVICES = [
    '0000180a-0000-1000-8000-00805f9b34fb', // Device Information Service
    '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
    '0000fe01-0000-1000-8000-00805f9b34fb', // Vendor Audio Service
    '0000fe55-0000-1000-8000-00805f9b34fb', // Nordic UART / Custom Earbud Control
  ];

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator && !!navigator.bluetooth;
  }

  public getConnectionState(): BluetoothConnectionState {
    return this.connectionState;
  }

  public getAncMode(): AncMode {
    return this.currentAncMode;
  }

  public onStateChange(callback: (state: BluetoothConnectionState, deviceName?: string) => void): void {
    this.onStateChangeCallback = callback;
  }

  public onAncModeChange(callback: (mode: AncMode) => void): void {
    this.onAncModeChangeCallback = callback;
  }

  /**
   * Scans and connects to hardware BLE earbuds via Web Bluetooth API
   */
  public async requestHardwareDevice(): Promise<boolean> {
    if (!this.isSupported() || !navigator.bluetooth) {
      console.warn('Web Bluetooth API not supported on this browser/platform. Falling back to Tier B.');
      this.setConnectionState('TIER_B_SOFTWARE_SHIELD', 'Standard Headset (Tier B Software Armed)');
      return false;
    }

    try {
      this.setConnectionState('CONNECTING');

      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: this.ANC_SERVICES,
      });

      if (!this.device) {
        this.setConnectionState('TIER_B_SOFTWARE_SHIELD');
        return false;
      }

      this.device.addEventListener('gattserverdisconnected', this.handleDisconnection.bind(this));

      if (this.device.gatt) {
        this.gattServer = await this.device.gatt.connect();
        console.log(`Connected to GATT Server on: ${this.device.name}`);

        await this.lockHardwareAnc('ANC_ON');
        this.setConnectionState('TIER_A_HARDWARE_LOCKED', this.device.name || 'ANC Earbuds');
        return true;
      } else {
        this.setConnectionState('TIER_A_HARDWARE_LOCKED', this.device.name || 'ANC Device');
        return true;
      }
    } catch (err: any) {
      console.warn('Bluetooth pairing aborted or failed:', err?.message || err);
      this.setConnectionState('TIER_B_SOFTWARE_SHIELD', 'Standard Earbuds (Tier B Shield Active)');
      return false;
    }
  }

  /**
   * Emits ANC mode lock commands to compatible hardware earbud characteristics
   */
  public async lockHardwareAnc(mode: AncMode): Promise<void> {
    this.currentAncMode = mode;
    if (this.onAncModeChangeCallback) {
      this.onAncModeChangeCallback(mode);
    }

    if (this.ancCharacteristic && this.gattServer?.connected) {
      try {
        const opcode = mode === 'ANC_ON' ? 0x01 : mode === 'TRANSPARENCY' ? 0x02 : 0x00;
        await this.ancCharacteristic.writeValue(new Uint8Array([0xAA, opcode]));
        console.log(`[Bluetooth GATT] Hardware ANC characteristic set to: ${mode}`);
      } catch (err) {
        console.warn('Unable to write GATT ANC characteristic:', err);
      }
    }
  }

  /**
   * Simulated device connection for testing & environments without physical BLE ANC hardware
   */
  public simulateHardwareConnection(tier: 'TIER_A' | 'TIER_B'): void {
    if (tier === 'TIER_A') {
      this.currentAncMode = 'ANC_ON';
      this.setConnectionState('TIER_A_HARDWARE_LOCKED', 'Sony/AirPods ANC Device (Simulated BLE)');
      if (this.onAncModeChangeCallback) this.onAncModeChangeCallback('ANC_ON');
    } else {
      this.currentAncMode = 'OFF';
      this.setConnectionState('TIER_B_SOFTWARE_SHIELD', 'Standard Wired / Earbuds');
      if (this.onAncModeChangeCallback) this.onAncModeChangeCallback('OFF');
    }
  }

  public disconnect(): void {
    if (this.gattServer && this.gattServer.connected) {
      this.gattServer.disconnect();
    }
    this.device = null;
    this.gattServer = null;
    this.ancCharacteristic = null;
    this.currentAncMode = 'OFF';
    this.setConnectionState('DISCONNECTED');
  }

  private handleDisconnection(): void {
    console.log('Bluetooth device disconnected.');
    this.setConnectionState('DISCONNECTED');
  }

  private setConnectionState(state: BluetoothConnectionState, deviceName?: string): void {
    this.connectionState = state;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(state, deviceName);
    }
  }
}

export const bluetoothManager = new BluetoothManager();
