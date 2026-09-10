/* ============================================================
   Magic Keyboard with Touch ID — US ANSI layout, as data.
   widths are in key units (u). Every row sums to exactly 15u,
   which is what makes the deck read as a real Apple keyboard
   rather than a drawing of one.

   `id` matches KeyboardEvent.code wherever one exists, so a
   real keypress can light the matching cap on screen.
   ============================================================ */

export type IconName =
  | "brightnessLow"
  | "brightnessHigh"
  | "missionControl"
  | "spotlight"
  | "dictation"
  | "doNotDisturb"
  | "prev"
  | "playPause"
  | "next"
  | "mute"
  | "volDown"
  | "volUp"
  | "globe"
  | "touchId";

export type Align = "center" | "left" | "right";

export interface KeyDef {
  /** KeyboardEvent.code where one exists — used for physical-key mirroring */
  id: string;
  /** width in key units; defaults to 1 */
  w?: number;
  /** primary legend (the unshifted character, or the word on a modifier) */
  label?: string;
  /** the shifted character, printed above the primary on number/punct keys */
  shift?: string;
  /** modifier glyph — ⌘ ⌥ ⇧ ⌃ ⇥ ⇪ ⏎ ⌫ */
  glyph?: string;
  /** function-row icon */
  icon?: IconName;
  /** small F-number printed on the function row */
  fn?: string;
  /** legend alignment inside the cap */
  align?: Align;
}

export interface RowDef {
  /** row height in key units */
  h: number;
  keys: KeyDef[];
}

/* the function row is 14 keys sharing 15u */
const FN_W = 15 / 14;

export const FUNCTION_ROW: RowDef = {
  h: 0.55,
  keys: [
    { id: "Escape", w: FN_W, label: "esc", align: "left" },
    { id: "F1", w: FN_W, icon: "brightnessLow", fn: "F1" },
    { id: "F2", w: FN_W, icon: "brightnessHigh", fn: "F2" },
    { id: "F3", w: FN_W, icon: "missionControl", fn: "F3" },
    { id: "F4", w: FN_W, icon: "spotlight", fn: "F4" },
    { id: "F5", w: FN_W, icon: "dictation", fn: "F5" },
    { id: "F6", w: FN_W, icon: "doNotDisturb", fn: "F6" },
    { id: "F7", w: FN_W, icon: "prev", fn: "F7" },
    /* ── the one that matters ── */
    { id: "F8", w: FN_W, icon: "playPause", fn: "F8" },
    { id: "F9", w: FN_W, icon: "next", fn: "F9" },
    { id: "F10", w: FN_W, icon: "mute", fn: "F10" },
    { id: "F11", w: FN_W, icon: "volDown", fn: "F11" },
    { id: "F12", w: FN_W, icon: "volUp", fn: "F12" },
    { id: "TouchID", w: FN_W, icon: "touchId" },
  ],
};

export const NUMBER_ROW: RowDef = {
  h: 1,
  keys: [
    { id: "Backquote", label: "`", shift: "~" },
    { id: "Digit1", label: "1", shift: "!" },
    { id: "Digit2", label: "2", shift: "@" },
    { id: "Digit3", label: "3", shift: "#" },
    { id: "Digit4", label: "4", shift: "$" },
    { id: "Digit5", label: "5", shift: "%" },
    { id: "Digit6", label: "6", shift: "^" },
    { id: "Digit7", label: "7", shift: "&" },
    { id: "Digit8", label: "8", shift: "*" },
    { id: "Digit9", label: "9", shift: "(" },
    { id: "Digit0", label: "0", shift: ")" },
    { id: "Minus", label: "-", shift: "_" },
    { id: "Equal", label: "=", shift: "+" },
    { id: "Backspace", w: 2, label: "delete", glyph: "⌫", align: "right" },
  ],
};

