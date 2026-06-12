export const fills = [
  {
    // Fill 1: Driving pattern — hi-hat on every beat, high tom on beat 4
    id: 'fill-001',
    voices: {
      crash:    'r/w',
      hihat:    'G5/q, G5/q, G5/q, G5/q',
      highTom:  'r/h, r/q, E5/q',
      midTom:   'r/w',
      floorTom: 'r/w',
      snare:    'r/q, B4/q, r/q, B4/q',
      kick:     'C4/q, r/q, C4/q, r/q',
    },
  },
  {
    // Fill 2: Descending tom fill — snare+kick leadoff, toms cascade on beats 2, 3, 4
    id: 'fill-002',
    voices: {
      crash:    'r/w',
      hihat:    'r/w',
      highTom:  'r/q, E5/q, r/h',
      midTom:   'r/h, D5/q, r/q',
      floorTom: 'r/h, r/q, A4/q',
      snare:    'B4/q, r/h, r/q',
      kick:     'C4/q, r/q, r/h',
    },
  },
];
