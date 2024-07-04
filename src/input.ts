import { vec2 } from "gl-matrix";
import { log_error } from "./logger";

/* https://gist.github.com/whitewhidow/6319198 */
const name_to_code: { [key: string]: number } = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CONTROL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPSLOCK: 20,
  ESCAPE: 27,
  SPACE: 32,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  ARROWLEFT: 37,
  ARROWUP: 38,
  ARROWRIGHT: 39,
  ARROWDOWN: 40,
  INSERT: 45,
  DELETE: 46,
  "0": 48,
  "1": 49,
  "2": 50,
  "3": 51,
  "4": 52,
  "5": 53,
  "6": 54,
  "7": 55,
  "8": 56,
  "9": 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  WINDOWS: 91,
  "RIGHT CLICK": 93,
  "NUMPAD 0": 96,
  "NUMPAD 1": 97,
  "NUMPAD 2": 98,
  "NUMPAD 3": 99,
  "NUMPAD 4": 100,
  "NUMPAD 5": 101,
  "NUMPAD 6": 102,
  "NUMPAD 7": 103,
  "NUMPAD 8": 104,
  "NUMPAD 9": 105,
  "NUMPAD *": 106,
  "NUMPAD +": 107,
  "NUMPAD -": 109,
  "NUMPAD .": 110,
  "NUMPAD /": 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  "NUM LOCK": 144,
  "SCROLL LOCK": 145,
  "MY COMPUTER": 182,
  "MY CALCULATOR": 183,
  ";": 186,
  "=": 187,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "`": 192,
  "[": 219,
  "\\": 220,
  "]": 221,
  "'": 222,
};

export enum Key {
  BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  SHIFT = 16,
  CTRL = 17,
  ALT = 18,
  PAUSEBREAK = 19,
  CAPSLOCK = 20,
  ESC = 27,
  SPACE = 32,
  PAGEUP = 33,
  PAGEDOWN = 34,
  END = 35,
  HOME = 36,
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
  INSERT = 45,
  DELETE = 46,
  ZERO = 48,
  ONE = 49,
  TWO = 50,
  THREE = 51,
  FOUR = 52,
  FIVE = 53,
  SIX = 54,
  SEVEN = 55,
  EIGHT = 56,
  NINE = 57,
  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,
  WINDOWS = 91,
  RIGHTCLICK = 93,
  NUMPAD0 = 96,
  NUMPAD1 = 97,
  NUMPAD2 = 98,
  NUMPAD3 = 99,
  NUMPAD4 = 100,
  NUMPAD5 = 101,
  NUMPAD6 = 102,
  NUMPAD7 = 103,
  NUMPAD8 = 104,
  NUMPAD9 = 105,
  NUMPADMUL = 106,
  NUMPADADD = 107,
  NUMPADSUB = 109,
  NUMPADDOT = 110,
  NUMPADSLASH = 111,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,
  NUMLOCK = 144,
  SCROLLLOCK = 145,
  MYCOMPUTER = 182,
  MYCALCULATOR = 183,
  SEMICOLON = 186,
  EQUAL = 187,
  COMMA = 188,
  DASH = 189,
  DOT = 190,
  SLASH = 191,
  BACKTICK = 192,
  LEFTSQRBRACKET = 219,
  BACKSLASH = 220,
  RIGHTSQRBRACKET = 221,
  SINGLEQUOTE = 222,
}

interface MouseState {
  left: boolean;
  middle: boolean;
  right: boolean;
  wheel: { x: number; y: number; z: number };
  pos: vec2;
}

export class InputHandler {
  state: { [key: string]: boolean };
  mouse: MouseState;
  private raf_id: number | null;

  constructor() {
    this.state = {};
    this.mouse = {
      left: false,
      middle: false,
      right: false,
      wheel: { x: 0, y: 0, z: 0 },
      pos: [0, 0],
    };
    this.raf_id = null;
    document.addEventListener("keydown", (e) => this.handle_key(e, true));
    document.addEventListener("keyup", (e) => this.handle_key(e, false));
    document.addEventListener("mousedown", (e) => this._mousedown(e, true));
    document.addEventListener("mouseup", (e) => this._mousedown(e, false));
    document.addEventListener("wheel", (e) => this.wheel(e.deltaX, e.deltaY, e.deltaZ));
    document.addEventListener("mousemove", (e) => this._mousemove(e))

    const get_touch_pos = (e: TouchEvent): vec2 => {
      if (e.touches.length === 1)
        return [e.touches[0].pageX, e.touches[0].pageY];
      else if (e.touches.length >= 2)
        return [
          (e.touches[0].pageX + e.touches[1].pageX) / 2,
          (e.touches[0].pageY + e.touches[1].pageY) / 2,
      ];
      else return [0, 0];
    }
    const get_touch_distance = (touch: TouchList) => {
      if (touch.length < 2) return 0;
      return Math.sqrt((touch[1].pageX - touch[0].pageX) ** 2 + (touch[1].pageY - touch[0].pageY) ** 2);
    }

    let initial_distance = 0;
    document.addEventListener("touchstart", (e) => {
      if (e.touches.length < 2)
      {
        this.mouse.left = true;
        this.mouse.pos = get_touch_pos(e);
      }
      initial_distance = get_touch_distance(e.touches);
    });
    document.addEventListener("touchmove", (e) => {
      this.mouse.pos = get_touch_pos(e);

      const distance = get_touch_distance(e.touches);
      if (initial_distance !== 0) {
        this.wheel(0, initial_distance - distance, 0);
      }
    });
    document.addEventListener("touchend", () => {
      this.mouse.left = false;
      initial_distance = 0;
    });
  }

  keydown(code: Key): boolean {
    return this.state[code];
  }

  private _mousedown(e: MouseEvent, flag?: boolean) {
    const is_down = flag || e.type === "mousedown";
    this.mouse.left = e.button === 0 && is_down;
    this.mouse.middle = e.button === 1 && is_down;
    this.mouse.right = e.button === 2 && is_down;
  }

  private _mousemove(e: MouseEvent) {
    this.mouse.pos[0] = e.x;
    this.mouse.pos[1] = e.y;
  }

  private wheel(x: number, y: number, z: number) {
    this.mouse.wheel.x = x;
    this.mouse.wheel.y = y;
    this.mouse.wheel.z = z;

    if (!this.raf_id) {
      this.raf_id = requestAnimationFrame(() => {
        this.mouse.wheel.x = 0;
        this.mouse.wheel.y = 0;
        this.mouse.wheel.z = 0;
        this.raf_id = null;
      });
    }
  }

  private handle_key(e: KeyboardEvent, flag?: boolean) {
    if (!(e.key.toUpperCase() in name_to_code)) {
      log_error(`Unhandled key: ${e.key.toUpperCase()}`);
    }
    this.state[name_to_code[e.key.toUpperCase()]] =
      flag || e.type === "keydown";
  }
}
