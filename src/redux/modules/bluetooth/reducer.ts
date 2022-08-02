import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BluetoothPeripheral } from '../../../models/BluetoothPeripheral';

export type Pressure = {
  sys: number;
  dia: number;
  pulse: number;
  date: string;
  time: string;
};

type BluetoothState = {
  availableDevices: Array<BluetoothPeripheral>;
  isConnectingToDevice: boolean;
  connectedDevice: string | null;
  pressure: Pressure;
  isRetrievingPressureUpdates: boolean;
  isScanning: boolean;
};

const initialState: BluetoothState = {
  availableDevices: [],
  isConnectingToDevice: false,
  connectedDevice: null,
  pressure: {
    sys: 0,
    dia: 0,
    pulse: 0,
    date: '',
    time: '',
  },
  isRetrievingPressureUpdates: false,
  isScanning: false,
};

const bluetoothReducer = createSlice({
  name: 'bluetooth',
  initialState: initialState,
  reducers: {
    scanForPeripherals: (state) => {
      state.isScanning = true;
    },
    initiateConnection: (state, _) => {
      state.isConnectingToDevice = true;
    },
    connectPeripheral: (state, action) => {
      state.isConnectingToDevice = false;
      state.connectedDevice = action.payload;
    },
    updatePressure: (state, action) => {
      state.pressure = action.payload;
      state.isRetrievingPressureUpdates = false;
    },
    startPressureScan: (state) => {
      state.isRetrievingPressureUpdates = true;
    },
    stopPressureScan: (state) => {
      state.isRetrievingPressureUpdates = false;
    },
    bluetoothPeripheralsFound: (
      state: BluetoothState,
      action: PayloadAction<BluetoothPeripheral>,
    ) => {
      // Ensure no duplicate devices are added
      const isDuplicate = state.availableDevices.some((device) => device.id === action.payload.id);
      const hasName = action.payload.name;

      if (!isDuplicate && hasName) {
        state.availableDevices = state.availableDevices.concat(action.payload);
      }
    },
  },
});

export const {
  bluetoothPeripheralsFound,
  scanForPeripherals,
  initiateConnection,
  startPressureScan,
  stopPressureScan,
} = bluetoothReducer.actions;

export const sagaActionConstants = {
  SCAN_FOR_PERIPHERALS: bluetoothReducer.actions.scanForPeripherals.type,
  ON_DEVICE_DISCOVERED: bluetoothReducer.actions.bluetoothPeripheralsFound.type,
  INITIATE_CONNECTION: bluetoothReducer.actions.initiateConnection.type,
  CONNECTION_SUCCESS: bluetoothReducer.actions.connectPeripheral.type,
  UPDATE_PRESSURE: bluetoothReducer.actions.updatePressure.type,
  START_PRESSURE_SCAN: bluetoothReducer.actions.startPressureScan.type,
  STOP_PRESSURE_SCAN: bluetoothReducer.actions.stopPressureScan.type,
};

export default bluetoothReducer;
