import { GLContext } from "./context";

export enum ShaderType {
  FRAGMENT = 0,
  VERTEX,
}

export interface ShaderStruct {
  type: ShaderType;
  source: string;
}

export class Program extends GLContext {
  shaders: ShaderStruct[];
  program: WebGLProgram;
  name: string;
  gl: WebGL2RenderingContext;

  constructor(name: string, shaders: ShaderStruct[]) {
    super();

    this.shaders = shaders;
    this.gl = Program.gl;

    const id = this.gl.createProgram();
    if (!id) {
      console.error("Cannot create program");
      throw new Error;
    }
    this.program = id;
    this.name = name;

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
      console.error(`Could not get uniform "${name}"`);
      throw new Error();
    }

    return uniform;
  }

  private link() {
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      const err = this.gl.getProgramInfoLog(this.program);
      if (err) {
        console.error(`Failed to link shader: ${err}`);
        return;
      }
    }
  }

  private process_shaders(shaders: ShaderStruct[]) {
    for (const s of shaders) {
      const shader = this.shader_compile(s.source, s.type);
      if (!shader) throw new Error();

      this.gl.attachShader(this.program, shader);
      this.gl.deleteShader(shader);
    }

    this.link();
  }

  private shader_compile(source: string, type: ShaderType) {
    const mapping: GLint[] = [this.gl.FRAGMENT_SHADER, this.gl.VERTEX_SHADER];

    const shader = this.gl.createShader(mapping[type]);
    if (!shader) {
      console.error(`Failed to create shader type ${type}`);
      return null;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const err = this.gl.getShaderInfoLog(shader);
      if (err) {
        console.error(
          `Failed to compile shader type ${ShaderType[type]}: ${err}`,
        );
        return null;
      }
    }

    return shader;
  }
}
