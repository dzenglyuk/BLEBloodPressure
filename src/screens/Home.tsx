import React, { FC, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PressureTable } from '../components/PressureTable';
import { startPressureScan } from '../redux/modules/bluetooth/reducer';
import { RootState } from '../redux/store';
import bluetoothLeManager from '../services/BluetoothLeManager';

const Home: FC = () => {
  const dispatch = useDispatch();
  const pressure = useSelector((state: RootState) => state.bluetooth.pressure);

  const isLoading = useSelector((state: RootState) => state.bluetooth.isRetrievingPressureUpdates);

  useEffect(() => {
    const timerId = setInterval(async () => {
      const onDeviceFound = () => {
        dispatch(startPressureScan());
      };

      bluetoothLeManager.findPeripheral('33B04F8F-C21F-64EC-CA2B-CFF4F9F6EEA0', onDeviceFound);
    }, 30000);

    return () => {
      clearInterval(timerId);
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pressureTitleWrapper}>
        {isLoading ? (
          <View>
            <ActivityIndicator size={'large'} animating={true} color={'#7735C2'} />
          </View>
        ) : (
          <>
            <Text style={styles.pressureTitleText}>Blood Pressure Records:</Text>
            <View style={styles.pressureContainer}>
              <PressureTable pressure={pressure} />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  pressureContainer: {
    width: '100%',
    padding: 15,
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
});

export default Home;
