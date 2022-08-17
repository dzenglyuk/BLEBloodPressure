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
  pairedDevices: Array<BluetoothPeripheral>;
  isConnectingToDevice: boolean;
  connectedDevice: string[];
  pressure: Record<string, Pressure[]>;
  isRetrievingPressureUpdates: boolean;
  isScanning: boolean;
};

const initialState: BluetoothState = {
  availableDevices: [],
  pairedDevices: [],
  isConnectingToDevice: false,
  connectedDevice: [],
  pressure: {},
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
    closeConnection: (state, _) => {
      state.isConnectingToDevice = false;
      state.connectedDevice = initialState.connectedDevice;
    },
    connectPeripheral: (state, action) => {
      state.isConnectingToDevice = false;
      state.connectedDevice = [...state.connectedDevice, action.payload];
    },
    updatePressure: (state, action) => {
      const { deviceId, pressure } = action.payload;
      state.pressure[deviceId] = [...(state.pressure[deviceId] || []), pressure];
      state.isRetrievingPressureUpdates = false;
    },
    startPressureScan: (state, action) => {
      state.isRetrievingPressureUpdates = true;
    },
    stopPressureScan: (state, action) => {
      state.isRetrievingPressureUpdates = false;
      state.isConnectingToDevice = false;
      state.connectedDevice = state.connectedDevice.filter((device) => device !== action.payload);
    },
    addPairedDevice: (state, action) => {
      state.pairedDevices = [...state.pairedDevices, action.payload];
    },
    clearAvailableDevices: (state) => {
      state.availableDevices = initialState.availableDevices;
    },
    bluetoothPeripheralsFound: (
      state: BluetoothState,
      action: PayloadAction<BluetoothPeripheral>,
    ) => {
      // Ensure no duplicate devices are added
      const isDuplicate = state.availableDevices.some((device) => device.id === action.payload.id);
      const hasName = action.payload.name;
      const isPaired = state.pairedDevices.some((device) => device.id === action.payload.id);

      if (!isDuplicate && !isPaired && hasName) {
        state.availableDevices = state.availableDevices.concat(action.payload);
      }
    },
  },
});

export const {
  bluetoothPeripheralsFound,
  clearAvailableDevices,
  scanForPeripherals,
  initiateConnection,
  startPressureScan,
  stopPressureScan,
  closeConnection,
  addPairedDevice,
} = bluetoothReducer.actions;

export const sagaActionConstants = {
  SCAN_FOR_PERIPHERALS: bluetoothReducer.actions.scanForPeripherals.type,
  ON_DEVICE_DISCOVERED: bluetoothReducer.actions.bluetoothPeripheralsFound.type,
  INITIATE_CONNECTION: bluetoothReducer.actions.initiateConnection.type,
  CONNECTION_SUCCESS: bluetoothReducer.actions.connectPeripheral.type,
  UPDATE_PRESSURE: bluetoothReducer.actions.updatePressure.type,
  START_PRESSURE_SCAN: bluetoothReducer.actions.startPressureScan.type,
  STOP_PRESSURE_SCAN: bluetoothReducer.actions.stopPressureScan.type,
  ADD_PAIRED_DEVICE: bluetoothReducer.actions.addPairedDevice.type,
};

export default bluetoothReducer;
