export const default_frag =
`#version 300 es
precision mediump float;

in vec2 v_texcoord;
out vec4 frag_color;

uniform sampler2D tex;

void main()
{
  frag_color = texture(tex, v_texcoord);
}
`

export const default_vert =
`#version 300 es
precision mediump float;

layout (location = 0) in vec2 position;
layout (location = 1) in vec2 offset;
layout (location = 2) in vec2 scale;
layout (location = 3) in vec4 texcoord;
layout (location = 4) in float rotation;

uniform mat4 projection;

out vec2 v_texcoord;

void main()
{
  float cos_rot = cos(rotation);
  float sin_rot = sin(rotation);

  mat2 rot_matrix = mat2(
    cos_rot, -sin_rot,
    sin_rot, cos_rot
  );

  vec2 rotated_scaled = rot_matrix * (position * scale);

  gl_Position = projection * vec4(rotated_scaled + offset, 0.0, 1.0);
  v_texcoord = mix(texcoord.xy, texcoord.zw, position + 0.5);
}
`
