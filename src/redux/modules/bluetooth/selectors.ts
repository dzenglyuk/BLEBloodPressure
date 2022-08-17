import type { RootState } from '../../store';

export const connectedDeviceSelector = (state: RootState, deviceId: string) =>
  state.bluetooth.connectedDevice.find((device) => device === deviceId);
export const pairedDevicesSelector = (state: RootState) => state.bluetooth.pairedDevices;
export const availableDevicesSelector = (state: RootState) => state.bluetooth.availableDevices;
export const pressureSelector = (state: RootState, deviceId: string) =>
  state.bluetooth.pressure[deviceId];
