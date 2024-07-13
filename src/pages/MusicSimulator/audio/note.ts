export class Note {
  static mapping: { [key: number]: string } = {
    0: "C",
    2: "D",
    4: "E",
    5: "F",
    7: "G",
    9: "A",
    11: "B",
  };
  static mappingT: { [key: string]: number } = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };
  static note_indices: {[key: string]: number} = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6,
  }

  static accidentals = [1, 3, 6, 8, 10];
  static no_sharp_key = [4, 11];
  static no_flat_key = [5, 0];

  note: number;
  octave: number;

  constructor(note: number, octave: number) {
    this.note = note;
    this.octave = octave;
  }

  /* note that are sharp / flat (black key) */
  static is_accidental(note: number) {
    return Note.accidentals.includes(note);
  }
  is_accidental() {
    return Note.is_accidental(this.note);
  }

  static no_sharp(note: number) {
    return Note.no_sharp_key.includes(note);
  }
  no_sharp() {
    return Note.no_sharp(this.note);
  }

  static no_flat(note: number) {
    return Note.no_flat_key.includes(note);
  }
  no_flat() {
    return Note.no_flat(this.note);
  }

  to_string(prefer: "sharp" | "flat" = "flat") {
    const off = {
      sharp: -1,
      flat: 1,
    };

    if (this.is_accidental())
      return `${Note.mapping[this.note + off[prefer]]}${prefer === "sharp" ? "#" : "b"}${this.octave}`;
    return `${Note.mapping[this.note]}${this.octave}`;
  }

  to_parts(prefer: "sharp" | "flat" = "flat"): [string, string | null, number] {
    const off = {
      sharp: -1,
      flat: 1,
    };

    if (this.is_accidental())
      return [Note.mapping[this.note + off[prefer]], prefer, this.octave];
    return [Note.mapping[this.note], null, this.octave];
  }

  static from_code(code: number) {
    const octave = Math.floor(code / 12);
    const note = code % 12;
    return new Note(note, octave);
  }

  to_code() {
    return this.note + this.octave * 12;
  }

  static from_notation(notation: string): Note | null {
    enum State {
      NOTE = 0,
      SIGNATURE,
      OCTAVE,
      INVALID,
      END,
    }
    const isnumeric = (c: string) => !isNaN(parseInt(c, 10));

    let note = "";
    let signature: string | null = null;
    let octave = "";

    let state: State = State.NOTE;
    let ptr = 0;
    while (+state !== State.END) {
      const char = notation[ptr++];
      if (!char) state = State.END;
      switch (+state) {
        case State.NOTE:
          if (!(char.toUpperCase() in Note.mappingT)) {
            state = State.INVALID;
            break;
          }
          note = char;
          state = State.SIGNATURE;
          break;

        case State.SIGNATURE:
          if (isnumeric(char)) {
            state = State.OCTAVE;
            ptr--;
            break;
          }
          if (!["#", "b"].includes(char)) {
            state = State.INVALID;
            break;
          }
          signature = char;
          state = State.OCTAVE;
          break;

        case State.OCTAVE:
          if (isnumeric(char)) octave += char;
          else state = State.END;
          break;

        case State.INVALID:
          console.error(
            `Invalid notation: ${notation}, got note=${note} signature=${signature} octave=${octave}`,
          );
          return null;

        case State.END:
          break;
      }
    }

    if (signature === "#" && Note.no_sharp(Note.mappingT[note])) {
      console.error(`Key '${note}' does not have the sharp variant`);
      return null;
    }
    if (signature === "b" && Note.no_flat(Note.mappingT[note])) {
      console.error(`Key '${note}' does not have the sharp variant`);
      return null;
    }

    let off = 0;
    if (signature) off = signature === "#" ? 1 : -1;
    return new Note(Note.mappingT[note] + off, parseInt(octave, 10) || 0);
  }

  transpose(tone: number): Note {
    const octave = Math.floor(tone / 12);
    const note = tone % 12;

    this.octave += octave;
    this.note += note;

    return this;
  }
}