export const TAB_ROW: RowDef = {
  h: 1,
  keys: [
    { id: "Tab", w: 1.5, label: "tab", glyph: "⇥", align: "left" },
    { id: "KeyQ", label: "Q" },
    { id: "KeyW", label: "W" },
    { id: "KeyE", label: "E" },
    { id: "KeyR", label: "R" },
    { id: "KeyT", label: "T" },
    { id: "KeyY", label: "Y" },
    { id: "KeyU", label: "U" },
    { id: "KeyI", label: "I" },
    { id: "KeyO", label: "O" },
    { id: "KeyP", label: "P" },
    { id: "BracketLeft", label: "[", shift: "{" },
    { id: "BracketRight", label: "]", shift: "}" },
    { id: "Backslash", w: 1.5, label: "\\", shift: "|" },
  ],
};

export const HOME_ROW: RowDef = {
  h: 1,
  keys: [
    { id: "CapsLock", w: 1.75, label: "caps lock", glyph: "⇪", align: "left" },
    { id: "KeyA", label: "A" },
    { id: "KeyS", label: "S" },
    { id: "KeyD", label: "D" },
    { id: "KeyF", label: "F" },
    { id: "KeyG", label: "G" },
    { id: "KeyH", label: "H" },
    { id: "KeyJ", label: "J" },
    { id: "KeyK", label: "K" },
    { id: "KeyL", label: "L" },
    { id: "Semicolon", label: ";", shift: ":" },
    { id: "Quote", label: "'", shift: '"' },
    { id: "Enter", w: 2.25, label: "return", glyph: "⏎", align: "right" },
  ],
};

export const SHIFT_ROW: RowDef = {
  h: 1,
  keys: [
    { id: "ShiftLeft", w: 2.25, label: "shift", glyph: "⇧", align: "left" },
    { id: "KeyZ", label: "Z" },
    { id: "KeyX", label: "X" },
    { id: "KeyC", label: "C" },
    { id: "KeyV", label: "V" },
    { id: "KeyB", label: "B" },
    { id: "KeyN", label: "N" },
    { id: "KeyM", label: "M" },
    { id: "Comma", label: ",", shift: "<" },
    { id: "Period", label: ".", shift: ">" },
    { id: "Slash", label: "/", shift: "?" },
    { id: "ShiftRight", w: 2.75, label: "shift", glyph: "⇧", align: "right" },
  ],
};

/* bottom row stops before the arrow cluster — the cluster is its
   own 3u block because up/down are half-height (the inverted T) */
export const BOTTOM_ROW: RowDef = {
  h: 1,
  keys: [
    { id: "Fn", label: "fn", icon: "globe", align: "left" },
    { id: "ControlLeft", label: "control", glyph: "⌃" },
    { id: "AltLeft", label: "option", glyph: "⌥" },
    { id: "MetaLeft", w: 1.25, label: "command", glyph: "⌘" },
    { id: "Space", w: 5.5 },
    { id: "MetaRight", w: 1.25, label: "command", glyph: "⌘" },
    { id: "AltRight", label: "option", glyph: "⌥" },
  ],
};

export const ARROW_LEFT: KeyDef = { id: "ArrowLeft", label: "◀" };
export const ARROW_UP: KeyDef = { id: "ArrowUp", label: "▲" };
/* ── the second one that matters ── */
export const ARROW_DOWN: KeyDef = { id: "ArrowDown", label: "▼" };
export const ARROW_RIGHT: KeyDef = { id: "ArrowRight", label: "▶" };

export const ROWS: RowDef[] = [
  FUNCTION_ROW,
  NUMBER_ROW,
  TAB_ROW,
  HOME_ROW,
  SHIFT_ROW,
  BOTTOM_ROW,
];

/** the two keys the whole hero interaction hangs on */
export const POWER_KEY = "F8";
export const SCROLL_KEY = "ArrowDown";

/** total deck width in key units */
export const DECK_UNITS = 15;
