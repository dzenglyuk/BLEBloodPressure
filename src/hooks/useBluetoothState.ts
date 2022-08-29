import { useState, useEffect } from 'react';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

export const useBluetoothState = () => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

  const setBluetoothEnabled = (bluetoothState: BluetoothStateManager.BluetoothState) => {
    setIsBluetoothEnabled(bluetoothState === 'PoweredOn');
  };

  useEffect(() => {
    BluetoothStateManager.getState().then(setBluetoothEnabled);
    BluetoothStateManager.onStateChange(setBluetoothEnabled, true);
  }, []);

  return isBluetoothEnabled;
};
