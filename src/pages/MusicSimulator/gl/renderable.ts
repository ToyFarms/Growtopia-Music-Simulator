import { Camera } from "./camera";

export abstract class Renderable {
  gl: WebGL2RenderingContext;
  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }
  abstract render(camera: Camera): void;
  abstract cleanup(): void;
}
