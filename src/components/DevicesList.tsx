import React, { FC, useCallback } from 'react';
import { FlatList, ListRenderItemInfo, View, SafeAreaView, StyleSheet } from 'react-native';
import { BluetoothPeripheral } from '../models/BluetoothPeripheral';
import Button from './Button';

type DevicesProps = {
  devices: BluetoothPeripheral[];
  onPress: (device: BluetoothPeripheral) => void;
};

const DevicesList: FC<DevicesProps> = ({ devices, onPress }) => {
  const renderDeviceListItem = useCallback(
    (item: ListRenderItemInfo<BluetoothPeripheral>) => {
      return <Button title={item.item.name} onPress={() => onPress(item.item)} />;
    },
    [onPress],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.title}>
        <FlatList
          contentContainerStyle={styles.flatlistContiner}
          data={devices}
          renderItem={renderDeviceListItem}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  flatlistContiner: {
    flex: 1,
  },
  title: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  titleText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center',
  },
});

export default DevicesList;
