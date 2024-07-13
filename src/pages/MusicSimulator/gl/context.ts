import { Program } from "./program";
import { Renderable } from "./renderable";

export class GLContext {
  static gl: WebGL2RenderingContext;
  static programs: { [key: string]: Program };
  static objects: Renderable[];

  static create(gl: WebGL2RenderingContext) {
    GLContext.gl = gl;
    GLContext.programs = {};
    GLContext.objects = [];
  }

  static add_program(program: Program) {
    GLContext.programs[program.name] = program;
  }

  static get_program(name: string): Program {
    if (!(name in GLContext.programs)) {
      console.error(`Unknown program: ${name}`);
      throw new Error;
    }

    return GLContext.programs[name];
  }

  static add_renderable(obj: Renderable): number {
    this.objects.push(obj);
    return this.objects.length - 1;
  }
}
