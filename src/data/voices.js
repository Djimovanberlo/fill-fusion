import { COLORS } from "./colors.js";

export const VOICE_CONFIG = {
  crash: { isXHead: true, stemDirection: 1 },
  hihat: { isXHead: true, stemDirection: 1 },
  hihatOpen: { isXHead: true, stemDirection: 1 },
  hihatFoot: { isXHead: true, stemDirection: -1 },
  highTom: { isXHead: false, stemDirection: 1 },
  midTom: { isXHead: false, stemDirection: 1 },
  floorTom: { isXHead: false, stemDirection: 1 },
  snare: { isXHead: false, stemDirection: 1 },
  kick: { isXHead: false, stemDirection: -1 },
};

export const VOICE_COLORS = {
  crash: COLORS.red,
  hihat: COLORS.blue,
  hihatOpen: COLORS.blue,
  hihatFoot: COLORS.navy,
  highTom: COLORS.teal,
  midTom: COLORS.yellow,
  floorTom: COLORS.orange,
  snare: COLORS.purple,
  kick: COLORS.darkTeal,
};
