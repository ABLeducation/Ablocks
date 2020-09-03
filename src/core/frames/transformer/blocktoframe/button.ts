import { ButtonState } from "../../arduino-components.state";
import { ArduinoComponentType } from "../../arduino.frame";
import { ButtonSensor } from "../../../blockly/dto/sensors.type";
import { arduinoFrameByComponent } from "../frame-transformer.helpers";
import { BlockToFrameTransformer } from "../block-to-frame.interface";

export const buttonSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const btnDatum = JSON.parse(block.metaData) as ButtonSensor[];
  const btnData = btnDatum.find((d) => d.loop === 1);

  const [pin] = block.pins;

  const buttonState: ButtonState = {
    type: ArduinoComponentType.BUTTON,
    pins: block.pins,
    isPressed: btnData.is_pressed,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      buttonState,
      `button ${pin} is being setup.`,
      previousState
    ),
  ];
};
