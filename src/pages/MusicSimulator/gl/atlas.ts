import { vec4 } from "gl-matrix";

export interface AtlasInfo {
  size: [number, number];
  tex_size: [number, number];
  tex_count: number;
  tex_in_row: number;
}

export const get_texture_bound = (index: number, info: AtlasInfo): vec4 => {
  const x = (index % info.tex_in_row) * info.tex_size[0];
  const y = Math.floor(index / info.tex_in_row) * info.tex_size[1];
  return [
    x / info.size[0],
    y / info.size[1],
    (x + info.tex_size[0]) / info.size[0],
    (y + info.tex_size[1]) / info.size[1],
  ] as vec4;
}
