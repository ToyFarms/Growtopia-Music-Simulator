import { AtlasInfo, get_texture_bound } from "../atlas";
import { Quad } from "../quad";
import { Renderable } from "../renderable";
import { Texture } from "../texture";
import { BatchRenderable } from "./batch_renderable";
import atlas_info_json from "../../public/note_atlas.json?raw";
import { GLContext } from "../context";
import { Camera } from "../camera";

export class GTNoteRenderable extends Renderable {
  atlas_tex: Texture;
  batch_renderer: BatchRenderable;

  constructor(gl: WebGL2RenderingContext) {
    super(gl);
    const instance_data = [];
    const size = 32;

    const atlas_info = JSON.parse(atlas_info_json) as AtlasInfo;
    this.atlas_tex = new Texture("note_atlas.png");

    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        instance_data.push([
          [x * size, y * size],
          [size, size],
          get_texture_bound((x * y) % atlas_info.tex_count, atlas_info),
          0,
        ]);
      }
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
    const program = GLContext.get_program("default");
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
  }
}
