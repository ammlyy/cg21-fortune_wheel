#version 300 es

in vec3 inPosition;
in vec3 inNormal;
in vec2 in_uv;

uniform mat4 matrix; 
uniform mat4 normMatrix;
uniform mat4 posMatrix;

out vec3 fsNormal;
out vec2 fsUV;
out vec3 fs_pos; 

void main() {
  fsNormal = mat3(normMatrix)*inNormal;
  fs_pos = (posMatrix * vec4(inPosition, 1.0)).xyz;
  fsUV = in_uv;
  
  gl_Position = matrix * vec4(inPosition, 1.0);
  
}