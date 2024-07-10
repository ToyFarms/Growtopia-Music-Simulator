import { vec2, vec4 } from "gl-matrix";

export class Quad {
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
    this.pos = pos;
    this.size = size;
    this.texcoord = texcoord;
    this.rotation = rotation || 0;
  }
}
