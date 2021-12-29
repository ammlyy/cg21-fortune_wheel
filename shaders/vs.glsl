#version 300 es

in vec3 inPosition;
in vec3 inNormal;
in vec2 in_uv;

uniform mat4 matrix; 
uniform mat4 normalMatrix;
uniform mat4 posMatrix;

out vec3 fsNormal;
out vec2 fsUV;
out vec3 fs_pos; 

void main() {
  fsUV = in_uv;
  fs_pos = mat3(posMatrix) * inPosition;
  fsNormal = mat3(normalMatrix) * inNormal;

  gl_Position = matrix * vec4(inPosition, 1.0);
}