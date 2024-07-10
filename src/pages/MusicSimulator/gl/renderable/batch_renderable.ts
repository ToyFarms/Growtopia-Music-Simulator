import { Renderable } from "../renderable";

export type VertexData = number | number[] | Float32Array;

export class BatchRenderable extends Renderable {
  private instances: VertexData[][];
  vbo: WebGLBuffer | null;
  ibo: WebGLBuffer | null;
  vertices: Float32Array;
  indices: Uint16Array;

  constructor(
    gl: WebGL2RenderingContext,
    vertices: Float32Array,
    element_per_vertex: number,
    indices: Uint16Array,
    instance: VertexData[][],
  ) {
    super(gl);
    this.instances = instance;
    this.vertices = vertices;
    this.indices = indices;

    this.vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const sizeof_float = Float32Array.BYTES_PER_ELEMENT;
    this.gl.vertexAttribPointer(
      0,
      element_per_vertex,
      this.gl.FLOAT,
      false,
      element_per_vertex * sizeof_float,
      0,
    );
    this.gl.enableVertexAttribArray(0);

    this.ibo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      indices,
      this.gl.STATIC_DRAW,
    );

    this.gen_buffer();
  }

  private gen_buffer() {
    let data_count = 0;
    for (const vertex of this.instances[0]) {
      if (typeof vertex === "number") {
        data_count += 1;
      } else if (typeof vertex === "object") {
        data_count += vertex.length;
      }
    }

    const instance_data = new Float32Array(this.instances.length * data_count);

    const sizeof_float = Float32Array.BYTES_PER_ELEMENT;
    this.instances.forEach((instance, i) => {
      let vertex_offset = 0;
      instance.forEach((vertex) => {
        if (typeof vertex === "number") {
          instance_data[i * data_count + vertex_offset] = vertex;
          vertex_offset += 1;
        } else if (typeof vertex === "object") {
          for (const elm of vertex) {
            instance_data[i * data_count + vertex_offset] = elm;
            vertex_offset += 1;
          }
        }
      });
    });

    const instance_buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, instance_buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      instance_data,
      this.gl.STATIC_DRAW,
    );

    const stride = data_count * sizeof_float;
    let index = 1;
    let offset = 0;

    for (const vertex of this.instances[0]) {
      if (typeof vertex === "number") {
        this.gl.vertexAttribPointer(
          index,
          1,
          this.gl.FLOAT,
          false,
          stride,
          offset * sizeof_float,
        );
        offset += 1;
      } else if (typeof vertex === "object") {
        this.gl.vertexAttribPointer(
          index,
          vertex.length,
          this.gl.FLOAT,
          false,
          stride,
          offset * sizeof_float,
        );
        offset += vertex.length;
      }

      this.gl.enableVertexAttribArray(index);
      this.gl.vertexAttribDivisor(index, 1);

      index += 1;
    }
  }

  render() {
    this.gl.drawElementsInstanced(
      this.gl.TRIANGLES,
      this.indices.length,
      this.gl.UNSIGNED_SHORT,
      0,
      this.instances.length,
    );
  }
}
