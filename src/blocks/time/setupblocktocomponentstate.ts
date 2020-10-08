import { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { TimeState } from "../../core/frames/arduino-components.state";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";

export const timeSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): TimeState => {
  return {
    type: ArduinoComponentType.TIME,
    pins: [],
    timeInSeconds:
      +timeline.iteration * +findFieldValue(block, "time_in_seconds"),
  };
};
