import Vex from 'https://esm.sh/vexflow';
import { fills } from './data/fills.js';

const { StaveNote } = Vex.Flow;

// "B4" → "b/4", "G5" → "g/5"
function toVexPitch(str) {
  return str.slice(0, -1).toLowerCase() + '/' + str.slice(-1);
}

// Parses "B4/q, r/q, B4/8, B4/8" → StaveNote[]
function parseVoiceString(str, { isXHead = false, stemDirection = 1 } = {}) {
  return str.split(',').map(token => {
    const [pitchStr, dur] = token.trim().split('/');
    if (pitchStr === 'r') {
      return new StaveNote({ keys: ['b/4'], duration: dur + 'r' });
    }
    return new StaveNote({
      keys: [toVexPitch(pitchStr)],
      duration: dur,
      stemDirection,
      ...(isXHead ? { noteType: 'x' } : {}),
    });
  });
}

console.log('Fill Fusion loaded', fills.length, 'fills');
