import { AudioEngine, AudioSource } from "./audio_engine";
import { Note } from "./note";

export enum GTInstrumentType {
  SPECIAL,
  ONE_OCTAVE,
  TWO_OCTAVE,
}

export interface GTInstrument {
  name: string,
  type: GTInstrumentType,
  count: number,
}

export class GTAudioEngine extends AudioEngine {
  static instruments: GTInstrument[] = [
    {name: "bass",            type: GTInstrumentType.TWO_OCTAVE, count: 25},
    {name: "drum",            type: GTInstrumentType.SPECIAL,    count: 7},
    {name: "electric_guitar", type: GTInstrumentType.TWO_OCTAVE, count: 25},
    {name: "festive",         type: GTInstrumentType.SPECIAL,    count: 14},
    {name: "flute",           type: GTInstrumentType.TWO_OCTAVE, count: 25},
    {name: "lyre",            type: GTInstrumentType.TWO_OCTAVE, count: 25},
    {name: "mexican_trumpet", type: GTInstrumentType.TWO_OCTAVE, count: 25},
    {name: "piano",           type: GTInstrumentType.TWO_OCTAVE, count: 25},
    {name: "sax",             type: GTInstrumentType.TWO_OCTAVE, count: 25},
    {name: "spanish_guitar",  type: GTInstrumentType.TWO_OCTAVE, count: 25},
    {name: "spooky",          type: GTInstrumentType.SPECIAL,    count: 14},
    {name: "violin",          type: GTInstrumentType.TWO_OCTAVE, count: 25},
  ];

  static get_source(): AudioSource[] {
    const sources: AudioSource[] = [];
    const push = (i: number, instr: GTInstrument) => {
      sources.push({name: instr.name, src: `audio/${instr.name}_${i}.wav`});
    }

    for (const instr of GTAudioEngine.instruments) {
      if (instr.type == GTInstrumentType.SPECIAL && instr.name !== "drum") {
        const indices = [1, 3, 5, 6, 8, 10, 12, 13, 15, 17, 18, 20, 22, 24];
        for (const index of indices)
          push(index, instr);
      }
      else {
        for (let i = 0; i < instr.count; i++)
          push(i, instr);
      }
    }

    return sources;
  }

  constructor() {
    super(GTAudioEngine.get_source())
  }

  play_from_note(note: Note, instrument: string) {
    this.sources.find((v) => v.src.includes(`${instrument}_${note.to_code()}.wav`))?.audio?.play();
  }
}
