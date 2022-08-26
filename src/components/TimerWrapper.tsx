import type { FC, ReactElement } from 'react';
import { useEffect, memo } from 'react';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import bluetoothLeManager from '../services/BluetoothLeManager';
import { startPressureScan } from '../redux/modules/bluetooth/reducer';
import { pairedDevicesSelector } from '../redux/modules/bluetooth/selectors';

type Props = {
  children: ReactElement;
};

const TimerWrapper: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const pairedDevices = useSelector(pairedDevicesSelector);
  const isIOS = Platform.OS === 'ios';

  useEffect(() => {
    if (isIOS) {
      let intervals: number[] = [];

      for (const device of pairedDevices) {
        intervals = [
          ...intervals,
          setInterval(async () => {
            const onDeviceFound = () => {
              dispatch(startPressureScan(device.id));
            };

            bluetoothLeManager.findPeripheral(device.id, onDeviceFound);
          }, 10000),
        ];
      }

      return () => {
        for (const interval of intervals) {
          clearInterval(interval);
        }
      };
    }
  });

  return children;
};

export default memo(TimerWrapper);
