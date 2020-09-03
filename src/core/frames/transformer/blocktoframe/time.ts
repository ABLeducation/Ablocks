import { TimeState } from "../../arduino-components.state";
import { ArduinoComponentType } from "../../arduino.frame";
import { arduinoFrameByComponent } from "../frame-transformer.helpers";
import { findFieldValue } from "../../../blockly/helpers/block-data.helper";
import { BlockToFrameTransformer } from "../block-to-frame.interface";

export const timeSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const timeComonent: TimeState = {
    pins: block.pins,
    timeInSeconds: +findFieldValue(block, "time_in_seconds"),
    type: ArduinoComponentType.TIME,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      timeComonent,
      "Setting up Arduino time.",
      previousState
    ),
  ];
};
