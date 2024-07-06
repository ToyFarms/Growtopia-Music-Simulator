const notation = [
  "C",
  "Cc-Db",
  "D",
  "Dc-Eb",
  "E",
  "F",
  "Fc-Gb",
  "G",
  "Gc-Ab",
  "A",
  "Ac-Bb",
  "B",
];

export interface Note {
  note: number,
  octave: number,
  repr: string,
}

export class Notation {
  note: number;
  octave: number;
  notes: Note[];

  constructor(note: number, octave: number, notes: Note[]) {
    this.note = note;
    this.octave = octave;
    this.notes = notes;
  }

  static from_number(code: number) {
    const octave = octave_from_code(code / 12);
    const note = code % 12;

    const notes: Note[] = [];
    for (const notation of Notation.code_to_repr(code)) {
      notes.push({note: note, octave: octave, repr: notation});
    }

    return new Notation(note, octave, notes);
  }

  static code_to_repr(code: number): string[] {
    const repr = notation[code % notation.length];
    const octave = octave_from_code(code);
    if (repr.includes("-")) {
      const [repr1, repr2] = repr.split("-");
      return [`${repr1}${octave}`, `${repr2}${octave}`]
    }
    else {
      return [`${repr}${octave}`]
    }
  }
}

export const octave_from_code = (code: number) => {
  return Math.floor(code / 12);
}
