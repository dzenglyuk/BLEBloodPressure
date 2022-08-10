import type { RootState } from '../../store';

export const connectedDeviceSelector = (state: RootState) => state.bluetooth.connectedDevice;
