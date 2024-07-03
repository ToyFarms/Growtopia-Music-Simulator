import "./style.css";
import { gl_context } from "./gl.ts";
import { Program } from "./program.ts";
import { ShaderType } from "./shader.ts";
import { default_frag, default_vert } from "./shader_source.ts";
import { Quad } from "./quad.ts";
import { Camera } from "./camera.ts";
import { InputHandler } from "./input.ts";
import { vec4 } from "gl-matrix";
import { Texture } from "./texture.ts";

(async () => {
  const gl = gl_context();

  const app = document.querySelector("#app");
  const canvas = app?.querySelector("canvas");
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const program = new Program([
    {
      id: "default",
      type: ShaderType.FRAGMENT,
      source: default_frag,
    },
    {
      id: "default",
      type: ShaderType.VERTEX,
      source: default_vert,
    },
  ]);

  program.bind();

  interface AtlasInfo {
    size: [number, number];
    tex_size: [number, number];
    tex_count: number;
    tex_in_row: number,
  }

  const atlas_info: AtlasInfo = await fetch(
    "../assets/note_atlas.json",
  ).then(async (r) => await r.json());

  const get_texture_bound = (index: number): vec4 => {
    const x = (index % atlas_info.tex_in_row) * atlas_info.tex_size[0];
    const y = Math.floor(index / atlas_info.tex_in_row) * atlas_info.tex_size[1];
    return [
      x / atlas_info.size[0],
      y / atlas_info.size[1],
      (x + atlas_info.tex_size[0]) / atlas_info.size[0],
      (y + atlas_info.tex_size[1]) / atlas_info.size[1],
    ] as vec4;
  }

  const atlas_tex = new Texture("../assets/note_atlas.png");

  const input_handler = new InputHandler();
  const camera = new Camera(canvas.width, canvas.height);
  const quads: Quad[] = [];
  const size = 32;
  for (let i = 0; i < 100; i++) {
    quads.push(new Quad([i * size, i * size], [size, size], get_texture_bound(i % atlas_info.tex_count)));
  }

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, Quad.vertices, gl.STATIC_DRAW);

  const sizeof_float = Float32Array.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 2 * sizeof_float, 0);
  gl.enableVertexAttribArray(0);

  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Quad.indices, gl.STATIC_DRAW);

  Quad.setup_instanced_attributes(gl, quads);

  let last_frame_time = -1;
  const render = (now: number) => {
    if (!gl) return;

    const dt = last_frame_time > 0 ? (now - last_frame_time) / 1000 : 1;
    last_frame_time = now;

    gl.clearColor(30 / 255, 30 / 255, 30 / 255, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.update(input_handler, dt);

    gl.uniformMatrix4fv(
      program.get_uniform("projection"),
      false,
      camera.projection_matrix,
    );

    atlas_tex.bind();
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      Quad.index_count,
      gl.UNSIGNED_SHORT,
      0,
      quads.length,
    );

    requestAnimationFrame(render);
  };

  gl.viewport(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(render);
})();
