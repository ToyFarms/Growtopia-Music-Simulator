import { vec4 } from "gl-matrix";

export interface AtlasInfo {
  size: [number, number];
  tex_size: [number, number];
  tex_count: number;
  tex_in_row: number;
  textures: {[key: string]: [number, number]};
}

export const get_texture_bound = (index_or_name: number | string, info: AtlasInfo): vec4 => {
  let index = 0;
  if (typeof index_or_name === "string")
    index = get_texture_index(index_or_name, info);
  else
    index = index_or_name;

  const x = (index % info.tex_in_row) * info.tex_size[0];
  const y = Math.floor(index / info.tex_in_row) * info.tex_size[1];
  return [
    x / info.size[0],
    y / info.size[1],
    (x + info.tex_size[0]) / info.size[0],
    (y + info.tex_size[1]) / info.size[1],
  ] as vec4;
}

export const get_texture_index = (name: string, info: AtlasInfo): number => {
  const [w, h] = info.textures[name];
  return (h / info.tex_size[1]) * info.tex_in_row + (w / info.tex_size[0]);
}
