#version 300 es
precision mediump float;

layout (location = 0) in vec2 position;

uniform mat4 projection;
uniform mat4 model;
uniform vec3 color;

out vec3 v_color;

void main()
{
  gl_Position = projection * model * vec4(position, 0.0, 1.0);
  v_color = color;
}
