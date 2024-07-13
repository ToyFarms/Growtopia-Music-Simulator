import { useEffect } from "react";
import { GLCanvas } from "./GLCanvas";
import { GTAudioEngine } from "./audio";
import { Note } from "./audio/note";
import { parse_midi } from "./midi";
import { GTNoteRenderable } from "./gl/renderable/gt_note_renderable";
import { GLContext } from "./gl/context";
import { QuadRenderable } from "./gl/renderable/quad_renderable";
import { InputHandler, Key } from "../../common/input";

export const MusicSimulatorPage = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
    const audio_engine = new GTAudioEngine();
    const input_handler = new InputHandler();

    parse_midi("Moonlight-Sonata_3rd-mov.mid").then((midi) => {
      // parse_midi("test.mid").then((midi) => {
      const notes = midi.map((note) => {
        return {
          start: note.start,
          duration: note.duration,
          note: Note.from_code(note.note).transpose(-12 * 3),
        };
      });
      GLContext.add_renderable(new GTNoteRenderable(GLContext.gl, notes));
      const timeline = new QuadRenderable(GLContext.gl, [0, 0], [10, 10000]);
      GLContext.add_renderable(timeline);

      let start = -1;
      let last_index = 0;
      let timescale = 1;

      const audio = (now: number) => {
        if (input_handler.keydown(Key.RIGHT)) {
          timescale += 1;
        }
        if (start < 0) start = now;
        const timestamp = (now - start) / 1000;
        timeline.pos[0] = timestamp * timescale * 32;

        requestAnimationFrame(audio);
        // notes.forEach((note, i) => {
        //   if (timestamp * timescale > note.start && i > last_index) {
        //     audio_engine.play_from_note(note.note, "piano");
        //     last_index = i;
        //     return;
        //   }
        // });
      };
      requestAnimationFrame(audio);
    });
  }, []);

  return (
    <>
      <GLCanvas />
    </>
  );
};
