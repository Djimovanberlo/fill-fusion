import { COLORS } from "./colors.js";

export const VOICE_CONFIG = {
  crash: { noteHead: "cx", stemDirection: 1 },
  ride: { noteHead: "cx", stemDirection: 1 },
  hihat: { noteHead: "x", stemDirection: 1 },
  hihatOpen: { noteHead: "x", stemDirection: 1 },
  hihatFoot: { noteHead: "x", stemDirection: -1 },
  highTom: { stemDirection: 1 },
  midTom: { stemDirection: 1 },
  floorTom: { stemDirection: 1 },
  snare: { stemDirection: 1 },
  kick: { stemDirection: -1 },
};

export const VOICE_COLORS = {
  crash: COLORS.red,
  ride: COLORS.red,
  hihat: COLORS.blue,
  hihatOpen: COLORS.blue,
  hihatFoot: COLORS.navy,
  highTom: COLORS.teal,
  midTom: COLORS.yellow,
  floorTom: COLORS.orange,
  snare: COLORS.purple,
  kick: COLORS.darkTeal,
};
