// Each voice is an array of [key, duration] pairs in VexFlow format.
// Keys: 'b/4', 'g/5', etc. Durations: 'w' 'h' 'q' '8' '16', append 'r' for rests.
export const fills = [
  {
    id: 'fill-001',
    voices: {
      crash:    [['b/4', 'wr']],
      hihat:    [['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q']],
      highTom:  [['b/4', 'hr'], ['b/4', 'qr'], ['e/5', 'q']],
      midTom:   [['b/4', 'wr']],
      floorTom: [['b/4', 'wr']],
      snare:    [['b/4', 'qr'], ['b/4', 'q'], ['b/4', 'qr'], ['b/4', 'q']],
      kick:     [['c/4', 'q'], ['b/4', 'qr'], ['c/4', 'q'], ['b/4', 'qr']],
    },
  },
  {
    id: 'fill-002',
    voices: {
      crash:    [['b/4', 'wr']],
      hihat:    [['b/4', 'wr']],
      highTom:  [['b/4', 'qr'], ['e/5', 'q'], ['b/4', 'hr']],
      midTom:   [['b/4', 'hr'], ['d/5', 'q'], ['b/4', 'qr']],
      floorTom: [['b/4', 'hr'], ['b/4', 'qr'], ['a/4', 'q']],
      snare:    [['b/4', 'q'], ['b/4', 'hr'], ['b/4', 'qr']],
      kick:     [['c/4', 'q'], ['b/4', 'qr'], ['b/4', 'hr']],
    },
  },
  {
    id: 'fill-003',
    voices: {
      crash:     [['b/4', 'wr']],
      hihatOpen: [['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q']],
      highTom:   [['b/4', 'wr']],
      midTom:    [['b/4', 'wr']],
      floorTom:  [['b/4', 'wr']],
      snare: [
        ['b/4', 'qr'],
        ['b/4', 'q', new Vex.Flow.GraceNoteGroup([new Vex.Flow.GraceNote({ keys: ['b/4'], duration: '8', slash: true })])],
        ['b/4', 'qr'],
        ['b/4', 'q'],
      ],
      hihatFoot: [['e/4', 'q'], ['e/4', 'qr'], ['e/4', 'q'], ['e/4', 'qr']],
      kick:      [['c/4', 'q'], ['b/4', 'qr'], ['c/4', 'q'], ['b/4', 'qr']],
    },
  },
];
