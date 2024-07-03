import { GLContext } from "./gl";
import { mat4, vec2, vec4 } from "gl-matrix";

export class Quad extends GLContext {
  static vertices = new Float32Array([
    -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  ]);
  static indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  static vertex_count = Quad.vertices.length / 2;
  static index_count = Quad.indices.length;

  pos: vec2;
  size: vec2;
  texcoord: vec4;
  rotation: number;

  constructor(pos: vec2, size: vec2, texcoord: vec4, rotation?: number) {
    super();

    this.pos = pos;
    this.size = size;
    this.texcoord = texcoord;
    this.rotation = rotation || 0;
  }

  get_model_matrix(): mat4 {
    const model_mat = mat4.create();

    mat4.translate(model_mat, model_mat, [this.pos[0], this.pos[1], 0]);
    mat4.scale(model_mat, model_mat, [this.size[0], this.size[1], 0]);
    mat4.rotateZ(model_mat, model_mat, this.rotation * (Math.PI / 180));

    return model_mat;
  }

  static setup_instanced_attributes(
    gl: WebGL2RenderingContext,
    quads: Quad[],
  ) {
    const data_count = 9;
    const instance_data = new Float32Array(quads.length * data_count);

    const sizeof_float = Float32Array.BYTES_PER_ELEMENT;
    quads.forEach((quad, i) => {
      instance_data[i * data_count + 0] = quad.pos[0];
      instance_data[i * data_count + 1] = quad.pos[1];
      instance_data[i * data_count + 2] = quad.size[0];
      instance_data[i * data_count + 3] = quad.size[1];
      instance_data[i * data_count + 4] = quad.texcoord[0];
      instance_data[i * data_count + 5] = quad.texcoord[1];
      instance_data[i * data_count + 6] = quad.texcoord[2];
      instance_data[i * data_count + 7] = quad.texcoord[3];
      instance_data[i * data_count + 8] = quad.rotation * (Math.PI / 180);
    });

    const instance_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instance_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, instance_data, gl.STATIC_DRAW);

    const stride = data_count * sizeof_float;

    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribDivisor(1, 1);

    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 2 * sizeof_float);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribDivisor(2, 1);

    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, stride, 4 * sizeof_float);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribDivisor(3, 1);

    gl.vertexAttribPointer(4, 1, gl.FLOAT, false, stride, 8 * sizeof_float);
    gl.enableVertexAttribArray(4);
    gl.vertexAttribDivisor(4, 1);
  }
}
