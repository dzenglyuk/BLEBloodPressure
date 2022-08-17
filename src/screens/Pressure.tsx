import React, { memo, useLayoutEffect } from 'react';
import type { FC } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import type { RootStackParamList } from '../navigation';
import { SCREENS } from '../constants/navigation';
import { pressureSelector } from '../redux/modules/bluetooth/selectors';
import type { RootState } from '../redux/store';
import { PressureTable } from '../components/PressureTable';

const Pressure: FC<NativeStackScreenProps<RootStackParamList, SCREENS.DEVICES_DATA>> = ({
  route,
  navigation,
}) => {
  const { deviceId, deviceName } = route.params;
  const pressure = useSelector((state: RootState) => pressureSelector(state, deviceId));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: deviceName,
    });
  }, [navigation, deviceName]);

  return (
    <View style={styles.container}>
      {pressure?.length > 0 ? (
        <PressureTable pressure={pressure} />
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
});

export default memo(Pressure);
