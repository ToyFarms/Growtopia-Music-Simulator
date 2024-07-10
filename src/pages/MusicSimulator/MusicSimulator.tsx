import { useEffect } from "react";
import { GLCanvas } from "./GLCanvas";
import { GTAudioEngine } from "./audio";
import { Note } from "./audio/note";
import { parse_midi } from "./midi";

export const MusicSimulatorPage = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
    const audio_engine = new GTAudioEngine()
    audio_engine.play_from_note(Note.from_notation("Db1")!, "piano");
    parse_midi("test.mid").then((midi) => {
      console.log(midi)
    });
  }, []);

  return (
    <>
      <GLCanvas />
    </>
  );
};
