import * as Midi from "midi-json-parser";
import { IMidiNoteOnEvent, IMidiNoteOffEvent } from "midi-json-parser-worker";

export interface MidiEvent {
  start: number,
  duration: number,
  note: number,
}

export const parse_midi = async (src: string): Promise<MidiEvent[]> => {
  const raw = await (await fetch(src)).arrayBuffer();
  const midi = await Midi.parseArrayBuffer(raw);
  const result: MidiEvent[] = [];
  const notes = [];
  let timestamp = 0;

  for (const track of midi.tracks) {
    for (const event of track) {
      if (event.noteOn) {
        const e = event as IMidiNoteOnEvent;
        notes[e.noteOn.noteNumber] = { start: timestamp };
      } else if (event.noteOff) {
        const e = event as IMidiNoteOffEvent;
        const note = notes[e.noteOff.noteNumber];
        if (!note)
          continue;
        const start = note.start;

        result.push({
          start: start,
          duration: timestamp - start,
          note: e.noteOff.noteNumber,
        });
        notes[e.noteOff.noteNumber] = null;
      }

      timestamp += event.delta / 1000;
    }
  }

  return result;
};
