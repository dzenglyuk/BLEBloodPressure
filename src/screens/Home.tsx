import React, { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import DeviceModal from '../components/DeviceModal';
import { BluetoothPeripheral } from '../models/BluetoothPeripheral';
import {
  initiateConnection,
  scanForPeripherals,
  startPressureScan,
} from '../redux/modules/bluetooth/reducer';
import { RootState } from '../redux/store';

const Home: FC = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state: RootState) => state.bluetooth.availableDevices);

  const { sys, dia, pulse, date, time } = useSelector(
    (state: RootState) => state.bluetooth.pressure,
  );

  const isLoading = useSelector((state: RootState) => state.bluetooth.isRetrievingPressureUpdates);
  const isConnected = useSelector((state: RootState) => !!state.bluetooth.connectedDevice);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const closeModal = () => setIsModalVisible(false);

  const connectToPeripheral = (device: BluetoothPeripheral) =>
    dispatch(initiateConnection(device.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pressureTitleWrapper}>
        {isConnected ? (
          isLoading ? (
            <View>
              <ActivityIndicator size={'large'} animating={true} color={'#7735C2'} />
            </View>
          ) : (
            <>
              <Text style={styles.pressureTitleText}>Your Blood Pressure Is:</Text>
              {sys && dia && pulse ? (
                <>
                  <Text style={styles.pressureText}>SYS: {sys}</Text>
                  <Text style={styles.pressureText}>DIA: {dia}</Text>
                  <Text style={styles.pressureText}>PULSE: {pulse}</Text>
                  <Text style={styles.pressureText}>DATE: {date}</Text>
                  <Text style={styles.pressureText}>TIME: {time}</Text>
                </>
              ) : (
                <Text style={styles.pressureText}>No new data</Text>
              )}
            </>
          )
        ) : (
          <Text style={styles.pressureTitleText}>Please Connect to a Blood Pressure Monitor</Text>
        )}
      </View>
      <Button
        title="Connect"
        onPress={() => {
          dispatch(scanForPeripherals());
          setIsModalVisible(true);
        }}
      />
      {isConnected && (
        <Button
          title="Get Pressure"
          onPress={() => {
            dispatch(startPressureScan());
          }}
        />
      )}
      <DeviceModal
        devices={devices}
        visible={isModalVisible}
        closeModal={closeModal}
        connectToPeripheral={connectToPeripheral}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  pressureTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressureTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  pressureText: {
    fontSize: 25,
    marginTop: 15,
  },
});

export default Home;
