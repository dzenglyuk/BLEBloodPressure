import { Device } from 'react-native-ble-plx';
import { AnyAction } from 'redux';
import { END, eventChannel, TakeableChannel } from 'redux-saga';
import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { sagaActionConstants } from './reducer';
import { connectedDeviceSelector } from './selectors';
import bluetoothLeManager from '../../../services/BluetoothLeManager';
import { BluetoothPeripheral } from '../../../models/BluetoothPeripheral';

type TakeableDevice = {
  payload: { id: string; name: string; serviceUUIDs: string };
  take: (cb: (message: any | END) => void) => Device;
};

type TakeablePressure = {
  type: string;
  payload: {};
  take: (cb: (message: any | END) => void) => string;
};

function* watchForPeripherals(): Generator<AnyAction, void, TakeableDevice> {
  const onDiscoveredPeripheral = () =>
    eventChannel((emitter) => {
      return bluetoothLeManager.scanForPeripherals(emitter);
    });

  const channel: TakeableChannel<Device> = yield call(onDiscoveredPeripheral);

  try {
    while (true) {
      const response = yield take(channel);

      yield put({
        type: sagaActionConstants.ON_DEVICE_DISCOVERED,
        payload: {
          id: response.payload.id,
          name: response.payload.name,
          serviceUUIDs: response.payload.serviceUUIDs,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* connectToPeripheral(action: {
  type: typeof sagaActionConstants.INITIATE_CONNECTION;
  payload: BluetoothPeripheral;
}): SagaIterator {
  const deviceId = action.payload.id;

  yield call(bluetoothLeManager.connectToPeripheral, deviceId);
  yield put({
    type: sagaActionConstants.CONNECTION_SUCCESS,
    payload: deviceId,
  });
  yield put({
    type: sagaActionConstants.ADD_PAIRED_DEVICE,
    payload: action.payload,
  });
  const connectedDevice = yield select(connectedDeviceSelector, deviceId);
  if (connectedDevice) {
    yield call(getPressureUpdates, {
      type: sagaActionConstants.START_PRESSURE_SCAN,
      payload: deviceId,
    });
  }
  yield call(bluetoothLeManager.stopScanningForPeripherals);
}

function* getPressureUpdates(action: {
  type: typeof sagaActionConstants.START_PRESSURE_SCAN;
  payload: string;
}): Generator<AnyAction, void, TakeablePressure> {
  const onPressureUpdate = (deviceId: string) =>
    eventChannel((emitter) => {
      bluetoothLeManager.startStreamingData(deviceId, emitter);

      return () => {
        bluetoothLeManager.stopScanningForPeripherals();
      };
    });

  const channel: TakeableChannel<string> = yield call(onPressureUpdate, action.payload);

  try {
    while (true) {
      const response = yield take(channel);
      yield put({
        type: response.type,
        payload: response.payload,
      });
    }
  } catch (e) {
    console.log(e);
  }
}

export function* bluetoothSaga() {
  yield takeEvery(sagaActionConstants.SCAN_FOR_PERIPHERALS, watchForPeripherals);
  yield takeEvery(sagaActionConstants.INITIATE_CONNECTION, connectToPeripheral);
  yield takeEvery(sagaActionConstants.START_PRESSURE_SCAN, getPressureUpdates);
}
