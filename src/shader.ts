import { gl_context } from "./gl";
import { log_error } from "./logger";

export enum ShaderType {
  FRAGMENT = 0,
  VERTEX,
}

export const shader_compile = (source: string, type: ShaderType) => {
  const gl = gl_context();

  const mapping: GLint[] = [
    gl.FRAGMENT_SHADER,
    gl.VERTEX_SHADER,
  ];

  const shader = gl.createShader(mapping[type]);
  if (!shader) {
    log_error(`Failed to create shader type ${type}`);
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = gl.getShaderInfoLog(shader);
    if (err) {
      log_error(`Failed to compile shader type ${ShaderType[type]}: ${err}`);
      return null;
    }
  }

  return shader;
}

