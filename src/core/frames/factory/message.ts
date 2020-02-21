import { StateGenerator } from './state.factories';
import { ArduinoMessageState } from '../state/arduino-components.state';
import { BluetoothSensor } from '../../blockly/state/sensors.state';
import { createArduinoState } from './factory.helpers';
import { ArduinoComponentType } from '../state/arduino.state';

export const messageSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {

  const messageDatum = JSON.parse(block.metaData) as BluetoothSensor[];
  const messbtnData = messageDatum.find(d => d.loop == 1);

  const messageComponent: ArduinoMessageState = {
    pins: block.pins,
    hasMessage: messbtnData.receiving_message,
    message: messbtnData.message,
    sendMessage: '',
    type: ArduinoComponentType.MESSAGE
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      messageComponent,
      'Setting up Arduino messages.',
      previousState
    )
  ];
};
