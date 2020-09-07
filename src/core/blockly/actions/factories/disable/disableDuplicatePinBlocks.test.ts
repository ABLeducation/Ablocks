import "jest";
import "../../../blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg } from "blockly";
import {
  getAllBlocks,
  connectToArduinoBlock,
} from "../../../helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../../dto/event.type";
import { transformBlock } from "../../../transformers/block.transformer";
import { getAllVariables } from "../../../helpers/variable.helper";
import { transformVariable } from "../../../transformers/variables.transformer";
import { ActionType } from "../../actions";
import { ARDUINO_UNO_PINS } from "../../../../microcontroller/selectBoard";
import { disableDuplicatePinBlocks } from "./disableDuplicatePinBlocks";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../../tests/tests.helper";
import { MicroControllerType } from "../../../../microcontroller/microcontroller";

describe("disableDuplicatePinBlocks", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  test("should disable 2 setup blocks that are taking up the same pins", () => {
    const setupBlock = workspace.newBlock("rfid_setup");
    setupBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_10, "TX");

    const setupBlock2 = workspace.newBlock("bluetooth_setup");
    setupBlock2.setFieldValue(ARDUINO_UNO_PINS.PIN_10, "TX");

    const event = createTestEvent(arduinoBlock.id);

    const actions = disableDuplicatePinBlocks(event);

    expect(actions.length).toBe(2);
    expect(actions.map((a) => a.blockId)).toEqual([
      setupBlock.id,
      setupBlock2.id,
    ]);
    expect(actions[0].warningText).toBe(
      "This blocks has these duplicate pins: " + ARDUINO_UNO_PINS.PIN_10
    );
    expect(actions[1].warningText).toBe(
      "This blocks has these duplicate pins: " + ARDUINO_UNO_PINS.PIN_10
    );
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });

  test("should allow fade and regular leds to use the same pins", () => {
    const ledBlock = workspace.newBlock("led");
    ledBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, "PIN");

    const ledFadeBlock = workspace.newBlock("led_fade");
    ledFadeBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, "PIN");

    const event = createTestEvent(arduinoBlock.id);
    const actions = disableDuplicatePinBlocks(event);

    expect(actions).toEqual([]);
  });

  test("should disable setup block and servo block that share the same pin number", () => {
    const servoBlock = workspace.newBlock("rotate_servo") as BlockSvg;
    servoBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, "PIN");

    const servoBlock1 = workspace.newBlock("rotate_servo") as BlockSvg;
    servoBlock1.setFieldValue(ARDUINO_UNO_PINS.PIN_5, "PIN");

    const servoBlock2 = workspace.newBlock("rotate_servo") as BlockSvg;
    servoBlock2.setFieldValue(ARDUINO_UNO_PINS.PIN_7, "PIN");

    const servoBlock3 = workspace.newBlock("rotate_servo") as BlockSvg;
    servoBlock3.setFieldValue(ARDUINO_UNO_PINS.PIN_9, "PIN");

    const sensorBlock = workspace.newBlock("bluetooth_setup");
    sensorBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_9, "TX");
    sensorBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, "RX");
    connectToArduinoBlock(servoBlock);
    connectToArduinoBlock(servoBlock1);
    connectToArduinoBlock(servoBlock2);
    connectToArduinoBlock(servoBlock3);

    const event = createTestEvent(arduinoBlock.id);

    const actions = disableDuplicatePinBlocks(event);

    expect(actions.length).toBe(4);
    expect(actions.map((a) => a.blockId).sort()).toEqual(
      [servoBlock.id, servoBlock1.id, servoBlock3.id, sensorBlock.id].sort()
    );

    const setupBlockAction = actions.find((a) => a.blockId === sensorBlock.id);

    expect(setupBlockAction.warningText).toBe(
      "This blocks has these duplicate pins: " +
        ARDUINO_UNO_PINS.PIN_5 +
        ", " +
        ARDUINO_UNO_PINS.PIN_9
    );

    const servo3Action = actions.find((a) => a.blockId == servoBlock3.id);

    expect(servo3Action.warningText).toBe(
      "This blocks has these duplicate pins: " + ARDUINO_UNO_PINS.PIN_9
    );

    const servo1Action = actions.find((a) => a.blockId === servoBlock1.id);

    expect(servo1Action.warningText).toBe(
      "This blocks has these duplicate pins: " + ARDUINO_UNO_PINS.PIN_5
    );
  });

  test("should not disable setup block and non setup block if non setup block is not connected a function, loop, or arduino setup ", () => {
    const servoBlock = workspace.newBlock("rotate_servo") as BlockSvg;
    servoBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_9, "PIN");

    const sensorBlock = workspace.newBlock("rfid_setup");
    sensorBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_9, "TX");

    const event = createTestEvent(arduinoBlock.id);

    const actions = disableDuplicatePinBlocks(event);

    expect(actions).toEqual([]);
  });

  test("sensor read block pins do not count against pin count", () => {
    const rfidBlockSetup = workspace.newBlock("rfid_setup");
    rfidBlockSetup.setFieldValue(ARDUINO_UNO_PINS.PIN_9, "TX");

    const buttonSetupBlock = workspace.newBlock("button_setup");
    buttonSetupBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_10, "PIN");

    const buttonPressedBlock = workspace.newBlock(
      "is_button_pressed"
    ) as BlockSvg;
    buttonPressedBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, "PIN");

    const event = createTestEvent(arduinoBlock.id);

    const actions = disableDuplicatePinBlocks(event);

    expect(actions).toEqual([]);
  });

  test("if 3 block intersect it should block all three of them", () => {
    const sensorBlock = workspace.newBlock("bluetooth_setup");
    sensorBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_9, "TX");
    sensorBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, "RX");

    const ledBlock = workspace.newBlock("led") as BlockSvg;
    ledBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, "PIN");
    connectToArduinoBlock(ledBlock);

    const buttonSetupBlock = workspace.newBlock("button_setup");
    buttonSetupBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_9, "PIN");

    const event = createTestEvent(arduinoBlock.id);

    const actions = disableDuplicatePinBlocks(event);

    expect(actions.length).toBe(3);
  });
});
