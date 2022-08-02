import { Device } from 'react-native-ble-plx';

export type TakeableDevice = {
  payload: { id: string; name: string; serviceUUIDs: string };
  take: (cb: (message: any) => void) => Device;
};
