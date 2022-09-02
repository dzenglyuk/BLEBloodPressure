import React, { memo, useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Text,
} from 'react-native';
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
  const [permission, setPermission] = useState(false);
  const dispatch = useDispatch();
  const availableDevices = useSelector(availableDevicesSelector);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const hasAccessLocationPermission =
        (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)) ===
        PermissionsAndroid.RESULTS.GRANTED;
      const hasBluetoothScanPermission =
        (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN)) ===
        PermissionsAndroid.RESULTS.GRANTED;
      const hasBluetoothConnectPermission =
        (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT)) ===
        PermissionsAndroid.RESULTS.GRANTED;

      if (
        hasAccessLocationPermission &&
        hasBluetoothScanPermission &&
        hasBluetoothConnectPermission
      ) {
        setPermission(true);
      } else {
        setPermission(false);
      }
    } else {
      setPermission(true);
    }
  };

  useEffect(() => {
    requestLocationPermission().then(() => {
      permission && dispatch(scanForPeripherals());
    });

    return () => {
      bluetoothLeManager.stopScanningForPeripherals();
      dispatch(clearAvailableDevices());
    };
  }, [dispatch, permission]);

  const handleDevicePress = (device: BluetoothPeripheral) => {
    dispatch(initiateConnection(device));
  };

  return (
    <View style={styles.container}>
      {permission ? (
        availableDevices.length > 0 ? (
          <DevicesList devices={availableDevices} onPress={handleDevicePress} />
        ) : (
          <View>
            <ActivityIndicator size={'large'} animating={true} color={'#7735C2'} />
          </View>
        )
      ) : (
        <Text>Enable BLE permission for the app</Text>
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
