import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '../constants/navigation';
import DevicesScreen from '../screens/Devices';
import AddDeviceScreen from '../screens/AddDevice';
import PressureScreen from '../screens/Pressure';

export type RootStackParamList = {
  [SCREENS.DEVICES_LIST]: undefined;
  [SCREENS.DEVICES_ADD]: undefined;
  [SCREENS.DEVICES_DATA]: { deviceId: string; deviceName: string };
};

const RootStackNavigator = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();

  return (
    <RootStack.Navigator initialRouteName={SCREENS.DEVICES_LIST}>
      <RootStack.Group>
        <RootStack.Screen
          name={SCREENS.DEVICES_LIST}
          component={DevicesScreen}
          options={{
            title: 'Devices List',
          }}
        />
        <RootStack.Screen
          name={SCREENS.DEVICES_ADD}
          component={AddDeviceScreen}
          options={{
            title: 'Add Device',
          }}
        />
        <RootStack.Screen
          name={SCREENS.DEVICES_DATA}
          component={PressureScreen}
          initialParams={{ deviceId: '', deviceName: '' }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
