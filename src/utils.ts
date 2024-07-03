import { mat4, vec2, vec3, } from "gl-matrix";
import { Camera } from "./camera";

export const date_format = (format: string): string => {
  const date = new Date();
  const map: { [key: string]: string | number } = {
    yyyy: date.getFullYear(),
    MM: String(date.getMonth() + 1).padStart(2, "0"),
    dd: String(date.getDate()).padStart(2, "0"),
    HH: String(date.getHours()).padStart(2, "0"),
    mm: String(date.getMinutes()).padStart(2, "0"),
    ss: String(date.getSeconds()).padStart(2, "0"),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getHours() < 12 ? "AM" : "PM",
  };

  return format.replace(/yyyy|MM|dd|HH|mm|ss|M|d|H|m|s|a/g, (matched) => {
    return map[matched].toString();
  });
};

export const screen_to_world = (camera: Camera, screen: vec2): vec2 => {
  const inv = mat4.create();
  mat4.invert(inv, camera.projection_matrix);

  const ndc: vec3 = [
    screen[0] / camera.width * 2 -1,
    1 - (screen[1] / camera.height) * 2,
    0
  ];
  const world = vec3.create();
  vec3.transformMat4(world, ndc, inv);

  return [world[0], world[1]];
};

export const lerp = (v0: number, v1: number, t: number): number => {
  return v0 + t * (v1 - v0);
};
export const lerp2 = (v0: vec2, v1: vec2, t: number): vec2 => {
  return [v0[0] + t * (v1[0] - v0[0]), v0[1] + t * (v1[1] - v0[1])];
};
export const set_if_close = (
  n: number,
  set: number,
  thresh?: number,
): number => {
  return Math.abs(n - set) < (thresh || 0.001) ? set : n;
};

export const is_power_of_2 = (n: number): boolean => {
  return (n & (n - 1)) === 0;
}
