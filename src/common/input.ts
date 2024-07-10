import { vec2 } from "gl-matrix";
import "hammerjs";

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
  abs_pos: vec2;
}

export class InputHandler {
  state: { [key: string]: boolean };
  mouse: MouseState;
  private raf_id: number | null;
  element: HTMLElement | null;

  constructor(element?: HTMLElement) {
    this.state = {};
    this.mouse = {
      left: false,
      middle: false,
      right: false,
      wheel: { x: 0, y: 0, z: 0 },
      pos: [0, 0],
      abs_pos: [0, 0],
    };
    this.raf_id = null; this.element = element || null; document.addEventListener("keydown", (e) => this.handle_key(e, true));
    document.addEventListener("keyup", (e) => this.handle_key(e, false));
    document.addEventListener("mousedown", (e) => this._mousedown(e, true));
    document.addEventListener("mouseup", (e) => this._mousedown(e, false));
    document.addEventListener("wheel", (e) =>
      this.wheel(e.deltaX, e.deltaY, e.deltaZ),
    );
    document.addEventListener("mousemove", (e) => this._mousemove(e));

    const hammer = new Hammer(this.element || document.getElementById("app")!);
    hammer.get("pinch").set({ enable: true });

    hammer.on("pan", (e) => {
      this.set_mouse_pos([e.pointers[0].x, e.pointers[0].y]);
      this.mouse.left = true;
    });

    let last_scale = 0;
    hammer.on("pinch", (e) => {
      if (!this.in_focus()) return;
      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        this.set_mouse_pos([rect.x + rect.width / 2, rect.y + rect.height / 2]);
      }
      else {
        this.set_mouse_pos([window.innerWidth / 2, window.innerHeight / 2]);
      }

      this.wheel(0, last_scale - e.scale, 0);
      last_scale = e.scale;
    });

    document.addEventListener("touchend", () => {
      this.mouse.left = false;
      last_scale = 0;
    })
  }

  private in_focus(): boolean {
    if (!this.element) return true;

    const rect = this.element.getBoundingClientRect();
    return (
      this.mouse.abs_pos[0] >= rect.left &&
      this.mouse.abs_pos[0] < rect.right &&
      this.mouse.abs_pos[1] >= rect.top &&
      this.mouse.abs_pos[1] < rect.bottom
    );
  }

  private get_offset(): vec2 {
    const offset: vec2 = [0, 0];
    if (this.element) {
      const rect = this.element.getBoundingClientRect();
      offset[0] = rect.x;
      offset[1] = rect.y;
    }

    return offset;
  }

  private set_mouse_pos(abs: vec2) {
    this.mouse.abs_pos = [...abs] as vec2;
    if (this.in_focus()) {
      const offset = this.get_offset();
      this.mouse.pos[0] = abs[0] - offset[0];
      this.mouse.pos[1] = abs[1] - offset[1];
    }
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
    this.set_mouse_pos([e.x, e.y]);
  }

  private wheel(x: number, y: number, z: number) {
    if (!this.in_focus()) return;

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
      console.error(`Unhandled key: ${e.key.toUpperCase()}`);
    }
    this.state[name_to_code[e.key.toUpperCase()]] =
      flag || e.type === "keydown";
  }
}
