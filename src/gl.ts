import * as logger from "./logger.ts";

let gl: WebGL2RenderingContext | null;

const app = document.querySelector("#app");
const canvas = app?.querySelector("canvas");

export const gl_context = (): WebGL2RenderingContext => {
  if (gl)
    return gl;

  if (!canvas) {
    logger.log_error("Could not find canvas element");
    throw new Error("opengl_context() error");
  }

  gl = canvas.getContext("webgl2");

  if (!gl) {
    logger.log_error("WebGl is not supported in this device");
    throw new Error("opengl_context() error");
  }

  return gl;
}

export abstract class GLContext {
  gl: WebGL2RenderingContext;
  constructor() {
    this.gl = gl_context();
  }
}

export abstract class GLObject extends GLContext {
  id: number;

  abstract bind(): void;
  abstract unbind(): void;
  abstract delete(): void;
}
