import base64 from 'react-native-base64';
import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { Pressure, sagaActionConstants } from '../redux/modules/bluetooth/reducer';

const BLOOD_PRESSURE_SERVICE_UUID = '00001810-0000-1000-8000-00805f9b34fb';
const BLOOD_PRESSURE_CHARACTERISTIC_UUID = '00002a35-0000-1000-8000-00805f9b34fb';

class BluetoothLeManager {
  bleManager: BleManager;
  devices: Record<string, Device>;

  constructor() {
    this.bleManager = new BleManager();
    this.devices = {};
  }

  scanForPeripherals = (
    onDeviceFound: (arg0: { type: string; payload: BleError | Device | null }) => void,
  ) => {
    this.bleManager.startDeviceScan([BLOOD_PRESSURE_SERVICE_UUID], null, (error, scannedDevice) => {
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

  findPeripheral = (identifier: string, callback: () => void) => {
    this.bleManager.startDeviceScan(
      [BLOOD_PRESSURE_SERVICE_UUID],
      null,
      async (error, scannedDevice) => {
        if (error) {
          return;
        }

        console.log('SCANNED:', scannedDevice?.id);

        if (scannedDevice?.id === identifier) {
          this.bleManager.stopDeviceScan();
          await this.connectToPeripheral(identifier);

          if (this.devices[identifier]) {
            callback();
          }

          return;
        }
      },
    );

    return;
  };

  onDeviceDisconnected = (error: BleError | null, device: Device) => {
    delete this.devices[device.id];
  };

  connectToPeripheral = async (identifier: string) => {
    try {
      const device = await this.bleManager.connectToDevice(identifier, {
        autoConnect: true,
      });

      device.onDisconnected(this.onDeviceDisconnected);

      this.devices[identifier] = device;
    } catch (error) {
      console.log(error);
    }
  };

  onPressureUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    deviceId: string,
    emitter: (arg0: {
      type: string;
      payload: { deviceId: string; pressure: Pressure } | string;
    }) => void,
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

      console.log('PRESSURE RECEIVED: ', pressure);

      emitter({ type: sagaActionConstants.UPDATE_PRESSURE, payload: { deviceId, pressure } });
    }
  };

  startStreamingData = async (
    deviceId: string,
    emitter: (arg0: {
      type: string;
      payload: { deviceId: string; pressure: Pressure } | string;
    }) => void,
  ) => {
    await this.devices[deviceId]?.discoverAllServicesAndCharacteristics();

    this.devices[deviceId]?.monitorCharacteristicForService(
      BLOOD_PRESSURE_SERVICE_UUID,
      BLOOD_PRESSURE_CHARACTERISTIC_UUID,
      (error, characteristic) => this.onPressureUpdate(error, characteristic, deviceId, emitter),
    );
  };
}

const bluetoothLeManager = new BluetoothLeManager();

export default bluetoothLeManager;
