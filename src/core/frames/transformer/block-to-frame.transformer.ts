import { BlockData } from "../../blockly/dto/block.type";
import { Timeline, ArduinoFrame } from "../arduino.frame";
import { rfidSetup } from "./blocktoframe/rfid";
import _ from "lodash";
import { messageSetup, arduinoSendMessage } from "./blocktoframe/message";
import {
  digitalWrite,
  analogWrite,
} from "../../../blocks/writepin/blocktoframe";
import { timeSetup } from "./blocktoframe/time";
import {
  lcdScreenSetup,
  lcdSimplePrint,
  lcdScroll,
  lcdPrint,
  lcdBlink,
  lcdClear,
  lcdBacklight,
} from "../../../blocks/lcd_screen/blocktoframe";
import { setupReadPin } from "./blocktoframe/pin";
import { ultraSonicSensor } from "./blocktoframe/ultra_sonic_sensor";
import { servoRotate } from "./blocktoframe/servo";
import { tempSetupSensor } from "./blocktoframe/temp_setup";
import { VariableData } from "../../blockly/dto/variable.type";
import {
  createListNumberState,
  createListStringState,
  createListBoolState,
  createListColorState,
  setStringInList,
  setNumberInList,
  setColorInList,
  setBooleanInList,
} from "./blocktoframe/list";
import { setVariable } from "./blocktoframe/set_variables";
import { ifElse } from "./blocktoframe/logic";
import { simpleLoop, forLoop } from "./blocktoframe/loop";
import { delayBlock } from "./blocktoframe/delay";
import { PinPicture } from "../arduino-components.state";
import { moveMotor } from "./blocktoframe/motor";
import { rfidScannedCard } from "./blocktovalue/rfid";
import {
  findBlockById,
  findInputStatementStartBlock,
} from "../../blockly/helpers/block-data.helper";
import {
  bluetoothMessage,
  bluetoothSetup,
} from "../../../blocks/bluetooth/blocktoframe";
import { debugBlock } from "../../../blocks/debug/blocktoframe";
import { buttonSetup } from "../../../blocks/button/blocktoframe";
import { irRemoteSetup } from "../../../blocks/ir_remote/blocktoframe";
import { customBlock } from "../../../blocks/functions/blocktoframe";
import {
  neoPixelSetup,
  setNeoPixelColor,
} from "../../../blocks/neopixels/blocktoframe";
import {
  ledMatrixDraw,
  ledMatrixOnLed,
  ledMatrixSetup,
} from "../../../blocks/led_matrix/blocktoframe";
import {
  ledColorSetup,
  setLedColor,
} from "../../../blocks/rgbled/blocktoframe";
import { led, ledFade } from "../../../blocks/led/blocktoframe";

export interface BlockToFrameTransformer {
  (
    blocks: BlockData[],
    block: BlockData,
    variables: VariableData[],
    timeline: Timeline,
    previousState?: ArduinoFrame
  ): ArduinoFrame[];
}

const blockToFrameTransformerList: {
  [blockName: string]: BlockToFrameTransformer;
} = {
  rfid_setup: rfidSetup,
  bluetooth_setup: bluetoothSetup,
  message_setup: messageSetup,
  time_setup: timeSetup,
  lcd_setup: lcdScreenSetup,
  neo_pixel_setup: neoPixelSetup,
  rgb_led_setup: ledColorSetup,
  analog_read_setup: setupReadPin,
  digital_read_setup: setupReadPin,
  button_setup: buttonSetup,
  ir_remote_setup: irRemoteSetup,
  ultra_sonic_sensor_setup: ultraSonicSensor,
  temp_setup: tempSetupSensor,
  create_list_number_block: createListNumberState,
  create_list_string_block: createListStringState,
  create_list_boolean_block: createListBoolState,
  create_list_colour_block: createListColorState,
  set_string_list_block: setStringInList,
  set_boolean_list_block: setBooleanInList,
  set_colour_list_block: setColorInList,
  set_number_list_block: setNumberInList,
  variables_set_number: setVariable,
  variables_set_string: setVariable,
  variables_set_boolean: setVariable,
  variables_set_colour: setVariable,
  debug_block: debugBlock,
  control_if: ifElse,
  controls_ifelse: ifElse,

  controls_repeat_ext: simpleLoop,
  controls_for: forLoop,
  procedures_callnoreturn: customBlock,

  delay_block: delayBlock,

  arduino_send_message: arduinoSendMessage,

  bluetooth_send_message: bluetoothMessage,

  lcd_screen_simple_print: lcdSimplePrint,
  lcd_scroll: lcdScroll,
  lcd_screen_print: lcdPrint,
  lcd_blink: lcdBlink,
  lcd_screen_clear: lcdClear,
  lcd_backlight: lcdBacklight,

  led: led,
  digital_write: digitalWrite,
  analog_write: analogWrite,
  led_fade: ledFade,
  set_color_led: setLedColor,
  neo_pixel_set_color: setNeoPixelColor,

  led_matrix_make_draw: ledMatrixDraw,
  led_matrix_turn_one_on_off: ledMatrixOnLed,
  led_matrix_setup: ledMatrixSetup,

  rotate_servo: servoRotate,
  move_motor: moveMotor,
};

export const generateFrame: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  try {
    return blockToFrameTransformerList[block.blockName](
      blocks,
      block,
      variables,
      timeline,
      previousState
    );
  } catch (e) {
    console.log(block.blockName, "block name");
    throw e;
  }
};

export const generateInputFrame = (
  block: BlockData,
  blocks: BlockData[],
  variables: VariableData[],
  timeline: Timeline,
  inputName: string,
  previousState?: ArduinoFrame
): ArduinoFrame[] => {
  // Fixing memory sharing between objects
  previousState = previousState ? _.cloneDeep(previousState) : undefined;
  const startingBlock = findInputStatementStartBlock(blocks, block, inputName);
  if (!startingBlock) {
    return [];
  }
  const arduinoStates = [];
  let nextBlock = startingBlock;
  do {
    const states = generateFrame(
      blocks,
      nextBlock,
      variables,
      timeline,
      previousState
    );
    arduinoStates.push(...states);
    const newPreviousState = states[states.length - 1];
    previousState = _.cloneDeep(newPreviousState);
    nextBlock = findBlockById(blocks, nextBlock.nextBlockId);
  } while (nextBlock !== undefined);

  return arduinoStates;
};
