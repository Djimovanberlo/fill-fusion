// Each voice is an array of [key, duration, ?modifier] tuples in VexFlow format.
// Keys: 'b/4', 'g/5', etc. Durations: 'w' 'h' 'q' '8' '16', append 'r' for rests.
// Optional third element: 'flam' adds a grace note before the note.

const notes = [
  // A quarter-note C.
  new StaveNote({ keys: ["c/4"], duration: "q" }),

  // A quarter-note D.
  new StaveNote({ keys: ["d/4"], duration: "q" }),

  // A quarter-note rest. Note that the key (b/4) specifies the vertical
  // position of the rest.
  new StaveNote({ keys: ["b/4"], duration: "qr" }),

  // A C-Major chord.
  new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
];

export const fills = [
  {
    id: "fill-001",
    voices: {
      crash: [["b/4", "w"]],
      hihat: [
        ["g/5", "8"],
        ["g/5", "8"],
        ["g/5", "8"],
        ["g/5", "8"],
        ["g/5", "8"],
        ["g/5", "8"],
        ["g/5", "8"],
        ["g/5", "8"],
      ],
      // highTom: [
      //   ["b/4", "hr"],
      //   ["b/4", "qr"],
      //   ["e/5", "q"],
      // ],
      // midTom: [["b/4", "wr"]],
      // floorTom: [["b/4", "wr"]],
      // snare: [
      //   ["b/4", "qr"],
      //   ["b/4", "q"],
      //   ["b/4", "qr"],
      //   ["b/4", "q"],
      // ],
      // kick: [
      //   ["c/4", "q"],
      //   ["b/4", "qr"],
      //   ["c/4", "q"],
      //   ["b/4", "qr"],
      // ],
    },
  },
  // {
  //   id: 'fill-002',
  //   voices: {
  //     crash:    [['b/4', 'wr']],
  //     hihat:    [['b/4', 'wr']],
  //     highTom:  [['b/4', 'qr'], ['e/5', 'q'], ['b/4', 'hr']],
  //     midTom:   [['b/4', 'hr'], ['d/5', 'q'], ['b/4', 'qr']],
  //     floorTom: [['b/4', 'hr'], ['b/4', 'qr'], ['a/4', 'q']],
  //     snare:    [['b/4', 'q'], ['b/4', 'hr'], ['b/4', 'qr']],
  //     kick:     [['c/4', 'q'], ['b/4', 'qr'], ['b/4', 'hr']],
  //   },
  // },
  // {
  //   id: 'fill-003',
  //   voices: {
  //     crash:     [['b/4', 'wr']],
  //     hihatOpen: [['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q'], ['g/5', 'q']],
  //     highTom:   [['b/4', 'wr']],
  //     midTom:    [['b/4', 'wr']],
  //     floorTom:  [['b/4', 'wr']],
  //     snare: [
  //       ['b/4', 'qr'],
  //       ['b/4', 'q', 'flam'],
  //       ['b/4', 'qr'],
  //       ['b/4', 'q'],
  //     ],
  //     hihatFoot: [['e/4', 'q'], ['e/4', 'qr'], ['e/4', 'q'], ['e/4', 'qr']],
  //     kick:      [['c/4', 'q'], ['b/4', 'qr'], ['c/4', 'q'], ['b/4', 'qr']],
  //   },
  // },
];
