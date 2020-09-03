import { ArduinoComponentType } from "../../arduino.frame";
import { RfidState } from "../../arduino-components.state";
import { RFIDSensor } from "../../../blockly/dto/sensors.type";
import { arduinoFrameByComponent } from "../frame-transformer.helpers";
import { findFieldValue } from "../../../blockly/helpers/block-data.helper";
import { BlockToFrameTransformer } from "../block-to-frame.interface";

export const rfidSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorData = JSON.parse(block.metaData) as RFIDSensor[];

  const rfidSensorLoop1 = sensorData.find((s) => s.loop === 1) as RFIDSensor;

  const rfidComponent: RfidState = {
    pins: block.pins,
    type: ArduinoComponentType.RFID,
    txPin: findFieldValue(block, "TX"),
    scannedCard: rfidSensorLoop1.scanned_card,
    tag: rfidSensorLoop1.tag,
    cardNumber: rfidSensorLoop1.card_number,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      rfidComponent,
      "Setting up RFID.",
      previousState
    ),
  ];
};
