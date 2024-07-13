import { AtlasInfo, get_texture_bound, get_texture_index } from "../atlas";
import { Quad } from "../quad";
import { Renderable } from "../renderable";
import { Texture } from "../texture";
import { BatchRenderable } from "./batch_renderable";
import atlas_info_json from "../../public/note_atlas.json?raw";
import { GLContext } from "../context";
import { Camera } from "../camera";
import { Note } from "../../audio/note";

export interface NoteStruct {
  start: number,
  duration: number,
  note: Note;
}

export class GTNoteRenderable extends Renderable {
  atlas_tex: Texture;
  batch_renderer: BatchRenderable;

  constructor(gl: WebGL2RenderingContext, notes: NoteStruct[]) {
    super(gl);
    const instance_data = [];
    const size = 32;

    const atlas_info = JSON.parse(atlas_info_json) as AtlasInfo;
    this.atlas_tex = new Texture("note_atlas.png");

    for (const note of notes) {
      let [n, signature, octave] = note.note.to_parts("flat");
      octave -= 3;
      instance_data.push([
        [note.start * size, (Note.note_indices[n] + octave * 7) * size],
        [size, size],
        get_texture_bound(signature ? `${signature}_piano` : "piano", atlas_info),
        0,
      ])
    }

    this.batch_renderer = new BatchRenderable(
      this.gl,
      Quad.vertices,
      2,
      Quad.indices,
      instance_data,
    );
  }

  render(camera: Camera) {
    const program = GLContext.get_program("batch");
    program.bind()

    this.gl.uniformMatrix4fv(
      program.get_uniform("projection"),
      false,
      camera.projection_matrix,
    );

    this.batch_renderer.render();

    program.unbind();
  }

  cleanup() {
    this.atlas_tex.delete();
    this.batch_renderer.cleanup();
  }
}
