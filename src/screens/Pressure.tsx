import React, { memo, useLayoutEffect } from 'react';
import type { FC } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import type { RootStackParamList } from '../navigation';
import { SCREENS } from '../constants/navigation';
import { pressureSelector } from '../redux/modules/bluetooth/selectors';
import type { RootState } from '../redux/store';
import { PressureTable } from '../components/PressureTable';
import Button from '../components/Button';
import { removePairedDevice } from '../redux/modules/bluetooth/reducer';

const Pressure: FC<NativeStackScreenProps<RootStackParamList, SCREENS.DEVICES_DATA>> = ({
  route,
  navigation,
}) => {
  const { deviceId, deviceName } = route.params;
  const pressure = useSelector((state: RootState) => pressureSelector(state, deviceId));
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: deviceName,
    });
  }, [navigation, deviceName]);

  const forgetDevice = () => {
    dispatch(removePairedDevice(deviceId));
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      {pressure?.length > 0 ? (
        <>
          <PressureTable pressure={pressure} />
          <View style={styles.buttonContainer}>
            <Button title="Forget Device" onPress={forgetDevice} />
          </View>
        </>
      ) : (
        <Text style={styles.text}>No data</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    padding: 15,
  },
});

export default memo(Pressure);
