import { mat4, vec2 } from "gl-matrix";
import { InputHandler, Key } from "./input";
import { screen_to_world } from "./utils";

export class Camera {
  width: number;
  height: number;
  pos: vec2;
  zoom: number;
  speed: number;
  projection_matrix: mat4;
  start_drag: vec2 | null;
  offset: vec2;

  constructor(
    width: number,
    height: number,
    speed?: number,
  ) {
    this.width = width;
    this.height = height;
    this.pos = [0, 0];
    this.zoom = 1;
    this.speed = speed || 500;
    this.projection_matrix = mat4.create();
    this.start_drag = null;
    this.offset = [0, 0];
  }

  private handle_zoom(input: InputHandler) {
    this.zoom += -Math.sign(input.mouse.wheel.y) * (this.zoom * 0.6);
    this.zoom = Math.min(Math.max(this.zoom, 0.1), 10);

    const pre = screen_to_world(this, input.mouse.pos);
    this.update_projection_matrix();
    const post = screen_to_world(this, input.mouse.pos);

    this.pos[0] += pre[0] - post[0];
    this.pos[1] += pre[1] - post[1];
  }

  private handle_drag(input: InputHandler) {
    if (!this.start_drag) return;
    this.offset[0] = (this.start_drag[0] - input.mouse.pos[0]) / this.zoom;
    this.offset[1] = (this.start_drag[1] - input.mouse.pos[1]) / this.zoom;
  }

  update(input: InputHandler, dt: number) {
    let speed = (1 / this.zoom) * 2 * this.speed * dt;
    if (input.keydown(Key.SHIFT)) speed *= 5;
    if (input.keydown(Key.W)) this.pos[1] += -speed;
    if (input.keydown(Key.A)) this.pos[0] += -speed;
    if (input.keydown(Key.S)) this.pos[1] += speed;
    if (input.keydown(Key.D)) this.pos[0] += speed;

    if (input.mouse.left && this.start_drag === null)
      this.start_drag = [...input.mouse.pos] as vec2;
    else if (input.mouse.left && this.start_drag)
      this.handle_drag(input);
    else if (!input.mouse.left && this.start_drag) {
      this.start_drag = null;
      this.pos[0] += this.offset[0];
      this.pos[1] += this.offset[1];
      this.offset = [0, 0];
    }

    if (input.mouse.wheel.y)
      this.handle_zoom(input);

    this.update_projection_matrix();
  }

  update_projection_matrix() {
    const projection = mat4.create();

    const left = this.pos[0] + this.offset[0];
    const right = this.pos[0] + this.offset[0] + this.width / this.zoom;
    const top = this.pos[1] + this.offset[1];
    const bottom = this.pos[1] + this.offset[1] + this.height / this.zoom;

    mat4.ortho(projection, left, right, bottom, top, -1, 1);

    this.projection_matrix = projection;
  }
}
