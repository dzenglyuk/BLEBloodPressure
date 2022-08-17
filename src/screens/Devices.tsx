import React, { memo, useLayoutEffect } from 'react';
import type { FC } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { pairedDevicesSelector } from '../redux/modules/bluetooth/selectors';
import PlusIcon from '../assets/svgs/PlusIcon';
import DevicesList from '../components/DevicesList';
import type { RootStackParamList } from '../navigation';
import { SCREENS } from '../constants/navigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BluetoothPeripheral } from '../models/BluetoothPeripheral';

const Devices: FC<NativeStackScreenProps<RootStackParamList, SCREENS.DEVICES_LIST>> = ({
  navigation,
}) => {
  const pairedDevices = useSelector(pairedDevicesSelector);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            navigation.navigate(SCREENS.DEVICES_ADD);
          }}>
          <PlusIcon />
        </Pressable>
      ),
    });
  }, [navigation]);

  const handleDevicePress = (device: BluetoothPeripheral) => {
    const { id: deviceId, name: deviceName } = device;
    navigation.navigate(SCREENS.DEVICES_DATA, { deviceId, deviceName });
  };

  return (
    <View style={styles.container}>
      {pairedDevices.length > 0 ? (
        <DevicesList devices={pairedDevices} onPress={handleDevicePress} />
      ) : (
        <Text style={styles.emptyText}>
          Tap on 'Plus' icon in the top right corner to add BLE device
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default memo(Devices);
