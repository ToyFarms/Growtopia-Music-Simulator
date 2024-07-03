import { GLObject } from "./gl";
import { log_error } from "./logger";
import { ShaderType, shader_compile } from "./shader";

export interface ShaderStruct {
  id: string;
  type: ShaderType;
  source: string;
}

export class Program extends GLObject {
  shaders: ShaderStruct[];
  program: WebGLProgram;

  constructor(shaders: ShaderStruct[]) {
    super();
    this.shaders = shaders;

    const id = this.gl.createProgram();
    if (!id) {
      log_error("Cannot create program");
      throw new Error
    }
    this.program = id;

    this.process_shaders(shaders);
  }

  bind(): void {
    this.gl.useProgram(this.program);
  }

  unbind(): void {
      this.gl.useProgram(null);
  }

  delete(): void {
      this.gl.deleteProgram(this.program);
  }

  get_uniform(name: string): WebGLUniformLocation {
    const uniform = this.gl.getUniformLocation(this.program, name);
    if (!uniform) {
      log_error(`Could not get uniform "${name}"`);
      throw new Error;
    }

    return uniform
  }

  private link() {
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      const err = this.gl.getProgramInfoLog(this.program);
      if (err) {
        log_error(`Failed to link shader: ${err}`);
        return;
      }
    }
  }

  private process_shaders(shaders: ShaderStruct[]) {
    for (const s of shaders) {
      const shader = shader_compile(s.source, s.type);
      if (!shader)
        throw new Error;

      this.gl.attachShader(this.program, shader);
      this.gl.deleteShader(shader);
    }

    this.link();
  }
}
