import { StateGenerator } from './state.factories';
import { getSensorData } from '../../blockly/transformers/sensor-data.transformer';
import { BluetoothSensor } from '../../blockly/state/sensors.state';
import { BluetoothState } from '../state/arduino-components.state';
import { ArduinoComponentType } from '../state/arduino.state';
import { createArduinoState } from './factory.helpers';


export const bluetoothSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const sensorData = getSensorData(blocks);

  const bluetoothSensorLoop1 = sensorData.find(
    // loop should always be 1 because it's a pre setup block
    // Meaning it's never in the loop or setup
    (s) => s.blockName === block.blockName && s.loop === 1
  ) as BluetoothSensor;

  const bluetoothComponent: BluetoothState = {
    pins: block.pins,
    type: ArduinoComponentType.BLUE_TOOTH,
    rxPin: block.fieldValues.find((f) => f.name == 'RX').value,
    txPin: block.fieldValues.find((f) => f.name == 'TX').value,
    hasMessage: bluetoothSensorLoop1.receiving_message,
    receivedMessage: bluetoothSensorLoop1.message,
    sendMessage: ''
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      bluetoothComponent,
      'Setting up Bluetooth.',
      previousState
    )
  ];


}