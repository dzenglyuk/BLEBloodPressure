import base64 from 'react-native-base64';
import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { Pressure, sagaActionConstants } from '../redux/modules/bluetooth/reducer';

const BLOOD_PRESSURE_SERVICE_UUID = '00001810-0000-1000-8000-00805f9b34fb';
const BLOOD_PRESSURE_CHARACTERISTIC_UUID = '00002a35-0000-1000-8000-00805f9b34fb';

class BluetoothLeManager {
  bleManager: BleManager;
  device: Device | null;

  constructor() {
    this.bleManager = new BleManager();
    this.device = null;
  }

  scanForPeripherals = (
    onDeviceFound: (arg0: { type: string; payload: BleError | Device | null }) => void,
  ) => {
    this.bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      onDeviceFound({ type: 'SAMPLE', payload: scannedDevice ?? error });
      return;
    });
    return () => {
      this.bleManager.stopDeviceScan();
    };
  };

  stopScanningForPeripherals = () => {
    this.bleManager.stopDeviceScan();
  };

  onDeviceDisconnected = () => {
    console.log('<--- Device disconnected!');
  };

  connectToPeripheral = async (identifier: string) => {
    this.device = await this.bleManager.connectToDevice(identifier);
    this.device.onDisconnected(this.onDeviceDisconnected);
  };

  onPressureUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    emitter: (arg0: { type: string; payload: Pressure | string }) => void,
  ) => {
    if (error) {
      console.log('ERROR: ', error.message);
      emitter({ type: sagaActionConstants.STOP_PRESSURE_SCAN, payload: error.message });
    }

    const data = base64.decode(characteristic?.value ?? '');

    if (characteristic?.value) {
      const pressure: Pressure = {
        sys: data[1].charCodeAt(0),
        dia: data[3].charCodeAt(0),
        pulse: data[14].charCodeAt(0),
        date: `${data[9].charCodeAt(0)}/${data[10].charCodeAt(0)}`,
        time: `${data[11].charCodeAt(0)}:${data[12].charCodeAt(0)}`,
      };

      emitter({ type: sagaActionConstants.UPDATE_PRESSURE, payload: pressure });
    }
  };

  startStreamingData = async (
    emitter: (arg0: { type: string; payload: Pressure | string }) => void,
  ) => {
    await this.device?.discoverAllServicesAndCharacteristics();

    this.device?.monitorCharacteristicForService(
      BLOOD_PRESSURE_SERVICE_UUID,
      BLOOD_PRESSURE_CHARACTERISTIC_UUID,
      (error, characteristic) => this.onPressureUpdate(error, characteristic, emitter),
    );
  };
}

const bluetoothLeManager = new BluetoothLeManager();

export default bluetoothLeManager;
