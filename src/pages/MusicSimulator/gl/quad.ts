import { GLContext } from "./context";

export class Quad extends GLContext {
  static vertices = new Float32Array([
    -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  ]);
  static indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  static vertex_count = Quad.vertices.length / 2;
  static index_count = Quad.indices.length;

  static sizeof_float = Float32Array.BYTES_PER_ELEMENT;
  static vbo: WebGLBuffer | null;
  static ibo: WebGLBuffer | null;

  static get_vbo(): WebGLBuffer | null {
    if (!Quad.vbo) {
      const vbo = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, Quad.vertices, this.gl.STATIC_DRAW);
      Quad.vbo = vbo;
    }

    this.gl.vertexAttribPointer(
      0,
      2,
      this.gl.FLOAT,
      false,
      2 * Quad.sizeof_float,
      0,
    );
    this.gl.enableVertexAttribArray(0);

    return Quad.vbo;
  }

  static get_ibo(): WebGLBuffer | null {
    if (!Quad.ibo) {
      const ibo = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        Quad.indices,
        this.gl.STATIC_DRAW,
      );
      Quad.ibo = ibo;
    }

    return Quad.ibo
  }
}
