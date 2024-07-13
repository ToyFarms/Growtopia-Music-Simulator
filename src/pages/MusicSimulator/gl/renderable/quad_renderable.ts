import { mat4, vec2, vec3 } from "gl-matrix";
import { Renderable } from "../renderable";
import { Camera } from "../camera";
import { GLContext } from "../context";
import { Quad } from "../quad";

export class QuadRenderable extends Renderable {
  pos: vec2;
  size: vec2;
  color: vec3;
  model_matrix: mat4;

  constructor(gl: WebGL2RenderingContext, pos: vec2, size: vec2, color: vec3 = [255, 255, 255]) {
    super(gl);
    this.pos = pos;
    this.size = size;
    this.color = color;
    this.model_matrix = mat4.create();
  }

  update_model_matrix() {
    const model = mat4.create();

    mat4.translate(model, model, [this.pos[0], this.pos[1], 0]);
    mat4.scale(model, model, [this.size[0], this.size[1], 0]);

    this.model_matrix = model;
  }

  render(camera: Camera): void {
    const program = GLContext.get_program("default");
    program.bind();

    this.gl.uniformMatrix4fv(
      program.get_uniform("projection"),
      false,
      camera.projection_matrix,
    );
    this.update_model_matrix();
    this.gl.uniformMatrix4fv(
      program.get_uniform("model"),
      false,
      this.model_matrix,
    );
    this.gl.uniform3f(
      program.get_uniform("color"),
      this.color[0] / 255, this.color[1] / 255, this.color[2] / 255
    )

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Quad.get_vbo());
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Quad.get_ibo());
    this.gl.drawElements(
      this.gl.TRIANGLES,
      Quad.indices.length,
      this.gl.UNSIGNED_SHORT,
      0,
    );

    program.unbind();
  }
}
