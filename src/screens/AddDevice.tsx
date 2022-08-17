import React, { memo, useEffect } from 'react';
import type { FC } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  scanForPeripherals,
  clearAvailableDevices,
  initiateConnection,
} from '../redux/modules/bluetooth/reducer';
import bluetoothLeManager from '../services/BluetoothLeManager';
import { availableDevicesSelector } from '../redux/modules/bluetooth/selectors';
import DevicesList from '../components/DevicesList';
import type { RootStackParamList } from '../navigation';
import { SCREENS } from '../constants/navigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BluetoothPeripheral } from '../models/BluetoothPeripheral';

const AddDevice: FC<NativeStackScreenProps<RootStackParamList, SCREENS.DEVICES_ADD>> = () => {
  const dispatch = useDispatch();
  const availableDevices = useSelector(availableDevicesSelector);

  useEffect(() => {
    dispatch(scanForPeripherals());

    return () => {
      bluetoothLeManager.stopScanningForPeripherals();
      dispatch(clearAvailableDevices());
    };
  }, [dispatch]);

  const handleDevicePress = (device: BluetoothPeripheral) => {
    dispatch(initiateConnection(device));
  };

  return (
    <View style={styles.container}>
      {availableDevices.length > 0 ? (
        <DevicesList devices={availableDevices} onPress={handleDevicePress} />
      ) : (
        <View>
          <ActivityIndicator size={'large'} animating={true} color={'#7735C2'} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
});

export default memo(AddDevice);
