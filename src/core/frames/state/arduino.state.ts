import { ARDUINO_UNO_PINS } from '../../../constants/arduino';

export interface ArduinoState {
  blockId: string;
  timeLine: Timeline;
  explanation: string;
  components: ArduinoComponentState[];
  variables: { [key: string]: Variable };
  txLedOn: boolean;
  rxLedOn: boolean
  sendMessage: string; // message arduino is sending
  delay: number; // Number of milliseconds to delay
  powerLedOn: boolean;
}

export interface Variable {
  name: string;
  value:
    | number
    | string
    | boolean
    | Color
    | number[]
    | string[]
    | boolean[]
    | Color[];
  type:
    | 'color'
    | 'number'
    | 'string'
    | 'boolean'
    | 'List Number'
    | 'List String'
    | 'List Boolean'
    | 'List Colour';
}

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export interface Timeline {
  iteration: number;

  function: 'setup' | 'loop' | 'pre-setup';
}

export interface ArduinoComponentState {
  pins: ARDUINO_UNO_PINS[];
  type: ArduinoComponentType;
}

export enum ArduinoComponentType {
  SERVO = 'SERVO',
  EMPTY = 'EMPTY',
  LCD_SCREEN = 'LCD_SCREEN',
  LED_MATRIX = 'LED_MATRIX',
  NEO_PIXEL_STRIP = 'NEO_PIXEL_STRIP',
  MOTOR = 'MOTOR',
  PIN = 'PIN',
  ARDUINO = 'ARDUINO',
  BLUE_TOOTH = 'BLUE_TOOTH',
  LED_COLOR = 'LED_COLOR',
  RFID = 'RFID',
  BUTTON = 'BUTTON',
  MESSAGE = 'MESSAGE',
  TIME = 'TIME',
  IR_REMOTE = 'IR_REMOTE',
  ULTRASONICE_SENSOR = 'ULTRASONICE_SENSOR',
  TEMPERATURE_SENSOR = 'TEMPERATURE_SENSOR'
}